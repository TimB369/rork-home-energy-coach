import { publicProcedure } from "../../../create-context";

export const historyProcedure = publicProcedure.query(async () => {
  console.log('[tRPC] Work history procedure called');
  
  return [
    {
      id: "1",
      title: "Attic Insulation & Air Sealing",
      date: "2024-03-15",
      description: "Upgraded attic insulation from R-19 to R-60. Sealed air leaks around chimney, wiring penetrations, and top plates.",
      estimatedSavings: 850,
      warranty: {
        length: "Lifetime",
        expirationDate: "2099-12-31",
      },
    },
    {
      id: "2",
      title: "Basement Rim Joist Insulation",
      date: "2023-11-20",
      description: "Spray foam insulation applied to rim joists in basement. Significant reduction in drafts and cold floors.",
      estimatedSavings: 400,
      warranty: {
        length: "10 years",
        expirationDate: "2033-11-20",
      },
    },
    {
      id: "3",
      title: "Energy Audit",
      date: "2023-10-05",
      description: "Comprehensive home energy audit including blower door test and thermal imaging. Identified key areas for improvement.",
      estimatedSavings: 0,
      warranty: null,
    },
  ];
});
