import { createTRPCRouter } from "./create-context";
import { hiProcedure } from "./routes/example/hi/route";
import { profileProcedure } from "./routes/home/profile/route";
import { historyProcedure } from "./routes/work/history/route";
import { submitServiceProcedure } from "./routes/services/submit/route";
import { submitReviewProcedure } from "./routes/services/review/route";

console.log('[tRPC Router] Building app router...');

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiProcedure,
  }),
  home: createTRPCRouter({
    profile: profileProcedure,
  }),
  work: createTRPCRouter({
    history: historyProcedure,
  }),
  services: createTRPCRouter({
    submit: submitServiceProcedure,
    review: submitReviewProcedure,
  }),
});

export type AppRouter = typeof appRouter;
