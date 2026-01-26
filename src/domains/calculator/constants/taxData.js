// Salary options for different payment periods
export const salaryOptions = [
  { label: 'Annual', value: 'Annual', periodMultiplier: 1 },
  { label: 'Monthly', value: 'Monthly', periodMultiplier: 12 },
  { label: 'Bi-weekly', value: 'Bi-weekly', periodMultiplier: 26 },
  { label: 'Weekly', value: 'Weekly', periodMultiplier: 52 },
  { label: 'Daily', value: 'Daily', periodMultiplier: 260 },
  { label: 'Hourly', value: 'Hourly', periodMultiplier: 2080 },
]

// 2023 Tax Credits (used fields only)
export const taxCredits2023 = {
  employmentAmount: 1368,
  medicalExpensesThreshold: 2635,
};

// 2024 Tax Credits and Deductions
export const taxCredits2024 = {
  basicPersonalAmount: 15705,
  spouseAmount: 15705,
  ageAmount: 8790,
  disabilityAmount: 9872,
  caregiverAmount: 7999,
  pensionIncomeAmount: 2000,
  employmentAmount: 1433,
  homeBuyersAmount: 10000,
  digitalNewsSubscriptionMax: 500,
  volunteerFirefightersAmount: 6000,
  adoptionExpensesMax: 17131,
  medicalExpensesThreshold: 2759,
  charitableDonationsThreshold: 200,
  charitableDonationsHighIncomeThreshold: 253214
};

// 2025 Tax Credits and Deductions
export const taxCredits2025 = {
  basicPersonalAmount: 16129,
  spouseAmount: 16129,
  ageAmount: 9027,
  disabilityAmount: 10139,
  caregiverAmount: 7999,
  pensionIncomeAmount: 2000,
  employmentAmount: 1433,
  homeBuyersAmount: 10000,
  digitalNewsSubscriptionMax: 0,
  volunteerFirefightersAmount: 6000,
  adoptionExpensesMax: 17131,
  medicalExpensesThreshold: 2834,
  charitableDonationsThreshold: 200,
  charitableDonationsHighIncomeThreshold: 253214
};

export const taxDeductions2025 = {
  rrspMaxContribution: 32490,
  fhsaAnnualLimit: 8000,
  fhsaLifetimeLimit: 40000,
  movingExpensesMinDistance: 40, // kilometers
  unionDues: true,
  disabilitySupports: true,
  northernResidents: true,
  pensionIncomeSplitting: true,
  carryingCharges: true,
  clergyResidence: true
};

// Region options
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

// Allocation categories for budget visualization
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

// Federal Basic Personal Amounts
export const federalBasicPersonalAmount2022 = 14398;
export const federalBasicPersonalAmount2023 = 15000;
export const federalBasicPersonalAmount2024 = 15705;
export const federalBasicPersonalAmount2025 = 16129;

// For backward compatibility
 

// Provincial Basic Personal Amounts
export const provincialBasicPersonalAmounts2022 = {
  'AB': 19369,
  'BC': 11302,
  'MB': 10145,
  'NB': 10917,
  'NL': 9802,
  'NS': 8481,
  'NT': 15609,
  'NU': 16593,
  'ON': 11041,
  'PE': 11050,
  'QC': 16143,
  'SK': 16415,
  'YT': 14398
};

export const provincialBasicPersonalAmounts2023 = {
  'AB': 21103,
  'BC': 11581,
  'MB': 10355,
  'NB': 11220,
  'NL': 10082,
  'NS': 8481,
  'NT': 15936,
  'NU': 16967,
  'ON': 11141,
  'PE': 11350,
  'QC': 16593,
  'SK': 16861,
  'YT': 15000
};

export const provincialBasicPersonalAmounts2024 = {
  'AB': 21503,
  'BC': 11809,
  'MB': 10582,
  'NB': 11458,
  'NL': 10293,
  'NS': 8659,
  'NT': 16267,
  'NU': 17321,
  'ON': 11365,
  'PE': 11581,
  'QC': 18056,
  'SK': 17206,
  'YT': 15705
};

export const provincialBasicPersonalAmounts2025 = {
  'AB': 22323,
  'BC': 12932,
  'MB': 15780,
  'NB': 13396,
  'NL': 11067,
  'NS': 11744,
  'NT': 17842,
  'NU': 19274,
  'ON': 12747,
  'PE': 14650,
  'QC': 18571,
  'SK': 19491,
  'YT': 16129
};

// For backward compatibility
 

// Quebec-specific contribution rates and limits (2024)
export const quebecContributionRates2024 = {
  qpp: {
    rate: 0.064, // 6.4%
    maxPensionableEarnings: 68500,
    basicExemption: 3500,
    maxContribution: 4160 // (68500 - 3500) * 0.064
  },
  qpp2: {
    rate: 0.04, // 4%
    maxPensionableEarnings: 73200,
    minPensionableEarnings: 68500,
    maxContribution: 188 // (73200 - 68500) * 0.04
  },
  ei: {
    rate: 0.0132, // 1.32% (Quebec rate, lower than federal)
    maxInsurableEarnings: 63200,
    maxContribution: 834.24 // 63200 * 0.0132
  },
  qpip: {
    rate: 0.00494, // 0.494%
    maxInsurableEarnings: 94000,
    maxContribution: 464.36 // 94000 * 0.00494
  }
};

// Quebec-specific contribution rates and limits (2025)
export const quebecContributionRates2025 = {
  qpp: {
    rate: 0.064, // 6.4%
    maxPensionableEarnings: 71300,
    basicExemption: 3500,
    maxContribution: 4339.20 // (71300 - 3500) * 0.064
  },
  qpp2: {
    rate: 0.04, // 4%
    maxPensionableEarnings: 81200,
    minPensionableEarnings: 71300,
    maxContribution: 396 // (81200 - 71300) * 0.04
  },
  ei: {
    rate: 0.0131, // 1.31% (Quebec rate, lower than federal)
    maxInsurableEarnings: 65700,
    maxContribution: 860.67 // 65700 * 0.0131
  },
  qpip: {
    rate: 0.00494, // 0.494%
    maxInsurableEarnings: 98000,
    maxContribution: 484.12 // 98000 * 0.00494
  }
};

// Quebec abatement rate (reduces federal tax)
export const quebecAbatementRate = 0.165; // 16.5%

// Federal contribution rates and limits (2024)
export const federalContributionRates2024 = {
  cpp: {
    rate: 0.0595, // 5.95%
    maxPensionableEarnings: 68500,
    basicExemption: 3500,
    maxContribution: 3867.50 // (68500 - 3500) * 0.0595
  },
  cpp2: {
    rate: 0.04, // 4%
    maxPensionableEarnings: 73200,
    minPensionableEarnings: 68500,
    maxContribution: 188 // (73200 - 68500) * 0.04
  },
  ei: {
    rate: 0.0166, // 1.66%
    maxInsurableEarnings: 63200,
    maxContribution: 1049.12 // 63200 * 0.0166
  }
};

// Federal contribution rates and limits (2025)
export const federalContributionRates2025 = {
  cpp: {
    rate: 0.0595, // 5.95%
    maxPensionableEarnings: 71300,
    basicExemption: 3500,
    maxContribution: 4034.10 // (71300 - 3500) * 0.0595
  },
  cpp2: {
    rate: 0.04, // 4%
    maxPensionableEarnings: 81200,
    minPensionableEarnings: 71300,
    maxContribution: 396 // (81200 - 71300) * 0.04
  },
  ei: {
    rate: 0.0164, // 1.64%
    maxInsurableEarnings: 65700,
    maxContribution: 1077.48 // 65700 * 0.0164
  }
};

// Federal Tax Brackets
export const federalTaxBrackets2022 = [
  { rate: 0.15, upTo: 50197 },
  { rate: 0.205, upTo: 100392 },
  { rate: 0.26, upTo: 155625 },
  { rate: 0.29, upTo: 221708 },
  { rate: 0.33, upTo: Infinity },
];

export const federalTaxBrackets2023 = [
  { rate: 0.15, upTo: 53359 },
  { rate: 0.205, upTo: 106717 },
  { rate: 0.26, upTo: 165430 },
  { rate: 0.29, upTo: 235675 },
  { rate: 0.33, upTo: Infinity },
];

export const federalTaxBrackets2024 = [
  { rate: 0.15, upTo: 55867 },
  { rate: 0.205, upTo: 111733 },
  { rate: 0.26, upTo: 173205 },
  { rate: 0.29, upTo: 246752 },
  { rate: 0.33, upTo: Infinity },
];

export const federalTaxBrackets2025 = [
  { rate: 0.145, upTo: 57375 },
  { rate: 0.205, upTo: 114750 },
  { rate: 0.26, upTo: 177882 },
  { rate: 0.29, upTo: 253414 },
  { rate: 0.33, upTo: Infinity },
];

// For backward compatibility
 

// Provincial Tax Brackets
export const provincialTaxBrackets2022 = {
  'AB': [
    { rate: 0.10, upTo: 131220 },
    { rate: 0.12, upTo: 157464 },
    { rate: 0.13, upTo: 209952 },
    { rate: 0.14, upTo: 314928 },
    { rate: 0.15, upTo: Infinity },
  ],
  'BC': [
    { rate: 0.0506, upTo: 45654 },
    { rate: 0.077, upTo: 91310 },
    { rate: 0.105, upTo: 104835 },
    { rate: 0.1229, upTo: 127299 },
    { rate: 0.147, upTo: 172602 },
    { rate: 0.168, upTo: 240716 },
    { rate: 0.205, upTo: Infinity },
  ],
  'MB': [
    { rate: 0.108, upTo: 34431 },
    { rate: 0.1275, upTo: 74416 },
    { rate: 0.174, upTo: Infinity },
  ],
  'NB': [
    { rate: 0.094, upTo: 47715 },
    { rate: 0.14, upTo: 95431 },
    { rate: 0.16, upTo: 176756 },
    { rate: 0.195, upTo: Infinity },
  ],
  'NL': [
    { rate: 0.087, upTo: 39147 },
    { rate: 0.145, upTo: 78294 },
    { rate: 0.158, upTo: 139780 },
    { rate: 0.173, upTo: 195693 },
    { rate: 0.183, upTo: 250000 },
    { rate: 0.208, upTo: 500000 },
    { rate: 0.213, upTo: 1000000 },
    { rate: 0.218, upTo: Infinity },
  ],
  'NS': [
    { rate: 0.0879, upTo: 29590 },
    { rate: 0.1495, upTo: 59180 },
    { rate: 0.1667, upTo: 93000 },
    { rate: 0.175, upTo: 150000 },
    { rate: 0.21, upTo: Infinity },
  ],
  'ON': [
    { rate: 0.0505, upTo: 46226 },
    { rate: 0.0915, upTo: 92454 },
    { rate: 0.1116, upTo: 150000 },
    { rate: 0.1216, upTo: 220000 },
    { rate: 0.1316, upTo: Infinity },
  ],
  'PE': [
    { rate: 0.098, upTo: 31984 },
    { rate: 0.138, upTo: 63969 },
    { rate: 0.167, upTo: Infinity },
  ],
  'QC': [
    { rate: 0.15, upTo: 46295 },
    { rate: 0.20, upTo: 92580 },
    { rate: 0.24, upTo: 112655 },
    { rate: 0.2575, upTo: Infinity },
  ],
  'SK': [
    { rate: 0.105, upTo: 45677 },
    { rate: 0.125, upTo: 130506 },
    { rate: 0.145, upTo: Infinity },
  ],
  'NT': [
    { rate: 0.059, upTo: 44396 },
    { rate: 0.086, upTo: 88796 },
    { rate: 0.122, upTo: 144362 },
    { rate: 0.1405, upTo: Infinity },
  ],
  'NU': [
    { rate: 0.04, upTo: 44437 },
    { rate: 0.07, upTo: 88874 },
    { rate: 0.09, upTo: 144362 },
    { rate: 0.115, upTo: Infinity },
  ],
  'YT': [
    { rate: 0.064, upTo: 49020 },
    { rate: 0.09, upTo: 98040 },
    { rate: 0.109, upTo: 151978 },
    { rate: 0.128, upTo: 500000 },
    { rate: 0.15, upTo: Infinity },
  ],
};

export const provincialTaxBrackets2023 = {
  'AB': [
    { rate: 0.10, upTo: 142292 },
    { rate: 0.12, upTo: 170751 },
    { rate: 0.13, upTo: 227668 },
    { rate: 0.14, upTo: 341502 },
    { rate: 0.15, upTo: Infinity },
  ],
  'BC': [
    { rate: 0.0506, upTo: 43070 },
    { rate: 0.077, upTo: 86141 },
    { rate: 0.105, upTo: 98901 },
    { rate: 0.1229, upTo: 120094 },
    { rate: 0.147, upTo: 162832 },
    { rate: 0.168, upTo: 227091 },
    { rate: 0.205, upTo: Infinity },
  ],
  'MB': [
    { rate: 0.108, upTo: 33723 },
    { rate: 0.1275, upTo: 72885 },
    { rate: 0.174, upTo: Infinity },
  ],
  'NB': [
    { rate: 0.0968, upTo: 43835 },
    { rate: 0.1482, upTo: 87671 },
    { rate: 0.1652, upTo: 142534 },
    { rate: 0.1784, upTo: 162383 },
    { rate: 0.203, upTo: Infinity },
  ],
  'NL': [
    { rate: 0.087, upTo: 39157 },
    { rate: 0.145, upTo: 78315 },
    { rate: 0.158, upTo: 139780 },
    { rate: 0.173, upTo: 195693 },
    { rate: 0.183, upTo: Infinity },
  ],
  'NS': [
    { rate: 0.0879, upTo: 29590 },
    { rate: 0.1495, upTo: 59180 },
    { rate: 0.1667, upTo: 93000 },
    { rate: 0.175, upTo: 150000 },
    { rate: 0.21, upTo: Infinity },
  ],
  'ON': [
    { rate: 0.0505, upTo: 46226 },
    { rate: 0.0915, upTo: 92454 },
    { rate: 0.1116, upTo: 150000 },
    { rate: 0.1216, upTo: 220000 },
    { rate: 0.1316, upTo: Infinity },
  ],
  'PE': [
    { rate: 0.0985, upTo: 31984 },
    { rate: 0.138, upTo: 63969 },
    { rate: 0.167, upTo: Infinity },
  ],
  'QC': [
    { rate: 0.15, upTo: 45545 },
    { rate: 0.20, upTo: 91105 },
    { rate: 0.24, upTo: 112655 },
    { rate: 0.2575, upTo: Infinity },
  ],
  'SK': [
    { rate: 0.105, upTo: 47677 },
    { rate: 0.125, upTo: 136385 },
    { rate: 0.145, upTo: Infinity },
  ],
  'NT': [
    { rate: 0.059, upTo: 44437 },
    { rate: 0.086, upTo: 88874 },
    { rate: 0.122, upTo: 144362 },
    { rate: 0.1405, upTo: Infinity },
  ],
  'NU': [
    { rate: 0.04, upTo: 45462 },
    { rate: 0.07, upTo: 90925 },
    { rate: 0.09, upTo: 147692 },
    { rate: 0.115, upTo: Infinity },
  ],
  'YT': [
    { rate: 0.064, upTo: 50197 },
    { rate: 0.09, upTo: 100392 },
    { rate: 0.109, upTo: 155625 },
    { rate: 0.128, upTo: 500000 },
    { rate: 0.15, upTo: Infinity },
  ],
};

export const provincialTaxBrackets2024 = {
  'AB': [
    { rate: 0.10, upTo: 148269 },
    { rate: 0.12, upTo: 177922 },
    { rate: 0.13, upTo: 237230 },
    { rate: 0.14, upTo: 355845 },
    { rate: 0.15, upTo: Infinity },
  ],
  'BC': [
    { rate: 0.0506, upTo: 45654 },
    { rate: 0.077, upTo: 91310 },
    { rate: 0.105, upTo: 104835 },
    { rate: 0.1229, upTo: 127299 },
    { rate: 0.147, upTo: 172602 },
    { rate: 0.168, upTo: 240716 },
    { rate: 0.205, upTo: Infinity },
  ],
  'MB': [
    { rate: 0.108, upTo: 34431 },
    { rate: 0.1275, upTo: 74416 },
    { rate: 0.174, upTo: Infinity },
  ],
  'NB': [
    { rate: 0.094, upTo: 47715 },
    { rate: 0.14, upTo: 95431 },
    { rate: 0.16, upTo: 176756 },
    { rate: 0.195, upTo: Infinity },
  ],
  'NL': [
    { rate: 0.087, upTo: 39147 },
    { rate: 0.145, upTo: 78294 },
    { rate: 0.158, upTo: 139780 },
    { rate: 0.173, upTo: 195693 },
    { rate: 0.183, upTo: 250000 },
    { rate: 0.208, upTo: 500000 },
    { rate: 0.213, upTo: 1000000 },
    { rate: 0.218, upTo: Infinity },
  ],
  'NS': [
    { rate: 0.0879, upTo: 29590 },
    { rate: 0.1495, upTo: 59180 },
    { rate: 0.1667, upTo: 93000 },
    { rate: 0.175, upTo: 150000 },
    { rate: 0.21, upTo: Infinity },
  ],
  'ON': [
    { rate: 0.0505, upTo: 46226 },
    { rate: 0.0915, upTo: 92454 },
    { rate: 0.1116, upTo: 150000 },
    { rate: 0.1216, upTo: 220000 },
    { rate: 0.1316, upTo: Infinity },
  ],
  'PE': [
    { rate: 0.098, upTo: 31984 },
    { rate: 0.138, upTo: 63969 },
    { rate: 0.167, upTo: Infinity },
  ],
  'QC': [
    { rate: 0.14, upTo: 51780 },
    { rate: 0.20, upTo: 103545 },
    { rate: 0.24, upTo: 126000 },
    { rate: 0.2575, upTo: Infinity },
  ],
  'SK': [
    { rate: 0.105, upTo: 45677 },
    { rate: 0.125, upTo: 130506 },
    { rate: 0.145, upTo: Infinity },
  ],
  'NT': [
    { rate: 0.059, upTo: 44396 },
    { rate: 0.086, upTo: 88796 },
    { rate: 0.122, upTo: 144362 },
    { rate: 0.1405, upTo: Infinity },
  ],
  'NU': [
    { rate: 0.04, upTo: 44437 },
    { rate: 0.07, upTo: 88874 },
    { rate: 0.09, upTo: 144362 },
    { rate: 0.115, upTo: Infinity },
  ],
  'YT': [
    { rate: 0.064, upTo: 49020 },
    { rate: 0.09, upTo: 98040 },
    { rate: 0.109, upTo: 151978 },
    { rate: 0.128, upTo: 500000 },
    { rate: 0.15, upTo: Infinity },
  ],
};

export const provincialTaxBrackets2025 = {
  'AB': [
    { rate: 0.08, upTo: 60000 },
    { rate: 0.10, upTo: 151234 },
    { rate: 0.12, upTo: 181481 },
    { rate: 0.13, upTo: 241974 },
    { rate: 0.14, upTo: 362961 },
    { rate: 0.15, upTo: Infinity },
  ],
  'BC': [
    { rate: 0.0506, upTo: 49279 },
    { rate: 0.077, upTo: 98560 },
    { rate: 0.105, upTo: 113158 },
    { rate: 0.1229, upTo: 137407 },
    { rate: 0.147, upTo: 186306 },
    { rate: 0.168, upTo: 259829 },
    { rate: 0.205, upTo: Infinity },
  ],
  'MB': [
    { rate: 0.108, upTo: 47000 },
    { rate: 0.1275, upTo: 100000 },
    { rate: 0.174, upTo: Infinity },
  ],
  'NB': [
    { rate: 0.094, upTo: 51306 },
    { rate: 0.14, upTo: 102614 },
    { rate: 0.16, upTo: 190060 },
    { rate: 0.195, upTo: Infinity },
  ],
  'NL': [
    { rate: 0.087, upTo: 44192 },
    { rate: 0.145, upTo: 88382 },
    { rate: 0.158, upTo: 157792 },
    { rate: 0.178, upTo: 220910 },
    { rate: 0.198, upTo: 282214 },
    { rate: 0.208, upTo: 564429 },
    { rate: 0.213, upTo: 1128858 },
    { rate: 0.218, upTo: Infinity },
  ],
  'NS': [
    { rate: 0.0879, upTo: 30507 },
    { rate: 0.1495, upTo: 61015 },
    { rate: 0.1667, upTo: 95883 },
    { rate: 0.175, upTo: 154650 },
    { rate: 0.21, upTo: Infinity },
  ],
  'ON': [
    { rate: 0.0505, upTo: 52886 },
    { rate: 0.0915, upTo: 105775 },
    { rate: 0.1116, upTo: 150000 },
    { rate: 0.1216, upTo: 220000 },
    { rate: 0.1316, upTo: Infinity },
  ],
  'PE': [
    { rate: 0.095, upTo: 33328 },
    { rate: 0.1347, upTo: 64656 },
    { rate: 0.166, upTo: 105000 },
    { rate: 0.1762, upTo: 140000 },
    { rate: 0.19, upTo: Infinity },
  ],
  'QC': [
    { rate: 0.14, upTo: 53255 },
    { rate: 0.19, upTo: 106495 },
    { rate: 0.24, upTo: 129590 },
    { rate: 0.2575, upTo: Infinity },
  ],
  'SK': [
    { rate: 0.105, upTo: 53463 },
    { rate: 0.125, upTo: 152750 },
    { rate: 0.145, upTo: Infinity },
  ],
  'NT': [
    { rate: 0.059, upTo: 51964 },
    { rate: 0.086, upTo: 103930 },
    { rate: 0.122, upTo: 168967 },
    { rate: 0.1405, upTo: Infinity },
  ],
  'NU': [
    { rate: 0.04, upTo: 54707 },
    { rate: 0.07, upTo: 109413 },
    { rate: 0.09, upTo: 177881 },
    { rate: 0.115, upTo: Infinity },
  ],
  'YT': [
    { rate: 0.064, upTo: 57375 },
    { rate: 0.09, upTo: 114750 },
    { rate: 0.109, upTo: 177882 },
    { rate: 0.128, upTo: 500000 },
    { rate: 0.15, upTo: Infinity },
  ],
};

// For backward compatibility
 

// Budget Categories
export const budgetCategories2022 = [
  {
    id: 1,
    key: 'healthcare',
    name: 'Healthcare (Canada Health Transfer)',
    amount: 58200000000,
    description: 'Funding for healthcare systems across Canada, including medical and technical aid, healthcare professionals training, and public health initiatives.'
  },
  {
    id: 2,
    key: 'childrenAndFamilies',
    name: 'Children and Families',
    amount: 26900000000,
    description: 'Support for families with children, including the Canada Child Benefit (CCB), childcare initiatives, and family support programs.'
  },
  {
    id: 3,
    key: 'indigenousServices',
    name: 'Indigenous Services',
    amount: 39800000000,
    description: 'Funding for Indigenous communities, including healthcare, education, infrastructure, and community development.'
  },
  {
    id: 4,
    key: 'employmentInsuranceAndBenefits',
    name: 'Employment Insurance and Benefits',
    amount: 35600000000,
    description: 'Employment insurance benefits and related employment programs.'
  },
  {
    id: 5,
    key: 'supportForSeniors',
    name: 'Support for Seniors',
    amount: 69100000000,
    description: 'Old Age Security, Guaranteed Income Supplement, and other senior support programs.'
  },
  {
    id: 6,
    key: 'defense',
    name: 'Defense',
    amount: 36400000000,
    description: 'National defense spending, including military procurement, operations, and personnel costs.'
  },
  {
    id: 7,
    key: 'publicSafetyAndEmergencyPreparedness',
    name: 'Public Safety and Emergency Preparedness',
    amount: 11600000000,
    description: 'Funding for police, border security, corrections, and emergency management.'
  },
  {
    id: 8,
    key: 'internationalAffairsAndDevelopment',
    name: 'International Affairs and Development',
    amount: 9800000000,
    description: 'International aid, diplomacy, and global development initiatives.'
  },
  {
    id: 9,
    key: 'publicDebtCharges',
    name: 'Public Debt Charges',
    amount: 42700000000,
    description: 'Interest payments on the federal debt.'
  },
  {
    id: 10,
    key: 'loansInvestmentsAndAdvances',
    name: 'Loans, Investments, and Advances',
    amount: 10000000000,
    description: 'Government loans, investments, and financial advances.'
  },
  {
    id: 11,
    key: 'otherGovernmentOperations',
    name: 'Other Government Operations',
    amount: 242000000000,
    description: 'Various government operations including General Public Services ($40B), Social Protection Programs ($30B), Economic Affairs ($12B), and other departments and agencies.'
  }
];

// For backward compatibility
export const budgetCategories = budgetCategories2022;

// Budget Categories for 2024
export const budgetCategories2024 = [
  {
    id: 1,
    key: 'healthcareCanadaHealthTransfer',
    name: 'Healthcare (Canada Health Transfer)',
    amount: 50400000000,
    description: 'The federal government supports provincial and territorial healthcare systems through the Canada Health Transfer (CHT). This funding assists in delivering universal healthcare, including hospitals, healthcare professionals, and public health initiatives. Healthcare expenditures represent approximately 10% of total federal spending.'
  },
  {
    id: 2,
    key: 'supportForSeniors',
    name: 'Support for Seniors',
    amount: 76000000000,
    description: 'This allocation funds programs like Old Age Security (OAS) and the Guaranteed Income Supplement (GIS), providing basic income support to seniors. Driven by Canada\'s aging population, these programs account for around 14% of total federal spending.'
  },
  {
    id: 3,
    key: 'childrenAndFamilies',
    name: 'Children and Families',
    amount: 26300000000,
    description: 'The Canada Child Benefit (CCB) offers income support to low- and middle-income families to assist with child-rearing costs. This initiative plays a crucial role in reducing child poverty and constitutes about 6% of federal spending.'
  },
  {
    id: 4,
    key: 'indigenousServicesAndReconciliation',
    name: 'Indigenous Services and Reconciliation',
    amount: 35500000000,
    description: 'This funding supports Indigenous communities through initiatives in healthcare, education, infrastructure, and reconciliation efforts, including land claim settlements. Indigenous services represent around 7% of the total federal budget.'
  },
  {
    id: 5,
    key: 'employmentInsuranceAndOtherBenefits',
    name: 'Employment Insurance and Other Benefits',
    amount: 23100000000,
    description: 'Funding for Employment Insurance (EI) provides income support to temporarily unemployed workers, new parents, and seasonal employees. This category also includes retraining and skill development programs, making up around 5% of federal spending.'
  },
  {
    id: 6,
    key: 'defenseAndPublicSafety',
    name: 'Defense and Public Safety',
    amount: 32600000000,
    description: 'Expenditures cover the Canadian Armed Forces, military procurement (e.g., ships, aircraft), and public safety programs like border security and cybersecurity. This reflects Canada\'s defense commitments and represents about 6% of the total budget.'
  },
  {
    id: 7,
    key: 'debtServicingPublicDebtCharges',
    name: 'Debt Servicing (Public Debt Charges)',
    amount: 47300000000,
    description: 'Payments for interest on Canada\'s national debt, which totaled $1.173 trillion by the end of the fiscal year. Rising interest rates have increased debt servicing costs, accounting for around 9% of total spending.'
  },
  {
    id: 8,
    key: 'loansInvestmentsAndAdvances',
    name: 'Loans, Investments, and Advances',
    amount: 10000000000,
    description: 'This category encompasses various financial assistance programs including Student Loans ($24B total portfolio), Agriculture Loans ($162M), International Development and Loans ($53B total), Business and Innovation Loans ($600M), Defense Sector Loans ($1.45B), and Economic Development Loans.'
  },
  {
    id: 9,
    key: 'otherGovernmentOperations',
    name: 'Other Government Operations',
    amount: 140000000000,
    description: 'This category includes Transportation Infrastructure ($15B), Environmental Programs ($8B), Public Safety ($9B), Government Buildings ($7B), Research and Innovation ($10B), Digital Government ($5B), Federal Employee Salaries ($35B), Legal and Justice System ($5B), Indigenous Services Operations ($4B), Cultural Programs ($2B), Scientific R&D ($5B), and Diplomatic Representation ($5B).'
  }
];

// Base budget data for 2024 (in billions)
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
];

// Federal budget data for 2024 (in billions)
export const federalBudget2024Data = [
  { category: 'Economic Growth and Tax Policies', amount: 412.4 },
  { category: 'Housing and Affordability', amount: 121.418 },
  { category: 'Green Energy and Sustainability', amount: 8.407 },
  { category: 'Social Programs and Indigenous Communities', amount: 1.236 },
  { category: 'Defence and Public Safety', amount: 43.143 },
  { category: 'Public Debt and Fiscal Stability', amount: 58.3 },
  { category: 'Strategic Investments in Innovation', amount: 0.138 }
];

// ---------------------------------------------------------------------------
// Unified tax params, fiscal year defaults, and helpers
// ---------------------------------------------------------------------------

export const DEFAULT_FISCAL_YEAR = '2025-26';

// CRA indexed amounts (source: CRA indexation table)
const bpaPhaseOutByYear = {
  '2023': { start: 165430, end: 235675, floor: 13520 },
  '2024': { start: 173205, end: 246752, floor: 14156 },
  '2025': { start: 177882, end: 253414, floor: 14538 },
};

const buildRocContributions = (federalContributionRates) => ({
  pensionPlan: {
    base: {
      rate: federalContributionRates.cpp.rate,
      ympe: federalContributionRates.cpp.maxPensionableEarnings,
      ybe: federalContributionRates.cpp.basicExemption,
      max: federalContributionRates.cpp.maxContribution,
    },
    add: {
      rate: federalContributionRates.cpp2.rate,
      min: federalContributionRates.cpp2.minPensionableEarnings,
      maxPensionableEarnings: federalContributionRates.cpp2.maxPensionableEarnings,
      max: federalContributionRates.cpp2.maxContribution,
    },
  },
  ei: {
    rate: federalContributionRates.ei.rate,
    maxInsurableEarnings: federalContributionRates.ei.maxInsurableEarnings,
    max: federalContributionRates.ei.maxContribution,
  },
});

const buildQcContributions = (quebecContributionRates) => ({
  pensionPlan: {
    base: {
      rate: quebecContributionRates.qpp.rate,
      mpe: quebecContributionRates.qpp.maxPensionableEarnings,
      ybe: quebecContributionRates.qpp.basicExemption,
      max: quebecContributionRates.qpp.maxContribution,
    },
    add: {
      rate: quebecContributionRates.qpp2.rate,
      min: quebecContributionRates.qpp2.minPensionableEarnings,
      maxPensionableEarnings: quebecContributionRates.qpp2.maxPensionableEarnings,
      max: quebecContributionRates.qpp2.maxContribution,
    },
  },
  ei: {
    rate: quebecContributionRates.ei.rate,
    maxInsurableEarnings: quebecContributionRates.ei.maxInsurableEarnings,
    max: quebecContributionRates.ei.maxContribution,
  },
  qpip: {
    rate: quebecContributionRates.qpip.rate,
    maxInsurableEarnings: quebecContributionRates.qpip.maxInsurableEarnings,
    max: quebecContributionRates.qpip.maxContribution,
  },
});

export const TAX_PARAMS_BY_YEAR = {
  '2023': {
    // 2023 uses 2022 rates/budget projections
    federalBrackets: federalTaxBrackets2022,
    provincialBrackets: provincialTaxBrackets2022,
    federalBasicPersonalAmount: federalBasicPersonalAmount2022,
    provincialBasicPersonalAmounts: provincialBasicPersonalAmounts2022,
    credits: taxCredits2023,
    deductions: null,
    contributions: {
      roc: buildRocContributions(federalContributionRates2024),
      qc: buildQcContributions(quebecContributionRates2024),
    },
    bpaPhaseOut: bpaPhaseOutByYear['2023'],
  },
  '2024': {
    federalBrackets: federalTaxBrackets2024,
    provincialBrackets: provincialTaxBrackets2024,
    federalBasicPersonalAmount: federalBasicPersonalAmount2024,
    provincialBasicPersonalAmounts: provincialBasicPersonalAmounts2024,
    credits: taxCredits2024,
    deductions: null,
    contributions: {
      roc: buildRocContributions(federalContributionRates2024),
      qc: buildQcContributions(quebecContributionRates2024),
    },
    bpaPhaseOut: bpaPhaseOutByYear['2024'],
  },
  '2025': {
    federalBrackets: federalTaxBrackets2025,
    provincialBrackets: provincialTaxBrackets2025,
    federalBasicPersonalAmount: federalBasicPersonalAmount2025,
    provincialBasicPersonalAmounts: provincialBasicPersonalAmounts2025,
    credits: taxCredits2025,
    deductions: taxDeductions2025,
    contributions: {
      roc: buildRocContributions(federalContributionRates2025),
      qc: buildQcContributions(quebecContributionRates2025),
    },
    bpaPhaseOut: bpaPhaseOutByYear['2025'],
  },
};

export function getTaxParams(taxYear) {
  return TAX_PARAMS_BY_YEAR[String(taxYear)] || TAX_PARAMS_BY_YEAR['2025'];
}

export function getProvincialBrackets(taxYear, provinceCode) {
  const params = getTaxParams(taxYear);
  const provs = params?.provincialBrackets || {};
  return provs[provinceCode] || null;
}

export function getContributionsForProvince(taxYear, provinceCode) {
  const params = getTaxParams(taxYear);
  const isQc = provinceCode === 'QC';
  return isQc ? params.contributions.qc : params.contributions.roc;
}

export function deriveSharesFromBudgetCategories(categories = []) {
  const total = categories.reduce((sum, cat) => sum + (cat?.amount || 0), 0);
  if (!total) return {};
  return categories.reduce((acc, cat) => {
    if (!cat || !cat.key) return acc;
    acc[cat.key] = (cat.amount || 0) / total;
    return acc;
  }, {});
}

export const SPENDING_SOURCES_BY_FY = {
  '2022-2023': { categories: budgetCategories, approx: false },
  '2023-2024': { categories: budgetCategories2024, approx: true },
  '2025-26': { categories: budgetCategories2024, approx: true },
};

export function getSpendingSource(fiscalYear = DEFAULT_FISCAL_YEAR) {
  return SPENDING_SOURCES_BY_FY[fiscalYear] || SPENDING_SOURCES_BY_FY[DEFAULT_FISCAL_YEAR];
}

export function assertSharesSumToOne(shares, tolerance = 1e-3) {
  const values = Object.values(shares || {});
  const total = values.reduce((a, b) => a + (Number(b) || 0), 0);
  if (Math.abs(total - 1) > tolerance) {
    throw new Error(`Spending shares must sum to 1.0, got ${total}`);
  }
}

export function assertBracketsMonotonic(brackets, label) {
  if (!Array.isArray(brackets) || brackets.length === 0) {
    throw new Error(`Missing brackets for ${label}`);
  }
  let lastUpTo = -Infinity;
  let lastRate = -Infinity;
  for (let i = 0; i < brackets.length; i++) {
    const b = brackets[i];
    if (typeof b.upTo !== 'number' || typeof b.rate !== 'number') {
      throw new Error(`Invalid bracket entry for ${label}`);
    }
    if (b.upTo <= lastUpTo) {
      throw new Error(`Bracket thresholds must increase for ${label}`);
    }
    if (b.rate < lastRate) {
      throw new Error(`Bracket rates must be non-decreasing for ${label}`);
    }
    if (i === brackets.length - 1 && b.upTo !== Infinity) {
      throw new Error(`Last bracket must have upTo Infinity for ${label}`);
    }
    if (b.upTo !== Infinity && (!Number.isInteger(b.upTo) || b.upTo <= 0)) {
      throw new Error(`Bracket thresholds must be positive integers for ${label}`);
    }
    lastUpTo = b.upTo;
    lastRate = b.rate;
  }
}

export function assertTaxParams(yearKey, params) {
  if (!params) throw new Error(`Missing tax params for year ${yearKey}`);
  assertBracketsMonotonic(params.federalBrackets, `federal ${yearKey}`);
  const provs = params.provincialBrackets || {};
  Object.keys(provs).forEach((code) => {
    assertBracketsMonotonic(provs[code], `provincial ${code} ${yearKey}`);
  });
}