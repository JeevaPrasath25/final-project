
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type } = await req.json();

    // Get the API key from environment variable
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Making request to OpenAI API with ${type} prompt:`, prompt);

    // Create proper string headers - this is the key fix
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    console.log('Sending request to OpenAI with headers:', 
      JSON.stringify({
        Authorization: `Bearer ${apiKey.substring(0, 5)}...`,
        'Content-Type': 'application/json'
      })
    );

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: type === 'floorplan' 
          ? `Professional architectural floor plan showing ${prompt}. Top-down view, clean lines, measurements included, room labels, modern CAD style.`
          : `Professional architectural visualization: ${prompt}. Photorealistic 3D rendering, modern architectural style.`,
        n: 1,
        size: "1024x1024",
        quality: "hd",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Failed to generate image');
    }

    console.log('OpenAI API response:', data);

    return new Response(
      JSON.stringify({
        image: data.data?.[0]?.url,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
