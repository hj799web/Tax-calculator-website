export const salaryOptions = [
  { label: 'Annual', value: 'Annual', periodMultiplier: 1 },
  { label: 'Monthly', value: 'Monthly', periodMultiplier: 12 },
  { label: 'Bi-weekly', value: 'Bi-weekly', periodMultiplier: 26 },
  { label: 'Weekly', value: 'Weekly', periodMultiplier: 52 },
  { label: 'Daily', value: 'Daily', periodMultiplier: 260 },
  { label: 'Hourly', value: 'Hourly', periodMultiplier: 2080 },
]

export const regions = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Nova Scotia',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Northwest Territories',
    'Nunavut',
    'Yukon',
]

export const allocationCategories = [
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Support for Seniors', value: 'Support for Seniors' },
  { label: 'Children and Families', value: 'Children and Families' },
  {
    label: 'Indigenous Services and Reconciliation',
    value: 'Indigenous Services and Reconciliation',
  },
  {
    label: 'Employment Insurance and Other Benefits',
    value: 'Employment Insurance and Other Benefits',
  },
  { label: 'Defense and Public Safety', value: 'Defense and Public Safety' },
  { label: 'Debt Servicing', value: 'Debt Servicing' },
  { label: 'Public Debt Charges', value: 'Public Debt Charges' },
  { label: 'Loans, Investments, and Advances', value: 'Loans, Investments, and Advances' },
  { label: 'Government Operations', value: 'Government Operations' },
]

export const federalTaxBrackets = [
  { rate: 0.15, upTo: 53359 },
  { rate: 0.205, upTo: 106717 },
  { rate: 0.26, upTo: 165430 },
  { rate: 0.29, upTo: 235675 },
  { rate: 0.33, upTo: Infinity },
]

export const provincialTaxBrackets = {
  Alberta: [
    { rate: 0.1, upTo: 142292 },
    { rate: 0.12, upTo: 170751 },
    { rate: 0.13, upTo: 227668 },
    { rate: 0.14, upTo: 341502 },
    { rate: 0.15, upTo: Infinity },
  ],
  'British Columbia': [
    { rate: 0.0506, upTo: 43070 },
    { rate: 0.077, upTo: 86141 },
    { rate: 0.105, upTo: 98901 },
    { rate: 0.1229, upTo: 120094 },
    { rate: 0.147, upTo: 162832 },
    { rate: 0.168, upTo: 227091 },
    { rate: 0.205, upTo: Infinity },
  ],
  Manitoba: [
    { rate: 0.108, upTo: 33723 },
    { rate: 0.1275, upTo: 72885 },
    { rate: 0.174, upTo: Infinity },
  ],
  'New Brunswick': [
    { rate: 0.0968, upTo: 43835 },
    { rate: 0.1482, upTo: 87671 },
    { rate: 0.1652, upTo: 142534 },
    { rate: 0.1784, upTo: 162383 },
    { rate: 0.203, upTo: Infinity },
  ],
  'Newfoundland and Labrador': [
    { rate: 0.087, upTo: 39157 },
    { rate: 0.145, upTo: 78315 },
    { rate: 0.158, upTo: 139780 },
    { rate: 0.173, upTo: 195693 },
    { rate: 0.183, upTo: Infinity },
  ],
  'Nova Scotia': [
    { rate: 0.0879, upTo: 29590 },
    { rate: 0.1495, upTo: 59180 },
    { rate: 0.1667, upTo: 93000 },
    { rate: 0.175, upTo: 150000 },
    { rate: 0.21, upTo: Infinity },
  ],
  Ontario: [
    { rate: 0.0505, upTo: 46226 },
    { rate: 0.0915, upTo: 92454 },
    { rate: 0.1116, upTo: 150000 },
    { rate: 0.1216, upTo: 220000 },
    { rate: 0.1316, upTo: Infinity },
  ],
  'Prince Edward Island': [
    { rate: 0.0985, upTo: 31984 },
    { rate: 0.138, upTo: 63969 },
    { rate: 0.167, upTo: Infinity },
  ],
  Quebec: [
    { rate: 0.15, upTo: 45545 },
    { rate: 0.20, upTo: 91105 },
    { rate: 0.24, upTo: 112655 },
    { rate: 0.2575, upTo: Infinity },
  ],
  Saskatchewan: [
    { rate: 0.105, upTo: 47677 },
    { rate: 0.125, upTo: 136385 },
    { rate: 0.145, upTo: Infinity },
  ],
  'Northwest Territories': [
    { rate: 0.059, upTo: 44437 },
    { rate: 0.086, upTo: 88874 },
    { rate: 0.122, upTo: 144362 },
    { rate: 0.1405, upTo: Infinity },
  ],
  Nunavut: [
    { rate: 0.04, upTo: 45462 },
    { rate: 0.07, upTo: 90925 },
    { rate: 0.09, upTo: 147692 },
    { rate: 0.115, upTo: Infinity },
  ],
  Yukon: [
    { rate: 0.064, upTo: 50197 },
    { rate: 0.09, upTo: 100392 },
    { rate: 0.109, upTo: 155625 },
    { rate: 0.128, upTo: 500000 },
    { rate: 0.15, upTo: Infinity },
  ],
};

export const federalBasicPersonalAmount = 15000;
    
export const provincialBasicPersonalAmounts = {
  Alberta: 21003,
  'British Columbia': 11881,
  Manitoba: 10386,
  'New Brunswick': 12081,
  'Newfoundland and Labrador': 10150,
  'Northwest Territories': 16593,
  'Nova Scotia': 8481,
  Nunavut: 16962,
  Ontario: 11281,
  'Prince Edward Island': 11250,
  Quebec: 17283,
  Saskatchewan: 17225,
  Yukon: 15000,
};

export const budgetCategories = [
  {
    id: 1,
    name: 'Healthcare',
    amount: 50000000000,
    description: 'Funds the Canada Health Transfer, etc.'
  },
  {
    id: 2,
    name: 'Support for Seniors',
    amount: 63000000000,
    description: 'Old Age Security, GIS, etc.'
  },
  {
    id: 3,
    name: 'Children and Families',
    amount: 28000000000,
    description: 'Canada Child Benefit, child/family programs.'
  },
  {
    id: 4,
    name: 'Indigenous Services and Reconciliation',
    amount: 26000000000,
    description: 'Services, reconciliation efforts, etc.'
  },
  {
    id: 5,
    name: 'Employment Insurance and Other Benefits',
    amount: 30000000000,
    description: 'EI, job retraining, etc.'
  },
  {
    id: 6,
    name: 'Defense and Public Safety',
    amount: 35000000000,
    description: 'Canadian Armed Forces, border security.'
  },
  {
    id: 7,
    name: 'Debt Servicing',
    amount: 44000000000,
    description: 'Interest on Canada’s national debt.'
  },
  {
    id: 8,
    name: 'Public Debt Charges',
    amount: 34900000000,
    description: 'Additional public debt interest.'
  },
  {
    id: 9,
    name: 'Loans, Investments, and Advances',
    amount: 100000000000,
    description: 'Student loans, global loans, etc.',
    subsections: [
      {
        id: '9.1',
        name: 'Student Loans',
        amount: 24000000000,
        description:
          'Financial assistance for post-secondary students.',
      },
      {
        id: '9.2',
        name: 'International Development Loans',
        amount: 53000000000,
        description: 'World Bank, AIIB, IDA commitments.',
      },
    ],
  },
  {
    id: 10,
    name: 'Government Operations',
    amount: 100000000000,
    description:
      'Day-to-day operations, salaries, infrastructure, etc.',
    subsections: [
      {
        id: '10.1',
        name: 'Transportation Infrastructure',
        amount: 15000000000,
        description: 'Roads, bridges, ports, etc.',
      },
      {
        id: '10.2',
        name: 'Environmental Programs',
        amount: 8000000000,
        description: 'Clean energy, climate initiatives, etc.',
      },
    ],
  },
]

export const baseBudget2024Data = [
  { category: 'Economic Growth and Tax Policies', amount: 233.06 },
  { category: 'Housing and Affordability', amount: 18.9 },
  { category: 'Green Energy and Sustainability', amount: 4.6079 },
  { category: 'Social Programs and Indigenous Communities', amount: 0.5061 },
  { category: 'Defence and Public Safety', amount: 2.2687 },
  { category: 'Public Debt and Fiscal Stability', amount: 55.15 },
]