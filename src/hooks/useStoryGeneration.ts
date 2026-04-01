import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StoryScene {
  sceneNumber: number;
  caption: string;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface GeneratedStory {
  title: string;
  fullText: string;
  scenes: StoryScene[];
}

type GenerationStep = "idle" | "generating-story" | "generating-images" | "done" | "error";

export function useStoryGeneration() {
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [step, setStep] = useState<GenerationStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [imageProgress, setImageProgress] = useState(0);

  const generateStory = useCallback(async (prompt: string) => {
    setStep("generating-story");
    setError(null);
    setStory(null);
    setImageProgress(0);

    try {
      // Step 1: Generate story text
      const { data: storyData, error: storyError } = await supabase.functions.invoke("generate-story", {
        body: { prompt },
      });

      if (storyError) throw new Error(storyError.message || "Failed to generate story");
      if (storyData?.error) throw new Error(storyData.error);

      const generatedStory: GeneratedStory = storyData;
      setStory(generatedStory);

      // Step 2: Generate images for each scene
      setStep("generating-images");
      const scenesWithImages = [...generatedStory.scenes];

      for (let i = 0; i < scenesWithImages.length; i++) {
        try {
          const { data: imgData, error: imgError } = await supabase.functions.invoke("generate-scene-image", {
            body: { prompt: scenesWithImages[i].imagePrompt },
          });

          if (!imgError && imgData?.imageUrl) {
            scenesWithImages[i] = { ...scenesWithImages[i], imageUrl: imgData.imageUrl };
          }
        } catch {
          // Use a placeholder color gradient if image generation fails
          console.warn(`Failed to generate image for scene ${i + 1}`);
        }
        setImageProgress(i + 1);
        setStory({ ...generatedStory, scenes: [...scenesWithImages] });
      }

      setStory({ ...generatedStory, scenes: scenesWithImages });
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
      setStep("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStory(null);
    setStep("idle");
    setError(null);
    setImageProgress(0);
  }, []);

  return { story, step, error, imageProgress, generateStory, reset };
}
