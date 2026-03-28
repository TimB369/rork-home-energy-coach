import { WorkItem, UpgradeRecommendation, HomeProfile, ChecklistItem, Season, Reminder, Document } from '@/constants/types';

export const mockHomeProfile: HomeProfile = {
  customerName: 'Sarah Johnson',
  address: '123 Maple Street, Cambridge, MA 02138',
  yearBuilt: 1985,
  squareFootage: 2400,
  fuelType: 'Natural Gas',
  comfortScore: 8,
  totalAnnualSavings: 1250,
};

export const mockWorkHistory: WorkItem[] = [
  {
    id: '1',
    title: 'Attic Insulation',
    description: 'Upgraded attic insulation to R-49 with blown cellulose',
    date: '2026-01-15',
    category: 'insulation',
    estimatedSavings: 600,
    warranty: {
      length: '10 years',
      expirationDate: '2036-01-15',
    },
  },
  {
    id: '2',
    title: 'Basement Rim Joist Air Sealing',
    description: 'Sealed rim joists with spray foam to reduce drafts',
    date: '2026-01-15',
    category: 'air-sealing',
    estimatedSavings: 350,
    warranty: {
      length: '5 years',
      expirationDate: '2031-01-15',
    },
  },
  {
    id: '3',
    title: 'Air Sealing – Attic Penetrations',
    description: 'Sealed air leaks around chimneys, pipes, and wiring',
    date: '2026-01-15',
    category: 'air-sealing',
    estimatedSavings: 300,
  },
];

export const mockRecommendations: UpgradeRecommendation[] = [
  {
    id: '1',
    phase: 2,
    title: 'Basement Wall Insulation',
    description: 'Insulate basement walls to R-15 to improve comfort and reduce heating costs',
    benefits: ['comfort', 'savings', 'moisture'],
    costRange: '$3,000 - $5,000',
    priority: 'high',
  },
  {
    id: '2',
    phase: 2,
    title: 'Duct Sealing & Insulation',
    description: 'Seal and insulate ductwork to improve heating efficiency',
    benefits: ['comfort', 'savings'],
    costRange: '$1,500 - $2,500',
    priority: 'high',
  },
  {
    id: '3',
    phase: 2,
    title: 'Smart Thermostat Installation',
    description: 'Install programmable smart thermostat for better temperature control',
    benefits: ['comfort', 'savings'],
    costRange: '$200 - $400',
    priority: 'medium',
  },
  {
    id: '4',
    phase: 3,
    title: 'Heat Pump System',
    description: 'Replace existing heating system with efficient heat pump',
    benefits: ['comfort', 'savings', 'health'],
    costRange: '$12,000 - $20,000',
    priority: 'low',
  },
  {
    id: '5',
    phase: 3,
    title: 'Solar Panel Installation',
    description: 'Add solar panels to reduce electricity costs',
    benefits: ['savings'],
    costRange: '$15,000 - $25,000',
    priority: 'low',
  },
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Energy Audit Report',
    type: 'pdf',
    url: 'https://example.com/audit-report.pdf',
    date: '2025-12-10',
  },
  {
    id: '2',
    title: 'Before - Attic',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581858726788-75bc0f1a4eac?w=800',
    date: '2025-12-10',
  },
  {
    id: '3',
    title: 'After - Attic',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1632778149116-f7a8d3c93b3d?w=800',
    date: '2026-01-15',
  },
];

export const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Change HVAC Filter',
    description: 'Time to replace your heating system filter',
    dueDate: '2026-04-01',
    completed: false,
    type: 'filter',
  },
  {
    id: '2',
    title: 'Check for Ice Dams',
    description: 'Inspect roof edges after next heavy snow',
    dueDate: '2026-02-15',
    completed: false,
    type: 'seasonal',
  },
  {
    id: '3',
    title: 'Annual Energy Checkup',
    description: '12 months since your last energy assessment',
    dueDate: '2027-01-15',
    completed: false,
    type: 'checkup',
  },
];

const createSeasonalChecklist = (season: Season): ChecklistItem[] => {
  const checklists: Record<Season, ChecklistItem[]> = {
    winter: [
      { id: 'w1', title: 'Check for drafts around doors and windows', completed: false },
      { id: 'w2', title: 'Look for ice dams or water stains after storms', completed: false },
      { id: 'w3', title: 'Inspect attic insulation for gaps', completed: false },
      { id: 'w4', title: 'Check basement for moisture or condensation', completed: false },
      { id: 'w5', title: 'Test carbon monoxide detectors', completed: false },
      { id: 'w6', title: 'Clean or replace furnace filter', completed: false },
      { id: 'w7', title: 'Check weatherstripping on exterior doors', completed: false },
    ],
    spring: [
      { id: 'sp1', title: 'Inspect roof for winter damage', completed: false },
      { id: 'sp2', title: 'Check gutters and downspouts', completed: false },
      { id: 'sp3', title: 'Test basement sump pump', completed: false },
      { id: 'sp4', title: 'Open windows on mild days to check for drafts', completed: false },
      { id: 'sp5', title: 'Schedule annual AC tune-up', completed: false },
      { id: 'sp6', title: 'Check attic ventilation', completed: false },
    ],
    summer: [
      { id: 'su1', title: 'Check humidity levels in basement', completed: false },
      { id: 'su2', title: 'Clean AC filters or mini-split units', completed: false },
      { id: 'su3', title: 'Inspect crawlspace for moisture', completed: false },
      { id: 'su4', title: 'Check insulation in hot spots (top floor rooms)', completed: false },
      { id: 'su5', title: 'Test attic fan if installed', completed: false },
      { id: 'su6', title: 'Seal any air leaks found during cooling season', completed: false },
    ],
    fall: [
      { id: 'f1', title: 'Schedule furnace tune-up before heating season', completed: false },
      { id: 'f2', title: 'Clean gutters and check drainage', completed: false },
      { id: 'f3', title: 'Inspect weatherstripping and caulking', completed: false },
      { id: 'f4', title: 'Check basement for air leaks', completed: false },
      { id: 'f5', title: 'Test all smoke and CO detectors', completed: false },
      { id: 'f6', title: 'Stock up on furnace filters', completed: false },
      { id: 'f7', title: 'Review winter energy savings tips', completed: false },
    ],
  };
  
  return checklists[season];
};

export const getSeasonalChecklist = (season: Season): ChecklistItem[] => {
  return createSeasonalChecklist(season);
};
