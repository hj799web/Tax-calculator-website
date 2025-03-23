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
  { label: 'Debt Servicing & Public Debt Charges', value: 'Debt Servicing & Public Debt Charges' },
  { label: 'Other Government Operations', value: 'Other Government Operations' },
  { label: 'International Financial Commitments', value: 'International Financial Commitments' },
  { label: 'Loans, Investments, and Advances', value: 'Loans, Investments, and Advances' },
]

export const federalTaxBrackets2022 = [
  { rate: 0.15, upTo: 50197 },
  { rate: 0.205, upTo: 100392 },
  { rate: 0.26, upTo: 155625 },
  { rate: 0.29, upTo: 221708 },
  { rate: 0.33, upTo: Infinity },
]

export const federalTaxBrackets2023 = [
  { rate: 0.15, upTo: 53359 },
  { rate: 0.205, upTo: 106717 },
  { rate: 0.26, upTo: 165430 },
  { rate: 0.29, upTo: 235675 },
  { rate: 0.33, upTo: Infinity },
]

export const federalTaxBrackets2024 = [
  { rate: 0.15, upTo: 53359 },
  { rate: 0.205, upTo: 106717 },
  { rate: 0.26, upTo: 165430 },
  { rate: 0.29, upTo: 235675 },
  { rate: 0.33, upTo: Infinity },
]

// For backward compatibility, keep the original variable
export const federalTaxBrackets = federalTaxBrackets2023;

// Provincial tax brackets for 2022
export const provincialTaxBrackets2022 = {
  Alberta: [
    { rate: 0.1, upTo: 131220 },
    { rate: 0.12, upTo: 157464 },
    { rate: 0.13, upTo: 209952 },
    { rate: 0.14, upTo: 314928 },
    { rate: 0.15, upTo: Infinity },
  ],
  'British Columbia': [
    { rate: 0.0506, upTo: 42184 },
    { rate: 0.077, upTo: 84369 },
    { rate: 0.105, upTo: 96866 },
    { rate: 0.1229, upTo: 117623 },
    { rate: 0.147, upTo: 159483 },
    { rate: 0.168, upTo: 222420 },
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
    { rate: 0.087, upTo: 38081 },
    { rate: 0.145, upTo: 76161 },
    { rate: 0.158, upTo: 135973 },
    { rate: 0.173, upTo: 190363 },
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
    { rate: 0.0505, upTo: 45142 },
    { rate: 0.0915, upTo: 90287 },
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
    { rate: 0.15, upTo: 45105 },
    { rate: 0.20, upTo: 90200 },
    { rate: 0.24, upTo: 109755 },
    { rate: 0.2575, upTo: Infinity },
  ],
  Saskatchewan: [
    { rate: 0.105, upTo: 45677 },
    { rate: 0.125, upTo: 130385 },
    { rate: 0.145, upTo: Infinity },
  ],
  'Northwest Territories': [
    { rate: 0.059, upTo: 44396 },
    { rate: 0.086, upTo: 88796 },
    { rate: 0.122, upTo: 144362 },
    { rate: 0.1405, upTo: Infinity },
  ],
  Nunavut: [
    { rate: 0.04, upTo: 44437 },
    { rate: 0.07, upTo: 88874 },
    { rate: 0.09, upTo: 144362 },
    { rate: 0.115, upTo: Infinity },
  ],
  Yukon: [
    { rate: 0.064, upTo: 49020 },
    { rate: 0.09, upTo: 98040 },
    { rate: 0.109, upTo: 151978 },
    { rate: 0.128, upTo: 500000 },
    { rate: 0.15, upTo: Infinity },
  ],
};

// Provincial tax brackets for 2023
export const provincialTaxBrackets2023 = {
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

// Provincial tax brackets for 2024
export const provincialTaxBrackets2024 = {
  Alberta: [
    { rate: 0.1, upTo: 148269 },
    { rate: 0.12, upTo: 177922 },
    { rate: 0.13, upTo: 237216 },
    { rate: 0.14, upTo: 355824 },
    { rate: 0.15, upTo: Infinity },
  ],
  'British Columbia': [
    { rate: 0.0506, upTo: 45654 },
    { rate: 0.077, upTo: 91310 },
    { rate: 0.105, upTo: 104835 },
    { rate: 0.1229, upTo: 127299 },
    { rate: 0.147, upTo: 172602 },
    { rate: 0.168, upTo: 240716 },
    { rate: 0.205, upTo: Infinity },
  ],
  Manitoba: [
    { rate: 0.108, upTo: 35431 },
    { rate: 0.1275, upTo: 76416 },
    { rate: 0.174, upTo: Infinity },
  ],
  'New Brunswick': [
    { rate: 0.0968, upTo: 46295 },
    { rate: 0.1482, upTo: 92593 },
    { rate: 0.1652, upTo: 150473 },
    { rate: 0.1784, upTo: 171415 },
    { rate: 0.203, upTo: Infinity },
  ],
  'Newfoundland and Labrador': [
    { rate: 0.087, upTo: 41457 },
    { rate: 0.145, upTo: 82913 },
    { rate: 0.158, upTo: 148027 },
    { rate: 0.173, upTo: 207239 },
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
    { rate: 0.0505, upTo: 49231 },
    { rate: 0.0915, upTo: 98463 },
    { rate: 0.1116, upTo: 150000 },
    { rate: 0.1216, upTo: 220000 },
    { rate: 0.1316, upTo: Infinity },
  ],
  'Prince Edward Island': [
    { rate: 0.0985, upTo: 32656 },
    { rate: 0.138, upTo: 65312 },
    { rate: 0.167, upTo: Infinity },
  ],
  Quebec: [
    { rate: 0.15, upTo: 49275 },
    { rate: 0.20, upTo: 98540 },
    { rate: 0.24, upTo: 119910 },
    { rate: 0.2575, upTo: Infinity },
  ],
  Saskatchewan: [
    { rate: 0.105, upTo: 49720 },
    { rate: 0.125, upTo: 142058 },
    { rate: 0.145, upTo: Infinity },
  ],
  'Northwest Territories': [
    { rate: 0.059, upTo: 47862 },
    { rate: 0.086, upTo: 95726 },
    { rate: 0.122, upTo: 155625 },
    { rate: 0.1405, upTo: Infinity },
  ],
  Nunavut: [
    { rate: 0.04, upTo: 47862 },
    { rate: 0.07, upTo: 95726 },
    { rate: 0.09, upTo: 155625 },
    { rate: 0.115, upTo: Infinity },
  ],
  Yukon: [
    { rate: 0.064, upTo: 53359 },
    { rate: 0.09, upTo: 106717 },
    { rate: 0.109, upTo: 165430 },
    { rate: 0.128, upTo: 500000 },
    { rate: 0.15, upTo: Infinity },
  ],
};

// For backward compatibility, keep the original variable
export const provincialTaxBrackets = provincialTaxBrackets2023;

export const federalBasicPersonalAmount2022 = 14398;
export const federalBasicPersonalAmount2023 = 15000;
export const federalBasicPersonalAmount2024 = 15705;

// For backward compatibility, keep the original variable
export const federalBasicPersonalAmount = federalBasicPersonalAmount2023;

// Provincial basic personal amounts for 2022
export const provincialBasicPersonalAmounts2022 = {
  Alberta: 19369,
  'British Columbia': 11302,
  Manitoba: 9626,
  'New Brunswick': 10817,
  'Newfoundland and Labrador': 9803,
  'Northwest Territories': 15609,
  'Nova Scotia': 8481,
  Nunavut: 16862,
  Ontario: 10880,
  'Prince Edward Island': 11250,
  Quebec: 16143,
  Saskatchewan: 16615,
  Yukon: 14398,
};

// Provincial basic personal amounts for 2023
export const provincialBasicPersonalAmounts2023 = {
  Alberta: 21003,
  'British Columbia': 11981,
  Manitoba: 10855,
  'New Brunswick': 12458,
  'Newfoundland and Labrador': 10382,
  'Northwest Territories': 16593,
  'Nova Scotia': 8481,
  Nunavut: 17925,
  Ontario: 11865,
  'Prince Edward Island': 12000,
  Quebec: 17183,
  Saskatchewan: 17661,
  Yukon: 15000,
};

// Provincial basic personal amounts for 2024
export const provincialBasicPersonalAmounts2024 = {
  Alberta: 21885,
  'British Columbia': 12580,
  Manitoba: 11055,
  'New Brunswick': 12458,
  'Newfoundland and Labrador': 10382,
  'Northwest Territories': 16593,
  'Nova Scotia': 8481,
  Nunavut: 17925,
  Ontario: 12399,
  'Prince Edward Island': 12750,
  Quebec: 18056,
  Saskatchewan: 18491,
  Yukon: 15705,
};

// For backward compatibility, keep the original variable
export const provincialBasicPersonalAmounts = provincialBasicPersonalAmounts2023;

// Budget categories for 2022-2023
export const budgetCategories2022 = [
  {
    id: 1,
    name: 'Healthcare (Canada Health Transfer)',
    amount: 58200000000, // $58.2 billion
    description: 'Funding for healthcare systems across Canada, including medical and technical aid, healthcare professionals training, and public health initiatives.'
  },
  {
    id: 2,
    name: 'Children and Families',
    amount: 26900000000, // $26.9 billion
    description: 'Support for families with children, including the Canada Child Benefit (CCB), childcare initiatives, and family support programs.'
  },
  {
    id: 3,
    name: 'Indigenous Services',
    amount: 39800000000, // $39.8 billion
    description: 'Funding for Indigenous communities, including healthcare, education, infrastructure, and community development.'
  },
  {
    id: 4,
    name: 'Employment Insurance and Benefits',
    amount: 35600000000, // $35.6 billion
    description: 'Employment insurance benefits and related employment programs.'
  },
  {
    id: 5,
    name: 'Support for Seniors',
    amount: 69100000000, // $69.1 billion
    description: 'Old Age Security, Guaranteed Income Supplement, and other senior support programs.'
  },
  {
    id: 6,
    name: 'Defense',
    amount: 36400000000, // $36.4 billion
    description: 'National defense spending, including military procurement, operations, and personnel costs.'
  },
  {
    id: 7,
    name: 'Public Safety and Emergency Preparedness',
    amount: 11600000000, // $11.6 billion
    description: 'Funding for police, border security, corrections, and emergency management.'
  },
  {
    id: 8,
    name: 'International Affairs and Development',
    amount: 9800000000, // $9.8 billion
    description: 'International aid, diplomacy, and global development initiatives.'
  },
  {
    id: 9,
    name: 'Public Debt Charges',
    amount: 42700000000, // $42.7 billion
    description: 'Interest payments on the federal debt.'
  },
  {
    id: 10,
    name: 'Loans, Investments, and Advances',
    amount: 10000000000, // $10 billion
    description: 'Government loans, investments, and financial advances.'
  },
  {
    id: 11,
    name: 'Other Government Operations',
    amount: 242000000000, // $242 billion
    description: 'Various government operations including General Public Services ($40B), Social Protection Programs ($30B), Economic Affairs ($12B), and other departments and agencies.'
  }
]

// For backward compatibility, keep the original variable
export const budgetCategories = budgetCategories2022;

// Budget categories for 2024
export const budgetCategories2024 = [
  {
    id: 1,
    name: 'Healthcare (Canada Health Transfer)',
    amount: 50400000000, // $50.4 billion
    description: 'The federal government supports provincial and territorial healthcare systems through the Canada Health Transfer (CHT). This funding assists in delivering universal healthcare, including hospitals, healthcare professionals, and public health initiatives. Healthcare expenditures represent approximately 10% of total federal spending.'
  },
  {
    id: 2,
    name: 'Support for Seniors',
    amount: 76000000000, // $76.0 billion
    description: 'This allocation funds programs like Old Age Security (OAS) and the Guaranteed Income Supplement (GIS), providing basic income support to seniors. Driven by Canada\'s aging population, these programs account for around 14% of total federal spending.'
  },
  {
    id: 3,
    name: 'Children and Families',
    amount: 26300000000, // $26.3 billion
    description: 'The Canada Child Benefit (CCB) offers income support to low- and middle-income families to assist with child-rearing costs. This initiative plays a crucial role in reducing child poverty and constitutes about 6% of federal spending.'
  },
  {
    id: 4,
    name: 'Indigenous Services and Reconciliation',
    amount: 35500000000, // $35.5 billion
    description: 'This funding supports Indigenous communities through initiatives in healthcare, education, infrastructure, and reconciliation efforts, including land claim settlements. Indigenous services represent around 7% of the total federal budget.'
  },
  {
    id: 5,
    name: 'Employment Insurance and Other Benefits',
    amount: 23100000000, // $23.1 billion
    description: 'Funding for Employment Insurance (EI) provides income support to temporarily unemployed workers, new parents, and seasonal employees. This category also includes retraining and skill development programs, making up around 5% of federal spending.'
  },
  {
    id: 6,
    name: 'Defense and Public Safety',
    amount: 32600000000, // $32.6 billion
    description: 'Expenditures cover the Canadian Armed Forces, military procurement (e.g., ships, aircraft), and public safety programs like border security and cybersecurity. This reflects Canada\'s defense commitments and represents about 6% of the total budget.'
  },
  {
    id: 7,
    name: 'Debt Servicing (Public Debt Charges)',
    amount: 47300000000, // $47.3 billion
    description: 'Payments for interest on Canada\'s national debt, which totaled $1.173 trillion by the end of the fiscal year. Rising interest rates have increased debt servicing costs, accounting for around 9% of total spending.'
  },
  {
    id: 8,
    name: 'Loans, Investments, and Advances',
    amount: 10000000000, // $10 billion
    description: 'This category encompasses various financial assistance programs including Student Loans ($24B total portfolio), Agriculture Loans ($162M), International Development and Loans ($53B total), Business and Innovation Loans ($600M), Defense Sector Loans ($1.45B), and Economic Development Loans.'
  },
  {
    id: 9,
    name: 'Other Government Operations',
    amount: 140000000000, // $140 billion
    description: 'This category includes Transportation Infrastructure ($15B), Environmental Programs ($8B), Public Safety ($9B), Government Buildings ($7B), Research and Innovation ($10B), Digital Government ($5B), Federal Employee Salaries ($35B), Legal and Justice System ($5B), Indigenous Services Operations ($4B), Cultural Programs ($2B), Scientific R&D ($5B), and Diplomatic Representation ($5B).'
  }
]

export const baseBudget2024Data = [
  { category: 'Healthcare (Canada Health Transfer)', amount: 50.4 },
  { category: 'Support for Seniors', amount: 76.0 },
  { category: 'Children and Families', amount: 26.3 },
  { category: 'Indigenous Services and Reconciliation', amount: 35.5 },
  { category: 'Employment Insurance and Other Benefits', amount: 23.1 },
  { category: 'Defense and Public Safety', amount: 32.6 },
  { category: 'Debt Servicing (Public Debt Charges)', amount: 47.3 },
  { category: 'Loans, Investments, and Advances', amount: 10.0 },
  { category: 'Other Government Operations', amount: 140.0 },
]

export const federalBudget2024Data = [
  { category: 'Economic Growth and Tax Policies', amount: 412.4 },
  { category: 'Housing and Affordability', amount: 121.418 },
  { category: 'Green Energy and Sustainability', amount: 8.407 },
  { category: 'Social Programs and Indigenous Communities', amount: 1.236 },
  { category: 'Defence and Public Safety', amount: 43.143 },
  { category: 'Public Debt and Fiscal Stability', amount: 58.3 },
  { category: 'Strategic Investments in Innovation', amount: 0.138 }
]