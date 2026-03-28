import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const submitServiceProcedure = publicProcedure
  .input(
    z.object({
      serviceType: z.enum(['audit', 'insulation', 'issue']),
      name: z.string(),
      phone: z.string(),
      email: z.string().email(),
      notes: z.string().optional(),
      photoCount: z.number().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[tRPC] Service request submitted:', input);
    
    return {
      success: true,
      message: 'Service request received! We will contact you within 24 hours.',
      requestId: `REQ-${Date.now()}`,
    };
  });
