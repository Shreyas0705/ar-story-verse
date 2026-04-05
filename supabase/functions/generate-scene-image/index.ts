import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function tryGenerateImage(prompt: string, apiKey: string): Promise<string | null> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [
        { role: "user", content: `Generate a beautiful children's book illustration: ${prompt}. Style: colorful, whimsical, digital art, vibrant.` }
      ],
      modalities: ["image", "text"],
    }),
  });

  if (!response.ok) {
    console.error("AI response status:", response.status);
    if (response.status === 429 || response.status === 402) {
      throw { status: response.status };
    }
    return null;
  }

  const data = await response.json();
  
  // Try multiple paths to find the image
  const imageUrl =
    data.choices?.[0]?.message?.images?.[0]?.image_url?.url ||
    data.choices?.[0]?.message?.images?.[0]?.url ||
    data.choices?.[0]?.message?.content?.match?.(/data:image[^"'\s]+/)?.[0];

  if (imageUrl) return imageUrl;

  console.log("Response structure (no image found):", JSON.stringify(Object.keys(data.choices?.[0]?.message || {})));
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Image prompt is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Retry up to 2 times
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const imageUrl = await tryGenerateImage(prompt, LOVABLE_API_KEY);
        if (imageUrl) {
          return new Response(JSON.stringify({ imageUrl }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.log(`Attempt ${attempt + 1}: No image in response, retrying...`);
      } catch (e: any) {
        if (e?.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (e?.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw e;
      }
    }

    // After retries, return a graceful failure
    return new Response(JSON.stringify({ error: "Image generation temporarily unavailable", imageUrl: null }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-scene-image error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Failed to generate image" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
