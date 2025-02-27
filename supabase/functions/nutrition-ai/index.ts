
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, message } = await req.json();
    console.log('Request type:', type);
    console.log('Message:', message);

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    let prompt = '';
    if (type === 'chat') {
      prompt = `You are a friendly nutrition expert assistant. Always provide your responses with emojis and bullet points where appropriate. Answer the following question about nutrition, diet, or wellness in a conversational tone: ${message}`;
    } else if (type === 'food') {
      prompt = `For the given food item, provide accurate nutritional information per 100g. 
      Return ONLY a JSON object in this exact format, with numerical values:
      {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "fiber": number
      }
      
      Food item: ${message}`;
    } else if (type === 'image') {
      prompt = `Analyze this image of food and provide a detailed breakdown of the meal's contents, estimated portions, and nutritional value. Be specific but conversational: ${message}`;
    }

    console.log('Sending prompt to Gemini:', prompt);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error('Failed to get response from Gemini API');
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    let result = data.candidates[0].content.parts[0].text;

    // For food type requests, ensure we return valid JSON
    if (type === 'food') {
      try {
        // Try to parse the response as JSON
        let nutritionData;
        try {
          nutritionData = JSON.parse(result);
        } catch {
          // If parsing fails, try to extract JSON from the text
          const jsonMatch = result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            nutritionData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Could not extract JSON from response');
          }
        }

        // Validate the structure
        if (!nutritionData.calories || !nutritionData.protein || 
            !nutritionData.carbs || !nutritionData.fat || !nutritionData.fiber) {
          throw new Error('Invalid nutrition data format');
        }

        // Return the validated JSON data
        return new Response(JSON.stringify(nutritionData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error parsing nutrition data:', error);
        throw new Error('Failed to parse nutrition data');
      }
    }

    // For chat and image types, return the text response
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

