
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    let systemPrompt = '';
    if (type === 'chat') {
      systemPrompt = `You are a friendly and knowledgeable nutrition doctor. 
        Always respond in a well-organized format using bullet points.
        Use appropriate emojis to make the conversation engaging.
        Keep responses medium length and conversational.
        Focus on providing practical nutrition advice and wellness tips.`;
    } else if (type === 'food') {
      systemPrompt = `You are a nutrition database assistant. For the given food item, provide accurate nutritional information in the following JSON format:
        {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "fiber": number
        }
        Provide realistic values per 100g of the food item.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data.choices[0].message.content), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
