export type WorkItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'insulation' | 'air-sealing' | 'hvac' | 'other';
  estimatedSavings: number;
  warranty?: {
    length: string;
    expirationDate: string;
  };
};

export type UpgradeRecommendation = {
  id: string;
  phase: 1 | 2 | 3;
  title: string;
  description: string;
  benefits: ('comfort' | 'savings' | 'health' | 'moisture' | 'ice-dams')[];
  costRange: string;
  priority: 'high' | 'medium' | 'low';
};

export type HomeProfile = {
  customerName: string;
  address: string;
  yearBuilt: number;
  squareFootage: number;
  fuelType: string;
  comfortScore: number;
  totalAnnualSavings: number;
};

export type ChecklistItem = {
  id: string;
  title: string;
  completed: boolean;
};

export type Season = 'winter' | 'spring' | 'summer' | 'fall';

export type Reminder = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  type: 'filter' | 'checkup' | 'seasonal' | 'other';
};

export type Document = {
  id: string;
  title: string;
  type: 'pdf' | 'image';
  url: string;
  date: string;
};
