
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = "AIzaSyDzej4LFfQcsnqOdxZTGzysX6d7bcMUA3g";

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

    let prompt = '';
    if (type === 'chat') {
      prompt = `You are a friendly nutrition doctor. Respond in a well-organized format using bullet points.
        Use appropriate emojis to make the conversation engaging. Keep responses medium length and conversational.
        Focus on providing practical nutrition advice and wellness tips.
        
        User message: ${message}`;
    } else if (type === 'food') {
      prompt = `For the given food item, provide accurate nutritional information per 100g in JSON format:
        ${message}
        
        Respond only with a JSON object in this format:
        {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "fiber": number
        }`;
    } else if (type === 'image') {
      prompt = `Analyze this image and identify the food items present. For each food item, estimate its portion size
        and provide nutritional information. Format the response as JSON. Image data: ${message}`;
    }

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

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    return new Response(
      type === 'food' ? generatedText : JSON.stringify(generatedText),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
