/**
 * entityImpactFactors.js
 * 
 * This file maps out all the factors that affect each entity's sentiment,
 * regardless of current budget values. It provides a comprehensive view of
 * what each region, demographic, and sector cares about.
 */

export const entityImpactFactors = {
  provinces: {
    Ontario: {
      factors: [
        { category: 'revenue', name: 'Corporate Tax', description: 'Economic competitiveness and business climate' },
        { category: 'spending', name: 'Economic Development', description: 'Support for innovation hubs and job creation' },
        { category: 'spending', name: 'Infrastructure', description: 'Transit, highways, and broadband development' },
        { category: 'spending', name: 'Children and Families', description: 'Child and family benefits' },
        { category: 'spending', name: 'Healthcare', description: 'Healthcare funding and services' }
      ]
    },
    Quebec: {
      factors: [
        { category: 'spending', name: 'Children and Families', description: 'Universal childcare and family benefits' },
        { category: 'spending', name: 'Healthcare', description: 'Public healthcare and French-language services' },
        { category: 'spending', name: 'Education', description: 'Post-secondary and CEGEP funding' },
        { category: 'spending', name: 'Cultural Programs', description: 'Arts, heritage, and French-language media' },
        { category: 'spending', name: 'Environment and Climate Change', description: 'Climate action and environmental protection' },
        { category: 'revenue', name: 'Carbon Pricing', description: 'Carbon pricing and environmental policy' },
        { category: 'revenue', name: 'Corporate Tax', description: 'Tax policy and business environment' },
        { category: 'spending', name: 'Immigration', description: 'French-language integration and immigrant support' }
      ]
    },
    BritishColumbia: {
      factors: [
        { category: 'spending', name: 'Environment and Climate Change', description: 'Environmental protection and climate action' },
        { category: 'spending', name: 'Housing', description: 'Housing affordability and development' },
        { category: 'spending', name: 'Healthcare', description: 'Healthcare services and accessibility' },
        { category: 'spending', name: 'Infrastructure', description: 'Transit and urban development' },
        { category: 'revenue', name: 'Carbon Pricing', description: 'Carbon pricing and environmental policy' }
      ]
    },
    Alberta: {
      factors: [
        { category: 'revenue', name: 'Corporate Tax', description: 'Business competitiveness and investment' },
        { category: 'spending', name: 'Economic Development', description: 'Energy sector and economic growth' },
        { category: 'spending', name: 'Infrastructure', description: 'Highways and resource infrastructure' },
        { category: 'revenue', name: 'Carbon Pricing', description: 'Carbon tax and energy policy' },
        { category: 'spending', name: 'Natural Resources', description: 'Energy and resource development' }
      ]
    },
    Manitoba: {
      factors: [
        { category: 'spending', name: 'Healthcare', description: 'Healthcare services and accessibility' },
        { category: 'spending', name: 'Indigenous Services', description: 'Indigenous community support' },
        { category: 'spending', name: 'Agriculture', description: 'Agricultural support and development' },
        { category: 'spending', name: 'Infrastructure', description: 'Rural infrastructure development' }
      ]
    },
    Saskatchewan: {
      factors: [
        { category: 'spending', name: 'Agriculture', description: 'Agricultural support and development' },
        { category: 'spending', name: 'Natural Resources', description: 'Resource sector development' },
        { category: 'spending', name: 'Infrastructure', description: 'Rural infrastructure development' },
        { category: 'revenue', name: 'Carbon Pricing', description: 'Energy and resource policy' }
      ]
    },
    NovaScotia: {
      factors: [
        { category: 'spending', name: 'Healthcare', description: 'Healthcare services and accessibility' },
        { category: 'spending', name: 'Economic Development', description: 'Maritime economy support' },
        { category: 'spending', name: 'Infrastructure', description: 'Port and coastal infrastructure' },
        { category: 'spending', name: 'Environment and Climate Change', description: 'Coastal protection' }
      ]
    },
    NewBrunswick: {
      factors: [
        { category: 'spending', name: 'Healthcare', description: 'Healthcare services and accessibility' },
        { category: 'spending', name: 'Economic Development', description: 'Maritime economy support' },
        { category: 'spending', name: 'Infrastructure', description: 'Port and coastal infrastructure' },
        { category: 'spending', name: 'Education', description: 'Bilingual education support' }
      ]
    },
    NewfoundlandandLabrador: {
      factors: [
        { category: 'spending', name: 'Healthcare', description: 'Healthcare services and accessibility' },
        { category: 'spending', name: 'Economic Development', description: 'Maritime economy support' },
        { category: 'spending', name: 'Natural Resources', description: 'Offshore resource development' },
        { category: 'spending', name: 'Infrastructure', description: 'Port and coastal infrastructure' }
      ]
    },
    PrinceEdwardIsland: {
      factors: [
        { category: 'spending', name: 'Healthcare', description: 'Healthcare services and accessibility' },
        { category: 'spending', name: 'Economic Development', description: 'Maritime economy support' },
        { category: 'spending', name: 'Agriculture', description: 'Agricultural support' },
        { category: 'spending', name: 'Infrastructure', description: 'Island infrastructure development' }
      ]
    },
    Yukon: {
      factors: [
        { category: 'spending', name: 'Indigenous Services', description: 'Indigenous community support' },
        { category: 'spending', name: 'Natural Resources', description: 'Resource development' },
        { category: 'spending', name: 'Infrastructure', description: 'Northern infrastructure development' },
        { category: 'spending', name: 'Environment and Climate Change', description: 'Northern climate action' }
      ]
    },
    NorthwestTerritories: {
      factors: [
        { category: 'spending', name: 'Indigenous Services', description: 'Indigenous community support' },
        { category: 'spending', name: 'Natural Resources', description: 'Resource development' },
        { category: 'spending', name: 'Infrastructure', description: 'Northern infrastructure development' },
        { category: 'spending', name: 'Environment and Climate Change', description: 'Northern climate action' }
      ]
    },
    Nunavut: {
      factors: [
        { category: 'spending', name: 'Indigenous Services', description: 'Indigenous community support' },
        { category: 'spending', name: 'Infrastructure', description: 'Northern infrastructure development' },
        { category: 'spending', name: 'Healthcare', description: 'Northern healthcare services' },
        { category: 'spending', name: 'Education', description: 'Northern education support' }
      ]
    }
  },

  demographics: {
    youth: {
      factors: [
        { category: 'spending', name: 'Education', description: 'Post-secondary education and accessibility' },
        { category: 'spending', name: 'Skills Development', description: 'Job training and upskilling' },
        { category: 'spending', name: 'Environment and Climate Change', description: 'Climate action and green jobs' },
        { category: 'revenue', name: 'Carbon Pricing', description: 'Environmental policy' },
        { category: 'spending', name: 'Housing', description: 'Housing affordability' },
        { category: 'spending', name: 'Digital Government', description: 'Online services and digital access' },
        { category: 'revenue', name: 'Wealth Tax', description: 'Wealth redistribution' },
        { category: 'spending', name: 'Student Loans', description: 'Student debt and financial support' }
      ]
    },
    students: {
      factors: [
        { category: 'spending', name: 'Education', description: 'Education funding and research' },
        { category: 'spending', name: 'Science and Innovation', description: 'Research opportunities' },
        { category: 'revenue', name: 'Student Tax Credits', description: 'Tax credits for students' },
        { category: 'spending', name: 'Student Loans', description: 'Loan forgiveness and support' },
        { category: 'spending', name: 'Housing', description: 'Student housing support' },
        { category: 'spending', name: 'Digital Government', description: 'Digital infrastructure' },
        { category: 'spending', name: 'Transit', description: 'Affordable transit' },
        { category: 'spending', name: 'Mental Health', description: 'Student mental health support' }
      ]
    },
    techWorkers: {
      factors: [
        { category: 'spending', name: 'Science and Innovation', description: 'R&D funding' },
        { category: 'spending', name: 'Digital Government', description: 'Digital transformation' },
        { category: 'spending', name: 'Skills Development', description: 'Tech training' },
        { category: 'spending', name: 'Education', description: 'STEM education' },
        { category: 'revenue', name: 'Corporate Tax', description: 'Competitive tax rates' },
        { category: 'revenue', name: 'Corporate Tax Expenditures', description: 'Startup incentives' },
        { category: 'spending', name: 'Cybersecurity', description: 'Digital security' },
        { category: 'spending', name: 'Housing', description: 'Tech hub housing' },
        { category: 'spending', name: 'Immigration', description: 'Talent attraction' }
      ]
    },
    smallBusinessOwners: {
      factors: [
        { category: 'revenue', name: 'Corporate Tax', description: 'Business tax rates' },
        { category: 'revenue', name: 'GST', description: 'Sales tax impact' },
        { category: 'spending', name: 'Economic Development', description: 'Business support programs' },
        { category: 'spending', name: 'Skills Development', description: 'Workforce training' },
        { category: 'spending', name: 'Digital Government', description: 'Digital services' },
        { category: 'spending', name: 'Infrastructure', description: 'Business infrastructure' }
      ]
    },
    newImmigrants: {
      factors: [
        { category: 'spending', name: 'Immigration', description: 'Immigration services' },
        { category: 'spending', name: 'Skills Development', description: 'Job training' },
        { category: 'spending', name: 'Housing', description: 'Housing support' },
        { category: 'spending', name: 'Education', description: 'Education access' },
        { category: 'spending', name: 'Healthcare', description: 'Healthcare access' },
        { category: 'spending', name: 'Language Training', description: 'Language support' }
      ]
    },
    unionizedWorkers: {
      factors: [
        { category: 'spending', name: 'Skills Development', description: 'Workforce training' },
        { category: 'spending', name: 'Healthcare', description: 'Healthcare benefits' },
        { category: 'spending', name: 'Pensions', description: 'Pension security' },
        { category: 'spending', name: 'Public Safety', description: 'Workplace safety' },
        { category: 'spending', name: 'Economic Development', description: 'Job security' }
      ]
    },
    renters: {
      factors: [
        { category: 'spending', name: 'Housing', description: 'Rental support' },
        { category: 'revenue', name: 'GST', description: 'Sales tax impact' },
        { category: 'spending', name: 'Transit', description: 'Affordable transit' },
        { category: 'spending', name: 'Healthcare', description: 'Healthcare access' },
        { category: 'spending', name: 'Education', description: 'Education access' }
      ]
    },
    veterans: {
      factors: [
        { category: 'spending', name: 'Veterans Affairs', description: 'Veterans programs' },
        { category: 'spending', name: 'Mental Health', description: 'PTSD/mental health support' },
        { category: 'spending', name: 'Healthcare', description: 'Healthcare access' },
        { category: 'spending', name: 'Housing', description: 'Veterans housing' },
        { category: 'spending', name: 'Support for Seniors', description: 'Aging veterans support' },
        { category: 'spending', name: 'Defense', description: 'Military support' },
        { category: 'spending', name: 'Skills Development', description: 'Civilian transition' },
        { category: 'revenue', name: 'Personal Tax Credits', description: 'Veterans tax credits' }
      ]
    },
    indigenousPeoples: {
      factors: [
        { category: 'spending', name: 'Indigenous Services', description: 'Indigenous programs' },
        { category: 'spending', name: 'Healthcare', description: 'Healthcare access' },
        { category: 'spending', name: 'Education', description: 'Education support' },
        { category: 'spending', name: 'Housing', description: 'Housing support' },
        { category: 'spending', name: 'Environment and Climate Change', description: 'Environmental protection' },
        { category: 'spending', name: 'Cultural Programs', description: 'Cultural preservation' }
      ]
    },
    rural: {
      factors: [
        { category: 'spending', name: 'Infrastructure', description: 'Rural infrastructure development' },
        { category: 'spending', name: 'Agriculture', description: 'Agricultural support' },
        { category: 'spending', name: 'Healthcare', description: 'Rural healthcare access' },
        { category: 'spending', name: 'Broadband', description: 'Rural internet connectivity' },
        { category: 'spending', name: 'Natural Resources', description: 'Resource sector support' },
        { category: 'spending', name: 'Education', description: 'Rural education access' },
        { category: 'spending', name: 'Public Safety', description: 'Rural emergency services' }
      ]
    },
    urban: {
      factors: [
        { category: 'spending', name: 'Transit', description: 'Public transit and transportation' },
        { category: 'spending', name: 'Infrastructure', description: 'Urban infrastructure development' },
        { category: 'spending', name: 'Housing', description: 'Housing affordability' },
        { category: 'spending', name: 'Environment and Climate Change', description: 'Air quality and climate action' },
        { category: 'revenue', name: 'Carbon Pricing', description: 'Environmental policy' },
        { category: 'spending', name: 'Digital Government', description: 'Smart cities and digital services' },
        { category: 'spending', name: 'Immigration', description: 'Settlement services' },
        { category: 'spending', name: 'Public Safety', description: 'Urban safety and security' }
      ]
    },
    workers: {
      factors: [
        { category: 'spending', name: 'Skills Development', description: 'Job training and upskilling' },
        { category: 'spending', name: 'Healthcare', description: 'Healthcare benefits' },
        { category: 'spending', name: 'Economic Development', description: 'Job creation' },
        { category: 'spending', name: 'Infrastructure', description: 'Workplace infrastructure' },
        { category: 'spending', name: 'Public Safety', description: 'Workplace safety' },
        { category: 'revenue', name: 'Personal Income Tax Revenue', description: 'Tax burden' }
      ]
    },
    families: {
      factors: [
        { category: 'spending', name: 'Children and Families', description: 'Family support programs' },
        { category: 'spending', name: 'Healthcare', description: 'Family healthcare' },
        { category: 'spending', name: 'Education', description: 'Education access' },
        { category: 'spending', name: 'Housing', description: 'Family housing' },
        { category: 'spending', name: 'Child Care', description: 'Child care support' },
        { category: 'revenue', name: 'Family Tax Credits', description: 'Family tax benefits' }
      ]
    },
    seniors: {
      factors: [
        { category: 'spending', name: 'Healthcare', description: 'Healthcare services and accessibility' },
        { category: 'spending', name: 'Support for Seniors', description: 'Senior care and support programs' },
        { category: 'spending', name: 'Housing', description: 'Senior housing and accessibility' },
        { category: 'spending', name: 'Mental Health', description: 'Mental health services' },
        { category: 'spending', name: 'Pensions', description: 'Pension security and support' },
        { category: 'spending', name: 'Public Safety', description: 'Senior safety and security' }
      ]
    }
  },

  sectors: {
    business: {
      factors: [
        { category: 'revenue', name: 'Corporate Tax', description: 'Business competitiveness' },
        { category: 'spending', name: 'Skills Development', description: 'Workforce development' },
        { category: 'spending', name: 'Economic Development', description: 'Business growth' },
        { category: 'spending', name: 'Infrastructure', description: 'Business infrastructure' },
        { category: 'spending', name: 'Digital Government', description: 'Digital services' },
        { category: 'revenue', name: 'Carbon Pricing', description: 'Environmental compliance' }
      ]
    },
    environment: {
      factors: [
        { category: 'spending', name: 'Environment and Climate Change', description: 'Climate programs' },
        { category: 'revenue', name: 'Carbon Pricing', description: 'Environmental policy' },
        { category: 'spending', name: 'Transit', description: 'Public transit' },
        { category: 'spending', name: 'Infrastructure', description: 'Green infrastructure' },
        { category: 'spending', name: 'Science and Innovation', description: 'Clean tech research' },
        { category: 'spending', name: 'Indigenous Services', description: 'Indigenous stewardship' },
        { category: 'spending', name: 'Natural Resources', description: 'Conservation programs' }
      ]
    },
    healthcare: {
      factors: [
        { category: 'spending', name: 'Healthcare', description: 'Healthcare funding' },
        { category: 'spending', name: 'Science and Innovation', description: 'Medical research' },
        { category: 'revenue', name: 'Health Tax Credits', description: 'Health benefits' },
        { category: 'spending', name: 'Support for Seniors', description: 'Senior care' },
        { category: 'spending', name: 'Children and Families', description: 'Family health' },
        { category: 'spending', name: 'Digital Government', description: 'Health records' }
      ]
    },
    defense: {
      factors: [
        { category: 'spending', name: 'Defense', description: 'Military funding' },
        { category: 'spending', name: 'Diplomatic Representation', description: 'International presence' },
        { category: 'spending', name: 'International Development', description: 'Global stability' },
        { category: 'spending', name: 'Cybersecurity', description: 'Digital defense' },
        { category: 'spending', name: 'Public Safety', description: 'Domestic security' },
        { category: 'spending', name: 'Border Security', description: 'Border protection' }
      ]
    },
    education: {
      factors: [
        { category: 'spending', name: 'Education', description: 'Education funding' },
        { category: 'spending', name: 'Skills Development', description: 'Training programs' },
        { category: 'spending', name: 'Children and Families', description: 'Early education' },
        { category: 'spending', name: 'Science and Innovation', description: 'Research funding' },
        { category: 'spending', name: 'Digital Government', description: 'Digital learning' },
        { category: 'spending', name: 'Student Loans', description: 'Student support' }
      ]
    },
    technology: {
      factors: [
        { category: 'spending', name: 'Science and Innovation', description: 'R&D funding' },
        { category: 'spending', name: 'Digital Government', description: 'Digital transformation' },
        { category: 'revenue', name: 'Corporate Tax Expenditures', description: 'Startup incentives' },
        { category: 'spending', name: 'Skills Development', description: 'Talent development' },
        { category: 'spending', name: 'Cybersecurity', description: 'Security focus' },
        { category: 'revenue', name: 'Corporate Tax', description: 'Tax competitiveness' },
        { category: 'spending', name: 'Immigration', description: 'Talent attraction' }
      ]
    },
    finance: {
      factors: [
        { category: 'revenue', name: 'Corporate Tax', description: 'Tax competitiveness' },
        { category: 'spending', name: 'Economic Development', description: 'Economic stability' },
        { category: 'spending', name: 'Digital Government', description: 'Digital infrastructure' },
        { category: 'spending', name: 'Cybersecurity', description: 'Financial security' },
        { category: 'spending', name: 'International Assistance', description: 'Global markets' },
        { category: 'revenue', name: 'Corporate Tax Expenditures', description: 'Investment incentives' },
        { category: 'spending', name: 'Deficit', description: 'Fiscal responsibility' },
        { category: 'spending', name: 'Infrastructure', description: 'Economic infrastructure' }
      ]
    },
    realEstate: {
      factors: [
        { category: 'spending', name: 'Housing', description: 'Housing investment' },
        { category: 'spending', name: 'Infrastructure', description: 'Community development' },
        { category: 'revenue', name: 'Corporate Tax', description: 'Development climate' },
        { category: 'revenue', name: 'Homeowner Tax Credits', description: 'Homeowner incentives' },
        { category: 'spending', name: 'Economic Development', description: 'Urban development' },
        { category: 'spending', name: 'Environment and Climate Change', description: 'Sustainability' },
        { category: 'spending', name: 'Transit', description: 'Transit infrastructure' },
        { category: 'spending', name: 'Digital Government', description: 'Digital infrastructure' }
      ]
    },
    creativeIndustries: {
      factors: [
        { category: 'spending', name: 'Cultural Programs', description: 'Arts funding' },
        { category: 'spending', name: 'Tourism', description: 'Tourism support' },
        { category: 'spending', name: 'Digital Government', description: 'Digital support' },
        { category: 'spending', name: 'Skills Development', description: 'Skills support' },
        { category: 'revenue', name: 'Corporate Tax Expenditures', description: 'Industry incentives' },
        { category: 'spending', name: 'Indigenous Services', description: 'Indigenous arts' },
        { category: 'spending', name: 'Education', description: 'Arts education' }
      ]
    },
    manufacturing: {
      factors: [
        { category: 'revenue', name: 'Corporate Tax', description: 'Tax competitiveness' },
        { category: 'spending', name: 'Economic Development', description: 'Industry support' },
        { category: 'spending', name: 'Infrastructure', description: 'Manufacturing infrastructure' },
        { category: 'revenue', name: 'Carbon Pricing', description: 'Environmental costs' },
        { category: 'spending', name: 'Science and Innovation', description: 'Innovation support' },
        { category: 'spending', name: 'Skills Development', description: 'Training support' },
        { category: 'spending', name: 'Trade', description: 'Trade support' }
      ]
    },
    publicSector: {
      factors: [
        { category: 'spending', name: 'Public Administration', description: 'Service funding' },
        { category: 'spending', name: 'Digital Government', description: 'Modernization' },
        { category: 'revenue', name: 'Personal Income Tax Revenue', description: 'Revenue base' },
        { category: 'spending', name: 'Skills Development', description: 'Training' },
        { category: 'spending', name: 'Cybersecurity', description: 'Security' },
        { category: 'spending', name: 'Mental Health', description: 'Mental health support' },
        { category: 'spending', name: 'Deficit', description: 'Fiscal management' }
      ]
    },
    energy: {
      factors: [
        { category: 'spending', name: 'Natural Resources', description: 'Energy sector development' },
        { category: 'revenue', name: 'Carbon Pricing', description: 'Environmental policy' },
        { category: 'spending', name: 'Environment and Climate Change', description: 'Climate action' },
        { category: 'spending', name: 'Science and Innovation', description: 'Energy research' },
        { category: 'spending', name: 'Infrastructure', description: 'Energy infrastructure' },
        { category: 'revenue', name: 'Corporate Tax', description: 'Energy sector taxation' }
      ]
    },
    tourism: {
      factors: [
        { category: 'spending', name: 'Economic Development', description: 'Tourism promotion' },
        { category: 'spending', name: 'Infrastructure', description: 'Tourism infrastructure' },
        { category: 'spending', name: 'Cultural Programs', description: 'Cultural attractions' },
        { category: 'spending', name: 'Environment and Climate Change', description: 'Natural attractions' },
        { category: 'spending', name: 'Immigration', description: 'Tourism workforce' },
        { category: 'spending', name: 'Digital Government', description: 'Digital tourism services' }
      ]
    },
    agriculture: {
      factors: [
        { category: 'spending', name: 'Agriculture', description: 'Agricultural support' },
        { category: 'spending', name: 'Infrastructure', description: 'Rural infrastructure' },
        { category: 'spending', name: 'Environment and Climate Change', description: 'Sustainable farming' },
        { category: 'revenue', name: 'Carbon Pricing', description: 'Agricultural emissions policy' },
        { category: 'spending', name: 'Science and Innovation', description: 'Agricultural research' },
        { category: 'spending', name: 'Skills Development', description: 'Agricultural training' }
      ]
    },
    indigenous: {
      factors: [
        { category: 'spending', name: 'Indigenous Services', description: 'Indigenous community support' },
        { category: 'spending', name: 'Healthcare', description: 'Indigenous healthcare services' },
        { category: 'spending', name: 'Education', description: 'Indigenous education support' },
        { category: 'spending', name: 'Natural Resources', description: 'Resource stewardship' },
        { category: 'spending', name: 'Housing', description: 'Indigenous housing support' },
        { category: 'spending', name: 'Cultural Programs', description: 'Cultural preservation' },
        { category: 'spending', name: 'Infrastructure', description: 'Community infrastructure' }
      ]
    },
    veteransServices: {
      factors: [
        { category: 'spending', name: 'Veterans Affairs', description: 'Veterans programs' },
        { category: 'spending', name: 'Mental Health', description: 'PTSD/mental health support' },
        { category: 'spending', name: 'Healthcare', description: 'Healthcare access' },
        { category: 'spending', name: 'Housing', description: 'Veterans housing' },
        { category: 'spending', name: 'Support for Seniors', description: 'Aging veterans support' },
        { category: 'spending', name: 'Skills Development', description: 'Civilian transition' },
        { category: 'revenue', name: 'Personal Tax Credits', description: 'Veterans tax credits' }
      ]
    }
  }
}; 