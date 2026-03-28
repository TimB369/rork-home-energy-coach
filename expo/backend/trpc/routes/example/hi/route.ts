import { publicProcedure } from "../../../create-context";

export const hiProcedure = publicProcedure.query(async () => {
  console.log('[tRPC] Hi procedure called');
  return {
    message: "Hello from the backend!",
    timestamp: new Date(),
  };
});
