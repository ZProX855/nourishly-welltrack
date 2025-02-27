
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const USDA_API_KEY = Deno.env.get('USDA_API_KEY');
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

async function searchUSDA(query: string) {
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&dataType=SR%20Legacy,Survey%20(FNDDS),Foundation,Branded&pageSize=1`
    );
    
    if (!response.ok) {
      throw new Error('USDA API request failed');
    }

    const data = await response.json();
    if (data.foods && data.foods.length > 0) {
      const food = data.foods[0];
      const nutrients = food.foodNutrients;
      
      return {
        calories: nutrients.find((n: any) => n.nutrientName === "Energy")?.value || 0,
        protein: nutrients.find((n: any) => n.nutrientName === "Protein")?.value || 0,
        carbs: nutrients.find((n: any) => n.nutrientName === "Carbohydrate, by difference")?.value || 0,
        fat: nutrients.find((n: any) => n.nutrientName === "Total lipid (fat)")?.value || 0,
        fiber: nutrients.find((n: any) => n.nutrientName === "Fiber, total dietary")?.value || 0,
      };
    }
    return null;
  } catch (error) {
    console.error('USDA API Error:', error);
    return null;
  }
}

async function getNutritionFromAI(food: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
  
  const prompt = `You are a nutrition expert. Please provide accurate nutritional information for 100g of ${food}. 
  Return ONLY a JSON object with these fields (all numbers):
  {
    "calories": calories in kcal,
    "protein": grams of protein,
    "carbs": grams of carbohydrates,
    "fat": grams of fat,
    "fiber": grams of fiber
  }
  Use your knowledge and reliable sources to provide accurate values. Return ONLY the JSON object, no other text.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('AI Response parsing error:', error);
    return null;
  }
}

async function analyzeImage(imageBase64: string, weight: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-vision-latest" });

  const prompt = `You are a nutrition expert analyzing this food image. Please:
  1. List all identifiable foods and ingredients
  2. For the entire meal (${weight}g), estimate:
  - Calories (kcal)
  - Protein (g)
  - Carbohydrates (g)
  - Fat (g)
  - Fiber (g)
  
  Return ONLY a JSON object in this format:
  {
    "identified_foods": ["food1", "food2", ...],
    "nutrition": {
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "fiber": number
    }
  }`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(",")[1]
        }
      }
    ]);
    const response = result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('AI image analysis parsing error:', error);
      return null;
    }
  } catch (error) {
    console.error('AI image analysis error:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, message, weight } = await req.json();

    if (type === 'food') {
      // First try USDA database
      const usdaData = await searchUSDA(message.replace('Provide nutritional information for ', ''));
      
      if (usdaData) {
        console.log('Using USDA data for:', message);
        return new Response(JSON.stringify(usdaData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // If USDA fails, use AI
      console.log('USDA data not found, using AI for:', message);
      const aiData = await getNutritionFromAI(message.replace('Provide nutritional information for ', ''));
      
      if (!aiData) {
        throw new Error('Failed to get nutritional information');
      }

      return new Response(JSON.stringify(aiData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (type === 'image') {
      const analysisResult = await analyzeImage(message, weight);
      
      if (!analysisResult) {
        throw new Error('Failed to analyze image');
      }

      return new Response(JSON.stringify(analysisResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (type === 'chat') {
      const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: "You are a friendly and knowledgeable nutrition assistant. Be concise but helpful."
          },
          {
            role: "model",
            parts: "I understand. I'll provide helpful, accurate, and concise nutrition advice."
          }
        ]
      });

      const result = await chat.sendMessage(message);
      const response = result.response;
      const text = response.text();

      return new Response(JSON.stringify(text), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    throw new Error('Invalid request type');
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
