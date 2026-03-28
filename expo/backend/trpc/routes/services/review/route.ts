import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const submitReviewProcedure = publicProcedure
  .input(
    z.object({
      rating: z.number().min(1).max(5),
      feedback: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[tRPC] Review submitted:', input);
    
    return {
      success: true,
      message: 'Thank you for your feedback!',
      shouldRedirectToGoogle: input.rating >= 4,
    };
  });
