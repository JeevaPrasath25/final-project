
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()
    
    // Get the Hugging Face access token from environment variables
    const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    
    if (!huggingFaceToken) {
      console.error('HUGGING_FACE_ACCESS_TOKEN is not set')
      return new Response(
        JSON.stringify({ 
          error: 'Configuration error', 
          details: 'API token not configured' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Making request to Hugging Face API with prompt:', prompt)
    const hf = new HfInference(huggingFaceToken)

    const image = await hf.textToImage({
      inputs: prompt,
      model: 'black-forest-labs/FLUX.1-schnell',
    })

    // Convert the blob to a base64 string
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    console.log('Image generation successful')
    return new Response(
      JSON.stringify({ image: `data:image/png;base64,${base64}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    
    // More specific error message
    const errorMessage = error.message || 'Unknown error'
    const statusCode = errorMessage.includes('Invalid username or password') ? 401 : 500
    
    return new Response(
      JSON.stringify({ 
        error: 'Image generation failed', 
        details: errorMessage,
        tip: statusCode === 401 ? 'Please check if your Hugging Face access token is valid' : 'Please try again later'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: statusCode }
    )
  }
})
