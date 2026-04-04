import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

const CRISIS_KEYWORDS = [
  "suicide",
  "suicidal",
  "kill myself",
  "end my life",
  "harm myself",
  "self harm",
  "overdose",
  "cutting",
  "want to die",
  "hopeless",
  "no point in living",
];

const WELLNESS_SYSTEM_PROMPT = `You are a compassionate and empathetic AI Wellness Companion designed to provide mental health support. Your role is to:

1. Listen actively and validate the user's feelings
2. Ask clarifying questions to better understand their situation
3. Provide evidence-based coping strategies and techniques
4. Offer perspective and gentle guidance
5. Encourage professional help when appropriate
6. Maintain a warm, non-judgmental tone

Important guidelines:
- Always prioritize the user's safety and wellbeing
- If the user mentions self-harm or suicide, immediately acknowledge their pain and provide crisis resources
- Never diagnose mental health conditions
- Encourage users to seek professional help for serious concerns
- Keep responses concise (2-3 sentences typically) and conversational
- Use empathetic language and avoid clinical jargon
- Remember that you're a support tool, not a replacement for professional mental health care
- If you detect crisis indicators, be direct about recommending immediate professional help

Your goal is to provide a supportive, safe space for the user to express themselves and receive helpful guidance.`;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  wellness: router({
    chat: publicProcedure
      .input(
        z.object({
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ),
          sessionId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const llmMessages = [
            {
              role: "system" as const,
              content: WELLNESS_SYSTEM_PROMPT,
            },
            ...input.messages.map((msg) => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            })),
          ];

          const lastUserMessage = input.messages
            .reverse()
            .find((msg) => msg.role === "user")?.content || "";

          const hasCrisisIndicators = CRISIS_KEYWORDS.some((keyword) =>
            lastUserMessage.toLowerCase().includes(keyword)
          );

          const response = await invokeLLM({
            messages: llmMessages,
          });

          const aiResponse =
            response.choices[0]?.message?.content || "I'm here to listen and support you.";

          return {
            response: aiResponse,
            hasCrisisIndicators,
            crisisResources: hasCrisisIndicators
              ? {
                  title: "Crisis Support Available",
                  message:
                    "I'm concerned about what you've shared. Please reach out to a crisis professional immediately.",
                  resources: [
                    {
                      name: "National Suicide Prevention Lifeline",
                      phone: "988",
                      url: "https://suicidepreventionlifeline.org",
                    },
                    {
                      name: "Crisis Text Line",
                      text: "Text HOME to 741741",
                      url: "https://www.crisistextline.org",
                    },
                    {
                      name: "International Association for Suicide Prevention",
                      url: "https://www.iasp.info/resources/Crisis_Centres/",
                    },
                  ],
                }
              : null,
          };
        } catch (error) {
          console.error("Error in wellness chat:", error);
          throw new Error("Failed to process wellness chat request");
        }
      }),

    getMoodInsights: publicProcedure
      .input(
        z.object({
          recentMoods: z.array(
            z.object({
              emotion: z.string(),
              intensity: z.number(),
              date: z.string(),
            })
          ),
        })
      )
      .query(async ({ input }) => {
        try {
          if (input.recentMoods.length === 0) {
            return { insights: "Start logging your moods to get personalized insights." };
          }

          const moodSummary = input.recentMoods
            .map(
              (m) =>
                `${new Date(m.date).toLocaleDateString()}: ${m.emotion} (intensity: ${m.intensity}/10)`
            )
            .join("\n");

          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content:
                  "You are a wellness coach analyzing mood patterns. Provide brief, encouraging insights (2-3 sentences) based on the mood data provided.",
              },
              {
                role: "user",
                content: `Here are my recent mood entries:\n${moodSummary}\n\nWhat insights can you share about my emotional patterns?`,
              },
            ],
          });

          return {
            insights:
              response.choices[0]?.message?.content || "Keep tracking your moods for better insights.",
          };
        } catch (error) {
          console.error("Error getting mood insights:", error);
          return { insights: "Unable to generate insights at this time." };
        }
      }),

    getRecommendations: publicProcedure
      .input(
        z.object({
          currentMood: z.string(),
          intensity: z.number(),
          context: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content:
                  "You are a wellness expert. Provide 3-4 specific, actionable wellness recommendations based on the user's current emotional state. Keep each recommendation concise (1-2 sentences).",
              },
              {
                role: "user",
                content: `I'm feeling ${input.currentMood} with an intensity of ${input.intensity}/10.${
                  input.context ? ` Context: ${input.context}` : ""
                } What wellness activities or techniques would help me?`,
              },
            ],
          });

          return {
            recommendations:
              response.choices[0]?.message?.content ||
              "Try taking a few deep breaths and going for a walk.",
          };
        } catch (error) {
          console.error("Error generating recommendations:", error);
          return {
            recommendations: "Consider practicing mindfulness or reaching out to someone you trust.",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
