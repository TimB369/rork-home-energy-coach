import { publicProcedure } from "../../../create-context";

export const profileProcedure = publicProcedure.query(async () => {
  console.log('[tRPC] Profile procedure called');
  
  return {
    customerName: "Mr. & Mrs. Johnson",
    address: "123 Maple Street, Manchester, NH 03101",
    yearBuilt: 1985,
    squareFootage: 2400,
    fuelType: "Natural Gas",
    totalAnnualSavings: 1850,
    comfortScore: 8.5,
  };
});
