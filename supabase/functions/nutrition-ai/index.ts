import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const USDA_API_KEY = 'yJ60gexnk0HR6Dz3vncFHCWP9m5Ius1vnEKEmoNm';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function searchFoodInUSDA(query: string) {
  try {
    const searchResponse = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=1`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to fetch from USDA API');
    }

    const searchData = await searchResponse.json();
    if (!searchData.foods || searchData.foods.length === 0) {
      throw new Error('No food found in USDA database');
    }

    const food = searchData.foods[0];
    const nutrients = food.foodNutrients;

    // Map USDA nutrients to our format
    const nutritionData = {
      calories: nutrients.find((n: any) => n.nutrientNumber === '208')?.value || 0,
      protein: nutrients.find((n: any) => n.nutrientNumber === '203')?.value || 0,
      carbs: nutrients.find((n: any) => n.nutrientNumber === '205')?.value || 0,
      fat: nutrients.find((n: any) => n.nutrientNumber === '204')?.value || 0,
      fiber: nutrients.find((n: any) => n.nutrientNumber === '291')?.value || 0,
    };

    return nutritionData;
  } catch (error) {
    console.error('USDA API error:', error);
    throw error;
  }
}

async function analyzeImageWithGemini(imageBase64: string) {
  try {
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
              text: `Analyze this image of food and list each identifiable food item (no portion sizes needed): ${imageBase64}`
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
      throw new Error('Failed to analyze image with Gemini');
    }

    const data = await response.json();
    const foodList = data.candidates[0].content.parts[0].text;
    return foodList;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, message, weight } = await req.json();
    console.log('Request type:', type);
    console.log('Message:', message);

    if (type === 'food') {
      const nutritionData = await searchFoodInUSDA(message);
      
      if (weight) {
        const multiplier = parseFloat(weight) / 100;
        Object.keys(nutritionData).forEach(key => {
          nutritionData[key] = Math.round(nutritionData[key] * multiplier * 10) / 10;
        });
      }

      return new Response(JSON.stringify(nutritionData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (type === 'image') {
      const foodList = await analyzeImageWithGemini(message);
      if (weight) {
        // If weight is provided, get nutrition info for the identified foods
        const foods = foodList.split('\n').filter(f => f.trim());
        const nutritionPromises = foods.map(food => searchFoodInUSDA(food.trim()));
        const nutritionResults = await Promise.all(nutritionPromises);
        
        // Combine nutrition data and apply weight multiplier
        const totalNutrition = nutritionResults.reduce((acc, curr) => {
          Object.keys(curr).forEach(key => {
            acc[key] = (acc[key] || 0) + curr[key];
          });
          return acc;
        }, {});

        const multiplier = parseFloat(weight) / 100;
        Object.keys(totalNutrition).forEach(key => {
          totalNutrition[key] = Math.round(totalNutrition[key] * multiplier * 10) / 10;
        });

        return new Response(JSON.stringify({
          identified_foods: foods,
          nutrition: totalNutrition
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ identified_foods: foodList }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (type === 'chat') {
      let prompt = `You are a friendly nutrition expert assistant. Always provide your responses with emojis and bullet points where appropriate. Answer the following question about nutrition, diet, or wellness in a conversational tone: ${message}`;
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

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid request type');
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
