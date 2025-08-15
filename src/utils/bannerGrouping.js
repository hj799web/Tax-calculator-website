export const bannerGroupMap = {
  // Revenue sources
  personalIncomeTax: 'Income taxes',
  corporateIncomeTax: 'Income taxes',
  gst: 'Consumption taxes',
  exciseTaxes: 'Consumption taxes',
  customsDuties: 'Consumption taxes',
  eiPremiums: 'Other revenue sources',
  crownProfits: 'Other revenue sources',
  nonTaxRevenue: 'Other revenue sources',
  resourceRoyalties: 'Other revenue sources',

  // Main spending categories
  healthcare: 'Main categories',
  seniors: 'Main categories',
  childrenFamilies: 'Main categories',
  indigenousServices: 'Main categories',
  employmentInsurance: 'Main categories',
  defensePublicSafety: 'Main categories',
  
  // Additional main categories that presets expect
  education: 'Main categories',
  defense: 'Main categories',
  scienceAndInnovation: 'Main categories',
  infrastructure: 'Main categories',
  digitalGovernment: 'Main categories',
  environmentAndClimateChange: 'Main categories',
  carbonPricing: 'Main categories',
  agriculture: 'Main categories',
  culturalPrograms: 'Main categories',
  transit: 'Main categories',
  economicDevelopment: 'Main categories',
  indigenousOperations: 'Main categories',
  diplomaticRepresentation: 'Main categories',

  // Spending parent groups
  loansInvestments: 'Other categories',
  governmentOperations: 'Other categories',

  // Loans, Investments & Advances subcategories
  studentLoans: 'Other categories',
  agricultureLoans: 'Other categories',
  businessInnovation: 'Other categories',
  defenseSector: 'Other categories',

  // Government Operations subcategories
  transportationInfrastructure: 'Other categories',
  environmentalPrograms: 'Other categories',
  publicSafetyEmergency: 'Other categories',
  governmentBuildings: 'Other categories',
  researchInnovation: 'Other categories',
  federalEmployeeSalaries: 'Other categories',
  legalJusticeSystem: 'Other categories',
  indigenousServicesOps: 'Other categories',
  culturalHeritage: 'Other categories',
  scientificResearch: 'Other categories',

  // Tax expenditures / credits (parent and sample children)
  taxExpenditures: 'Tax expenditures / credits',
  personalIncomeTaxCredits: 'Tax expenditures / credits',
  corporateTaxExpenditures: 'Tax expenditures / credits',
  gstExpenditures: 'Tax expenditures / credits',
  taxDeferrals: 'Tax expenditures / credits',
};

// Optional stable order for display purposes
export const bannerGroupOrder = [
  'Income taxes',
  'Consumption taxes',
  'Other revenue sources',
  'Tax expenditures / credits',
  'Main categories',
  'Other categories',
  'Mixed Changes'
]; 