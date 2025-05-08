import { baselineSentimentOverrides } from './baselineSentimentOverrides.js';

/**
 * sentimentConfig.js
 *
 * Enhanced sentiment configuration for the Fiscal Insights Simulator.
 * This file expands and refines public sentiment rules with realistic,
 * politically grounded reactions while preserving existing logic and structure.
 *
 * Sections:
 *   - provinces: All 13 provinces/territories with unique regional triggers
 *   - demographics: Original plus 7 new groups (techWorkers, smallBusinessOwners,
 *     newImmigrants, unionizedWorkers, renters, veterans, indigenousPeoples)
 *   - sectors: Original plus 7 new sectors (technology, finance, realEstate,
 *     creativeIndustries, manufacturing, veteransServices, publicSector)
 *
 * Sensitivity multipliers:
 *   MIN_MULTIPLIER: Lower thresholds for positive triggers
 *   MAX_MULTIPLIER: Higher limits for allowable negatives
 *   REACTIVITY_AMPLIFIER: Magnifies sentiment shifts from neutral
 */

export const MIN_MULTIPLIER = 0.2;          // Easier to hit positive thresholds
export const MAX_MULTIPLIER = 1.8;          // More flexible upper limits
export const REACTIVITY_AMPLIFIER = 12; // Moderately high sensitivity

function mergeWithBaseline(configSection, baselineSection) {
  const result = {};
  for (const [group, cfg] of Object.entries(configSection)) {
    const overrides = baselineSection?.[group] || {};
    result[group] = {
      ...cfg,
      baselineScore: overrides.baselineScore ?? 3.0,
      deficitSensitivity: overrides.deficitSensitivity ?? 0.0,
      debtRatioSensitivity: overrides.debtRatioSensitivity ?? 0.0
    };
  }
  return result;
}

export const sentimentConfig = {
  provinces: mergeWithBaseline({
    Ontario: {
      weight: 0.38, // Largest share—diverse, centrist-conservative tilt
      triggers: {
        // Economic competitiveness and business climate
        // Ontario's economy is heavily reliant on manufacturing, finance, and services. Voters are sensitive to business taxes that affect job creation and economic growth, especially in the Greater Toronto Area and Southern Ontario.
        "revenueMix.corporateTax":            { max: 13 * MAX_MULTIPLIER, score: 2 },   // Lower corporate tax rates are viewed positively for competitiveness and attracting investment (esp. in Toronto, Waterloo, auto sector).
        "budgetItems.economicDevelopment":    { min: 10 * MIN_MULTIPLIER, score: 2 },   // Direct investment in economic development is popular—seen as supporting innovation hubs, tech clusters, and job creation.
        "budgetItems.infrastructure":         { min: 20 * MIN_MULTIPLIER, score: 2 },   // Infrastructure spending (esp. transit, highways, broadband) is a major provincial priority, particularly in urban/suburban regions.

        // Moderate social supports
        // Ontario voters expect strong but not extravagant social programs. Social spending is valued, but there is a centrist skepticism of large expansions.
        "budgetItems.childrenAndFamilies":    { min: 18 * MIN_MULTIPLIER, score: 1 },   // Child/family benefits are important, but not as central as in QC or Atlantic Canada.
        "budgetItems.healthcare":             { min: 90 * MIN_MULTIPLIER, score: 1 },   // Universal healthcare is a core expectation, but voters are wary of inefficiency or overspending.

        // Education and skills
        // Education is a key issue, especially in urban/suburban ridings. Investment in public schools and universities is broadly popular.
        "budgetItems.education":              { min: 22 * MIN_MULTIPLIER, score: 1 },   // Public education funding is expected, especially for post-secondary access and skills training.

        // Fiscal responsibility
        // Ontario has a history of deficit aversion, especially among older and suburban voters. Fiscal prudence is a political necessity for most governments.
        "budgetItems.deficit":                { max: 0.04, score: -2 },                 // Deficits above 4% of budget are strongly disliked—seen as irresponsible.

        // Environmental action (but less than BC/QC)
        // Ontario supports environmental action, but the issue is less salient than in BC or Quebec. Urban voters are more supportive than rural.
        "budgetItems.environmentAndClimateChange": { min: 7 * MIN_MULTIPLIER, score: 1 }, // Modest climate action is expected, but not at the expense of jobs.

        // Carbon tax sensitivity
        // Moderate resistance to carbon taxes, especially in rural and suburban areas with car dependency. Urban voters are more supportive but less vocal.
        "revenueMix.carbonPricing":               { max: 0.9 * MAX_MULTIPLIER, score: 1 },  // Carbon tax above this level triggers negative sentiment, especially outside Toronto.

        // Housing affordability
        // Housing costs are a major political issue in the GTA and southern Ontario, with strong demand for affordability measures.
        "budgetItems.housing":                { min: 8 * MIN_MULTIPLIER, score: 2 },    // Policies to address housing crisis are widely popular in urban/suburban regions.

        // NEW: Urban/rural divide
        // Rural Ontarians are more sensitive to agricultural and infrastructure spending, and less supportive of carbon taxes.
        "budgetItems.agriculture":            { min: 5 * MIN_MULTIPLIER, score: 1 },    // Rural regions value agricultural support, especially in Eastern and Northern Ontario.
      }
    },
    Quebec: {
      weight: 0.23, // Social-democratic, culturally distinct
      triggers: {
        // Social programs and solidarity
        // Quebec has a strong tradition of social solidarity and universal programs, with high expectations for public investment in families, healthcare, and education.
        "budgetItems.childrenAndFamilies":      { min: 30 * MIN_MULTIPLIER, score: 5 }, // Universal childcare, generous family benefits, and parental leave are core priorities.
        "budgetItems.healthcare":               { min: 95 * MIN_MULTIPLIER, score: 2 }, // Public healthcare is highly valued, with additional emphasis on accessibility and French-language services.
        "budgetItems.education":                { min: 24 * MIN_MULTIPLIER, score: 2 }, // Education funding is important, especially for post-secondary access and CEGEP system.

        // Cultural identity
        // Protection and promotion of Quebec's distinct language and culture are major political imperatives.
        "budgetItems.culturalPrograms":         { min: 4  * MIN_MULTIPLIER, score: 4 }, // Funding for arts, heritage, and French-language media is strongly supported.

        // Environmental leadership
        // Quebec is a national leader on climate and green policy, with broad support for environmental spending.
        "budgetItems.environmentAndClimateChange": { min: 10 * MIN_MULTIPLIER, score: 4 }, // Ambitious climate action is expected, especially in urban areas.
        "revenueMix.carbonPricing":                 { min: 1.2 * MIN_MULTIPLIER, score: 3 }, // Carbon pricing is widely accepted, with less resistance than elsewhere.

        // Progressive tax mix
        // Voters are more accepting of higher taxes if they fund social programs and redistribution.
        "revenueMix.corporateTax":              { min: 15 * MIN_MULTIPLIER, score: 2 }, // Higher corporate tax rates are tolerated for social investment.

        // Deficit tolerance (slightly more tolerant than ON)
        // Quebecers are more tolerant of deficits if they support social priorities, but still expect eventual balance.
        "budgetItems.deficit":                  { max: 0.06, score: -1 }, // Deficits above 6% are a concern but less so than in ON/West.

        // NEW: Language and immigration
        // Immigration policy and French-language integration are highly salient in public debate.
        "budgetItems.immigration":              { min: 5 * MIN_MULTIPLIER, score: 2 }, // Funding for French-language integration and immigrant support is popular in urban QC.
      }
    },
    BritishColumbia: {
      weight: 0.14, // Green-leaning, urban-rural split
      triggers: {
        // Environmental leadership
        // BC is the most environmentally progressive province, with strong public support for climate action, green jobs, and carbon pricing (first in North America).
        "budgetItems.environmentAndClimateChange": { min: 12 * MIN_MULTIPLIER, score: 5 }, // Ambitious climate spending is expected, especially in Metro Vancouver and Victoria.
        "revenueMix.carbonPricing":                    { min: 1.4 * MIN_MULTIPLIER, score: 4 }, // Carbon tax leadership is a source of provincial pride.

        // Indigenous reconciliation
        // Reconciliation and Indigenous rights are high-salience issues, especially in the North and Interior.
        "budgetItems.indigenousServices":          { min: 12 * MIN_MULTIPLIER, score: 4 }, // Investment in Indigenous services is widely supported.

        // Urban issues: housing and transit
        // Housing affordability and transit expansion are top priorities in Greater Vancouver and Victoria.
        "budgetItems.housing":                     { min: 10 * MIN_MULTIPLIER, score: 4 }, // Urban housing crisis is a major political issue.
        "budgetItems.transit":                     { min: 10 * MIN_MULTIPLIER, score: 4 }, // Transit investment is popular in urban areas.

        // Economic development, but with green focus
        // Economic growth is expected to align with green priorities (clean tech, sustainable forestry, etc.).
        "budgetItems.economicDevelopment":         { min: 7 * MIN_MULTIPLIER, score: 2 }, // Green jobs and innovation are favored over traditional resource extraction.

        // Deficit aversion (moderate)
        // While supportive of public investment, BC voters are wary of persistent deficits.
        "budgetItems.deficit":                     { max: 0.05, score: -1 }, // Moderate concern about deficits, especially outside Lower Mainland.

        // NEW: Forestry and resource policy
        // Forestry, mining, and LNG policy are divisive issues, especially in the Interior and North.
        "budgetItems.naturalResources":            { min: 8 * MIN_MULTIPLIER, score: 2 }, // Support for sustainable resource development, but opposition to unchecked expansion.
      }
    },
    Alberta: {
      weight: 0.18, // Resource-driven, fiscally conservative, strong political influence
      triggers: {
        // Pro-business, low taxes
        // Alberta's political culture is strongly pro-business and anti-tax, especially regarding corporate and resource sectors.
        "revenueMix.corporateTax":         { max: 12 * MAX_MULTIPLIER, score: 3 }, // Lower corporate taxes are a political imperative for competitiveness and investment.
        "budgetItems.economicDevelopment": { min: 10 * MIN_MULTIPLIER, score: 3 }, // Economic development is strongly supported, especially for energy sector growth and diversification.
        "budgetItems.infrastructure":      { min: 15 * MIN_MULTIPLIER, score: 2 }, // Infrastructure (esp. highways, pipelines) is important for the resource economy.

        // Carbon pricing resistance
        // Alberta has strong opposition to carbon taxes due to economic impact on key industries (oil & gas, agriculture)
        // Similar to Saskatchewan, this is a major political issue in the province
        "revenueMix.carbonPricing": [
          { max: 0.01, score: 9 },  // Elimination of carbon tax causes a massive sentiment boost
          { max: 0.6 * MAX_MULTIPLIER, score: 2 }, // Low carbon tax is tolerated, but not favored
          { min: 2 * MIN_MULTIPLIER, score: -25 } // High carbon prices are EXTREMELY opposed and completely override all other effects
        ],

        // Oil & gas support
        // Direct support for oil, gas, and mining is a political necessity, especially in rural and northern Alberta.
        "budgetItems.naturalResources":    { min: 10 * MIN_MULTIPLIER, score: 2 }, // Investment in energy and resource extraction is expected.

        // Fiscal conservatism
        // Alberta voters are highly deficit-averse, with a political culture focused on balanced budgets and spending restraint.Yes please
        "budgetItems.deficit":             { max: 0.03, score: -3 }, // Deficits above 3% are viewed as fiscal chaos.

        // Moderate support for health/education
        // While health and education are valued, voters are skeptical of large expansions.
        "budgetItems.healthcare":          { min: 85 * MIN_MULTIPLIER, score: 1 }, // Basic support for healthcare, but less emphasis than in central/Atlantic Canada.
        "budgetItems.education":           { min: 18 * MIN_MULTIPLIER, score: 1 }, // Education is important, but not a top-tier issue.

        // NEW: Rural/urban divide
        // Rural Alberta is more supportive of agricultural subsidies and less supportive of climate spending.
        "budgetItems.agriculture":         { min: 8 * MIN_MULTIPLIER, score: 2 }, // Agricultural support is important in southern and central Alberta.
      }
    },
    Manitoba: {
      weight: 0.05, // Balanced, pragmatic
      triggers: {
        // Agriculture and rural priorities
        // Manitoba's economy is shaped by agriculture (grain, pork, canola) and rural communities. Flood mitigation and rural infrastructure are recurring political issues.
        "budgetItems.agriculture":         { min: 7 * MIN_MULTIPLIER, score: 3 }, // Farm supports and rural investment are highly valued, especially outside Winnipeg.
        "budgetItems.infrastructure":      { min: 10 * MIN_MULTIPLIER, score: 2 }, // Flood protection (Red River) and rural roads are perennial priorities.

        // Indigenous reconciliation
        // Manitoba has one of the largest Indigenous populations in Canada; reconciliation and Indigenous services are key public priorities.
        "budgetItems.indigenousServices":  { min: 10 * MIN_MULTIPLIER, score: 2 }, // Investment in Indigenous health, housing, and education is strongly supported.

        // Healthcare and education
        // Healthcare is a top concern, especially in rural/remote areas; education is valued for workforce retention.
        "budgetItems.healthcare":          { min: 90 * MIN_MULTIPLIER, score: 2 }, // Public healthcare is expected, with special attention to rural/remote access.
        "budgetItems.education":           { min: 20 * MIN_MULTIPLIER, score: 1 }, // Education funding is important for both urban and rural Manitobans.

        // Fiscal prudence, but less strict than AB/SK
        // Manitobans expect balanced budgets, but are more tolerant of deficits for critical investments than in Alberta/Saskatchewan.
        "budgetItems.deficit":             { max: 0.05, score: -1 }, // Moderate concern about deficits; flexibility for emergencies (e.g., floods).

        // NEW: Urban/rural divide
        // Winnipeg is more supportive of social programs and housing, while rural areas focus on agriculture and infrastructure.
        "budgetItems.housing":             { min: 7 * MIN_MULTIPLIER, score: 1 }, // Urban voters prioritize affordable housing and homelessness prevention.
      }
    },
    Saskatchewan: {
      weight: 0.03, // Resource/agriculture, conservative
      triggers: {
        // Agriculture and resources
        // Saskatchewan's political identity is rooted in agriculture (grain, cattle) and resource extraction (potash, oil, uranium).
        "budgetItems.agriculture":         { min: 8 * MIN_MULTIPLIER, score: 7 }, // Farm supports and rural investment are top priorities.
        "budgetItems.economicDevelopment": { min: 7 * MIN_MULTIPLIER, score: 3 }, // Economic development is expected to focus on rural/agri-business and resource value chains.
        "budgetItems.infrastructure":      { min: 10 * MIN_MULTIPLIER, score: 3 }, // Infrastructure spending (roads, rail) is especially valued in rural communities.

        // Carbon tax resistance
        // Strong opposition to carbon taxes, especially among farmers and resource workers.
        "revenueMix.carbonPricing": [
          { max: 0.05, score: 3 }, // Elimination or near-zero is popular (increased tolerance from 0.01 to 0.05)
          { max: 0.6 * MAX_MULTIPLIER, score: 2 }, // Low carbon tax is tolerated, but not favored
          {
            min: 2 * MIN_MULTIPLIER,
            score: -5, // Strong penalty, but not overwhelming
            precedence: "absolute", // This will trigger override logic
            severity: "extreme" // Optional, for clarity and future use
          }
        ],

        // Fiscal conservatism
        // Deficit aversion is strong, but not as intense as in Alberta.
        "budgetItems.deficit":             { max: 0.03, score: -2 }, // Persistent deficits are unpopular.

        // Pro-business
        // Low corporate taxes are favored to support agri-business and resource investment.
        "revenueMix.corporateTax":         { max: 13 * MAX_MULTIPLIER, score: 5 },

        // NEW: Rural/urban divide
        // Urban Saskatoon/Regina are more supportive of healthcare/education than rural regions.
        "budgetItems.healthcare":          { min: 90 * MIN_MULTIPLIER, score: 1 }, // Urban voters expect strong healthcare; rural voters prioritize access.
        "budgetItems.education":           { min: 17 * MIN_MULTIPLIER, score: 1 }, // Education is valued, especially for rural retention.
      }
    },
    NovaScotia: {
      weight: 0.03, // Aging, coastal, moderate
      triggers: {
        // Healthcare and seniors
        // Nova Scotia has one of the oldest populations in Canada; healthcare and seniors' services are top political issues.
        "budgetItems.healthcare":          { min: 110 * MIN_MULTIPLIER, score: 4 }, // Public healthcare is critical, with strong demand for rural/remote access and hospital upgrades.
        "budgetItems.supportForSeniors":   { min: 80 * MIN_MULTIPLIER, score: 4 }, // Seniors' supports (long-term care, home care) are highly valued.

        // Fisheries and rural
        // The fisheries sector is central to the coastal economy and identity, especially outside Halifax.
        "budgetItems.fisheries":           { min: 3 * MIN_MULTIPLIER, score: 3 }, // Fisheries policy is a major issue in rural/coastal communities.
        "budgetItems.infrastructure":      { min: 7 * MIN_MULTIPLIER, score: 2 }, // Rural roads, ports, and broadband are high priorities.

        // Deficit moderate concern
        // Nova Scotians are moderately deficit-averse, but more flexible than the West.
        "budgetItems.deficit":             { max: 0.06, score: -1 }, // Moderate concern about fiscal discipline.

        // NEW: Urban/rural divide
        // Halifax is more supportive of housing, transit, and social spending than rural/coastal areas.
        "budgetItems.housing":             { min: 6 * MIN_MULTIPLIER, score: 1 }, // Urban voters prioritize affordable housing and homelessness prevention.
      }
    },
    NewBrunswick: {
      weight: 0.02, // Rural, aging, pragmatic
      triggers: {
        // Healthcare and seniors
        // New Brunswick is one of the most rural and oldest provinces; healthcare and seniors' services are top priorities.
        "budgetItems.healthcare":          { min: 105 * MIN_MULTIPLIER, score: 4 }, // Rural hospital access and wait times are major issues.
        "budgetItems.supportForSeniors":   { min: 80 * MIN_MULTIPLIER, score: 4 }, // Seniors' supports (long-term care, home care) are highly valued.

        // Fisheries and jobs
        // Fisheries and resource jobs are vital in coastal/rural areas; economic development is needed to combat outmigration.
        "budgetItems.fisheries":           { min: 2 * MIN_MULTIPLIER, score: 3 }, // Fisheries are central to the Acadian and rural economy.
        "budgetItems.economicDevelopment": { min: 6 * MIN_MULTIPLIER, score: 2 }, // Job creation and regional development are priorities.

        // Deficit moderate concern
        // New Brunswickers are moderately deficit-averse, but support investment for growth.
        "budgetItems.deficit":             { max: 0.06, score: -1 }, // Moderate concern about fiscal discipline.

        // NEW: Bilingualism and language
        // French-English bilingualism is a key political and social issue.
        "budgetItems.culturalPrograms":    { min: 2 * MIN_MULTIPLIER, score: 1 }, // Support for French/Acadian culture and language is important in many communities.
      }
    },
    Nunavut: {
      weight: 0.005, // Remote, Indigenous, northern
      triggers: {
        // Indigenous services and autonomy
        // Nunavut has a majority Inuit population; self-government, language, and Indigenous services are central to public priorities.
        "budgetItems.indigenousServices":   { min: 25 * MIN_MULTIPLIER, score: 5 }, // Inuit-led services, language, and cultural programs are top priorities.

        // Remote infrastructure and housing
        // Infrastructure and housing are critical due to remoteness, harsh climate, and overcrowding.
        "budgetItems.infrastructure":       { min: 15 * MIN_MULTIPLIER, score: 3 }, // Airstrips, roads, and broadband are essential for community access.
        "budgetItems.housing":              { min: 10 * MIN_MULTIPLIER, score: 3 }, // Housing crisis and overcrowding are persistent issues.

        // Healthcare and education
        // Access to healthcare and culturally relevant education are major concerns.
        "budgetItems.healthcare":           { min: 90 * MIN_MULTIPLIER, score: 4 }, // Remote health services are critical.
        "budgetItems.education":            { min: 20 * MIN_MULTIPLIER, score: 3 }, // Inuit language and culturally relevant education are priorities.

        // Arctic sovereignty
        // Defense and sovereignty are salient due to geopolitical and climate change concerns.
        "budgetItems.defense":              { min: 20 * MIN_MULTIPLIER, score: 2 }, // Arctic presence and sovereignty are supported.
      }
    },
    "Prince Edward Island": {
      weight: 0.01, // Small, rural, agri/fisheries
      triggers: {
        // Agriculture and fisheries
        // PEI's economy is dominated by agriculture (potatoes, dairy) and fisheries (lobster, shellfish).
        "budgetItems.agriculture":         { min: 5 * MIN_MULTIPLIER, score: 3 }, // Farm supports are critical to the rural economy.
        "budgetItems.fisheries":           { min: 2 * MIN_MULTIPLIER, score: 3 }, // Fisheries policy is central to rural/coastal communities.
        "budgetItems.tourism":             { min: 2 * MIN_MULTIPLIER, score: 2 }, // Tourism is a major employer and source of revenue.

        // Healthcare
        // Access to healthcare is a top concern, especially given rural/remote challenges.
        "budgetItems.healthcare":          { min: 90 * MIN_MULTIPLIER, score: 2 }, // Rural hospital access and wait times are key issues.

        // Deficit less concern
        // PEI is the least deficit-averse province, prioritizing economic stability and rural investment.
        "budgetItems.deficit":             { max: 0.07, score: -1 }, // Deficits are tolerated if they support local priorities.

        // NEW: Rural infrastructure
        // Road, bridge, and ferry infrastructure is a perennial issue for islanders.
        "budgetItems.infrastructure":      { min: 3 * MIN_MULTIPLIER, score: 1 }, // Upgrades to rural infrastructure are widely supported.
      }
    },
    "Newfoundland and Labrador": {
      weight: 0.02, // Coastal, resource, rural
      triggers: {
        // Fisheries and rural
        // NL's economy and identity are closely tied to fisheries, rural communities, and resource extraction (oil, minerals).
        "budgetItems.fisheries":           { min: 3 * MIN_MULTIPLIER, score: 4 }, // Fisheries policy is a top issue, especially in outports.
        "budgetItems.infrastructure":      { min: 8 * MIN_MULTIPLIER, score: 2 }, // Rural and coastal infrastructure (roads, ferries) are critical for access and economic activity.

        // Healthcare and seniors
        // Access to healthcare and seniors' supports are major concerns, especially in remote communities.
        "budgetItems.healthcare":          { min: 100 * MIN_MULTIPLIER, score: 3 }, // Hospital access and wait times are key issues.
        "budgetItems.supportForSeniors":   { min: 75 * MIN_MULTIPLIER, score: 2 }, // Seniors' supports are increasingly important with an aging population.

        // Deficit less concern
        // NL is relatively tolerant of deficits, given its fiscal challenges and need for federal transfers.
        "budgetItems.deficit":             { max: 0.08, score: -1 }, // Deficits are tolerated if they support local priorities.

        // Resource development
        // Oil, gas, and mining are major economic drivers; support for these sectors is strong.
        "budgetItems.naturalResources":    { min: 8 * MIN_MULTIPLIER, score: 3 }, // Resource investment is expected.

        // NEW: Outmigration and population
        // Policies to address outmigration and population decline are increasingly salient.
        "budgetItems.childrenAndFamilies": { min: 7 * MIN_MULTIPLIER, score: 1 }, // Family benefits and youth retention policies are valued.
      }
    },
    "Northwest Territories": {
      weight: 0.005, // Remote, Indigenous, resource
      triggers: {
        // Indigenous services
        // The NWT has a large Indigenous population; services, language, and reconciliation are top priorities.
        "budgetItems.indigenousServices":   { min: 18 * MIN_MULTIPLIER, score: 4 }, // Indigenous-led services and language programs are highly supported.

        // Infrastructure and housing
        // Remoteness, climate, and high costs make infrastructure and housing critical issues.
        "budgetItems.infrastructure":       { min: 12 * MIN_MULTIPLIER, score: 3 }, // Roads, airstrips, and broadband are essential.
        "budgetItems.housing":              { min: 7 * MIN_MULTIPLIER, score: 2 }, // Overcrowding and housing shortages are persistent.

        // Healthcare and education
        // Access to healthcare and culturally relevant education are major concerns.
        "budgetItems.healthcare":           { min: 80 * MIN_MULTIPLIER, score: 3 }, // Remote health services are critical.

        // Arctic sovereignty
        // Defense and sovereignty are salient due to geopolitical and climate change concerns.
        "budgetItems.defense":              { min: 18 * MIN_MULTIPLIER, score: 2 }, // Arctic presence and sovereignty are supported.

        // Resource development
        // Mining and resource extraction are major economic drivers.
        "budgetItems.naturalResources":     { min: 7 * MIN_MULTIPLIER, score: 3 }, // Resource investment is expected, but with environmental safeguards.
      }
    },
    Yukon: {
      weight: 0.005, // Remote, Indigenous, environmental
      triggers: {
        // Indigenous reconciliation
        // Yukon has a large Indigenous population; reconciliation and land claims are major public priorities.
        "budgetItems.indigenousServices":   { min: 15 * MIN_MULTIPLIER, score: 4 }, // Indigenous-led services, language, and land claims are widely supported.

        // Infrastructure and housing
        // Remoteness and climate make infrastructure and housing critical issues.
        "budgetItems.infrastructure":       { min: 12 * MIN_MULTIPLIER, score: 3 }, // Roads, airstrips, and broadband are essential.

        // Healthcare
        // Access to healthcare is a top concern, especially for remote communities.
        "budgetItems.healthcare":           { min: 85 * MIN_MULTIPLIER, score: 3 }, // Rural and remote health services are critical.

        // Environment and climate
        // Yukon is highly sensitive to climate change and environmental protection.
        "budgetItems.environmentAndClimateChange": { min: 8 * MIN_MULTIPLIER, score: 4 }, // Climate adaptation and environmental protection are top issues.

        // Tourism
        // Tourism is a major economic driver, especially in Whitehorse and Dawson.
        "budgetItems.tourism":              { min: 3 * MIN_MULTIPLIER, score: 2 }, // Investment in tourism infrastructure is widely supported.

        // NEW: Mining and resource development
        // Mining is a major economic sector, but with environmental concerns.
        "budgetItems.naturalResources":     { min: 5 * MIN_MULTIPLIER, score: 1 }, // Resource investment is expected, but with strong environmental regulation.
      }
    }
  }, baselineSentimentOverrides.provinces),

  demographics: mergeWithBaseline({
    youth: {
      weight: 0.15, // Young Canadians (18-30)
      triggers: {
        // Education and skills development
        // Youth place high value on affordable, accessible post-secondary education and job training, especially in a changing job market.
        "budgetItems.education":                { min: 25 * MIN_MULTIPLIER, score: 5 },  // Major increases to post-secondary funding are extremely popular.
        "budgetItems.skillsDevelopment":        { min: 8 * MIN_MULTIPLIER, score: 4 },   // Job training and upskilling programs are highly valued.

        // Climate and environment
        // Climate change is a defining issue for Canadian youth, with strong support for ambitious climate action.
        "budgetItems.environmentAndClimateChange": { min: 12 * MIN_MULTIPLIER, score: 4 }, // Youth expect serious government action on climate change and green jobs.
        "revenueMix.carbonPricing":                 { min: 1.5 * MIN_MULTIPLIER, score: 3 },  // Carbon pricing is viewed favorably as a tool for climate policy.

        // Housing affordability
        // Housing costs are a major barrier for young Canadians, especially in urban centers.
        "budgetItems.housing":                  { min: 15 * MIN_MULTIPLIER, score: 5 },  // Rental support and first-time buyer policies are extremely popular.

        // Digital economy
        // Youth are digital natives and expect government services to be accessible online.
        "budgetItems.digitalGovernment":        { min: 5 * MIN_MULTIPLIER, score: 3 },   // Investment in digital services and broadband access is highly valued.

        // Economic inequality
        // Youth support policies to address inequality and wealth concentration.
        "revenueMix.wealthTax":                 { min: 0.5 * MIN_MULTIPLIER, score: 3 },  // Wealth redistribution is popular among young voters.

        // Student debt
        // Student debt is a significant burden for many young Canadians.
        "budgetItems.loansInvestments.studentLoans": { min: 5 * MIN_MULTIPLIER, score: 4 }, // Student debt relief is a top priority.

        // NEW: Mental health
        // Mental health is a growing concern for youth, especially post-pandemic.
        "budgetItems.mentalHealth":             { min: 7 * MIN_MULTIPLIER, score: 4 }, // Funding for youth mental health services is highly popular.
      }
    },
    seniors: {
      weight: 0.20, // Older Canadians (65+)
      triggers: {
        // Retirement security
        // Seniors prioritize stable, generous retirement income (OAS, GIS, CPP) and pension protection.
        "budgetItems.supportForSeniors":        { min: 85 * MIN_MULTIPLIER, score: 5 }, // Pensions and income supports are top priorities.

        // Healthcare
        // Healthcare access, especially for chronic and long-term care, is a defining issue for seniors.
        "budgetItems.healthcare":               { min: 110 * MIN_MULTIPLIER, score: 5 }, // Hospital, home care, and long-term care funding is highly valued.
        "budgetItems.mentalHealth":             { min: 10 * MIN_MULTIPLIER, score: 3 },  // Mental health services for seniors are increasingly important.

        // Tax relief
        // Seniors are sensitive to income tax changes and value targeted tax credits.
        "revenueMix.personalIncomeTaxCap":      { max: 20 * MAX_MULTIPLIER, score: 4 },  // Tax caps for retirees are popular.
        "taxExpenditures.personalTaxCredits":   { min: 15 * MIN_MULTIPLIER, score: 4 },  // Senior-specific tax credits are highly valued.

        // Housing and mobility
        // Affordable, accessible housing and transit are major concerns for aging in place.
        "budgetItems.housing":                  { min: 8 * MIN_MULTIPLIER, score: 4 },   // Senior housing and retrofits are popular.
        "budgetItems.transit":                  { min: 8 * MIN_MULTIPLIER, score: 3 },   // Mobility/accessibility investments are valued.

        // Deficit concern
        // Seniors are typically deficit-averse, prioritizing fiscal stability and intergenerational fairness.
        "budgetItems.deficit":                  { max: 0.04, score: -2 }, // High deficits are viewed negatively.

        // NEW: Elder abuse prevention
        // Protection from elder abuse is a growing policy focus.
        "budgetItems.socialServices.elderAbuse": { min: 2 * MIN_MULTIPLIER, score: 3 }, // Funding for elder abuse prevention is valued.
      }
    },
    families: {
      weight: 0.25, // Canadian families with children
      triggers: {
        // Family benefits
        "budgetItems.childrenAndFamilies":      { min: 30 * MIN_MULTIPLIER, score: 5 },  // CCB/family benefits
        // Healthcare and education
        "budgetItems.healthcare":               { min: 105 * MIN_MULTIPLIER, score: 4 }, // family health
        "budgetItems.education":                { min: 25 * MIN_MULTIPLIER, score: 4 },  // quality education
        // Tax relief
        "taxExpenditures.personalTaxCreditsIncrease": { min: 10 * MIN_MULTIPLIER, score: 4 }, // family credits
        // Housing and transit
        "budgetItems.housing":                  { min: 10 * MIN_MULTIPLIER, score: 5 },  // family housing
        "budgetItems.transit":                  { min: 7 * MIN_MULTIPLIER, score: 3 },   // commuting
        // Childcare
        "budgetItems.childcare":                { min: 15 * MIN_MULTIPLIER, score: 5 }   // affordable childcare
      }
    },
    workers: {
      weight: 0.25, // Working Canadians
      triggers: {
        // Jobs and economic growth
        "budgetItems.infrastructure":           { min: 15 * MIN_MULTIPLIER, score: 4 },  // job creation
        "budgetItems.economicDevelopment":      { min: 8 * MIN_MULTIPLIER, score: 4 },   // economic growth
        // Income and taxation
        "revenueMix.personalIncomeTaxCap":      { max: 20 * MAX_MULTIPLIER, score: 4 },  // take-home pay
        // EI premiums - both positive if low and negative if high
        "revenueMix.eiPremiums": [
          { max: 1.3 * MAX_MULTIPLIER, score: 4 },  // positive if low
          { min: 2.0 * MIN_MULTIPLIER, score: -4 } // negative if too high
        ],
        // Skills and innovation
        "budgetItems.scienceAndInnovation":     { min: 6 * MIN_MULTIPLIER, score: 3 },   // future jobs
        "budgetItems.skillsDevelopment":        { min: 7 * MIN_MULTIPLIER, score: 4 },   // training
        // Transit and housing
        "budgetItems.transit":                  { min: 8 * MIN_MULTIPLIER, score: 3 },   // commuting
        "budgetItems.housing":                  { min: 8 * MIN_MULTIPLIER, score: 4 }    // affordable housing
      }
    },
    students: {
      weight: 0.10, // Post-secondary students
      triggers: {
        // Education funding and research
        "budgetItems.education":                { min: 30 * MIN_MULTIPLIER, score: 5 },  // education funding
        "budgetItems.scienceAndInnovation":     { min: 8 * MIN_MULTIPLIER, score: 4 },  // research opportunities
        // Financial support
        "taxExpenditures.studentTaxCredits":    { min: 15 * MIN_MULTIPLIER, score: 5 },  // tax credits
        "budgetItems.loansInvestments.studentLoans": { min: 5 * MIN_MULTIPLIER, score: 5 }, // loan forgiveness
        // Housing and cost of living
        "budgetItems.housing":                  { min: 8 * MIN_MULTIPLIER, score: 5 },  // student housing
        // Digital access
        "budgetItems.digitalGovernment":        { min: 5 * MIN_MULTIPLIER, score: 3 },  // digital infrastructure
        // Transit
        "budgetItems.transit":                  { min: 8 * MIN_MULTIPLIER, score: 4 },  // affordable transit
        // Mental health
        "budgetItems.mentalHealth":             { min: 6 * MIN_MULTIPLIER, score: 4 }   // student mental health
      }
    },
    urban: {
      weight: 0.65, // Urban Canadians
      triggers: {
        // Transit and infrastructure
        "budgetItems.transit":                  { min: 12 * MIN_MULTIPLIER, score: 5 }, // public transit
        "budgetItems.infrastructure":           { min: 15 * MIN_MULTIPLIER, score: 4 }, // urban infrastructure
        // Housing affordability
        "budgetItems.housing":                  { min: 12 * MIN_MULTIPLIER, score: 5 }, // housing crisis
        // Environment and climate
        "budgetItems.environmentAndClimateChange": { min: 10 * MIN_MULTIPLIER, score: 4 }, // air quality
        "revenueMix.carbonPricing":                 { min: 1.2 * MIN_MULTIPLIER, score: 3 }, // carbon pricing
        // Digital services
        "budgetItems.digitalGovernment":        { min: 5 * MIN_MULTIPLIER, score: 4 },  // smart cities
        // Immigration and diversity
        "budgetItems.immigration":              { min: 6 * MIN_MULTIPLIER, score: 3 },  // settlement services
        // Public safety
        "budgetItems.publicSafety":             { min: 10 * MIN_MULTIPLIER, score: 3 }  // urban safety
      }
    },
    rural: {
      weight: 0.35, // Rural Canadians
      triggers: {
        // Agriculture and natural resources
        "budgetItems.agriculture":              { min: 8 * MIN_MULTIPLIER, score: 5 },  // farming support
        "budgetItems.naturalResources":         { min: 7 * MIN_MULTIPLIER, score: 4 },  // resource development
        // Infrastructure and connectivity
        "budgetItems.infrastructure":           { min: 15 * MIN_MULTIPLIER, score: 5 }, // rural roads/bridges
        "budgetItems.digitalGovernment":        { min: 6 * MIN_MULTIPLIER, score: 5 },  // rural internet
        // Carbon tax sensitivity
        "revenueMix.carbonPricing": [
          { max: 0.7 * MAX_MULTIPLIER, score: 4 }, // fuel dependency
          { max: 0.01, score: 2 } // eliminated = positive
        ],
        // Healthcare and services
        "budgetItems.healthcare":               { min: 100 * MIN_MULTIPLIER, score: 5 }, // rural healthcare
        // Economic development
        "budgetItems.economicDevelopment":      { min: 8 * MIN_MULTIPLIER, score: 4 }   // rural jobs
      }
    },
    indigenousPeoples: {
      weight: 0.05, // First Nations, Métis, and Inuit
      triggers: {
        // Self-determination and services
        "budgetItems.indigenousServices":       { min: 18 * MIN_MULTIPLIER, score: 5 }, // essential services
        "budgetItems.indigenousOperations":     { min: 12 * MIN_MULTIPLIER, score: 5 }, // self-governance
        // Housing and infrastructure
        "budgetItems.housing":                  { min: 10 * MIN_MULTIPLIER, score: 5 }, // housing crisis
        "budgetItems.infrastructure":           { min: 12 * MIN_MULTIPLIER, score: 4 }, // community infrastructure
        // Health and education
        "budgetItems.healthcare":               { min: 100 * MIN_MULTIPLIER, score: 5 }, // health equity
        "budgetItems.education":                { min: 25 * MIN_MULTIPLIER, score: 5 },  // education equity
        // Environment and land
        "budgetItems.environmentAndClimateChange": { min: 10 * MIN_MULTIPLIER, score: 4 }, // land stewardship
        // Economic reconciliation
        "budgetItems.economicDevelopment":      { min: 8 * MIN_MULTIPLIER, score: 4 }    // economic opportunities
      }
    },
    techWorkers: {
      weight: 0.08, // Tech sector workers
      triggers: {
        // Innovation and research
        "budgetItems.scienceAndInnovation":     { min: 10 * MIN_MULTIPLIER, score: 5 }, // R&D funding
        "budgetItems.digitalGovernment":        { min: 6 * MIN_MULTIPLIER, score: 4 },  // digital transformation
        // Skills and education
        "budgetItems.skillsDevelopment":        { min: 8 * MIN_MULTIPLIER, score: 4 },  // tech training
        "budgetItems.education":                { min: 15 * MIN_MULTIPLIER, score: 3 }, // STEM education
        // Business environment
        "revenueMix.corporateTax":              { max: 15 * MAX_MULTIPLIER, score: 4 }, // competitive tax
        "taxExpenditures.corporateTaxExpenditures.adjustmentPercent": { min: 12 * MIN_MULTIPLIER, score: 4 }, // startup incentives
        // Infrastructure
        "budgetItems.cybersecurity":            { min: 5 * MIN_MULTIPLIER, score: 5 },  // digital security
        "budgetItems.housing":                  { min: 12 * MIN_MULTIPLIER, score: 5 }, // tech hub housing
        // Immigration
        "budgetItems.immigration":              { min: 5 * MIN_MULTIPLIER, score: 4 }   // talent attraction
      }
    },
    smallBusinessOwners: {
      weight: 0.10, // Small and medium business owners
      triggers: {
        // Tax environment
        "revenueMix.corporateTax":              { max: 12 * MAX_MULTIPLIER, score: 5 }, // small business tax
        "taxExpenditures.corporateTaxExpenditures.adjustmentPercent": { min: 15 * MIN_MULTIPLIER, score: 5 }, // tax credits
        // Payroll taxes
        "revenueMix.eiPremiums": [
          { max: 1.2 * MAX_MULTIPLIER, score: 4 }, // lower EI costs
          { min: 1.8 * MIN_MULTIPLIER, score: -3 } // negative if too high
        ],
        // Business development
        "budgetItems.economicDevelopment":      { min: 8 * MIN_MULTIPLIER, score: 5 },  // SME programs
        // Regulatory environment
        "budgetItems.digitalGovernment":        { min: 5 * MIN_MULTIPLIER, score: 4 },  // red tape reduction
        // Infrastructure
        "budgetItems.infrastructure":           { min: 10 * MIN_MULTIPLIER, score: 4 }, // local infrastructure
        // Access to capital
        "budgetItems.loansInvestments.businessLoans": { min: 5 * MIN_MULTIPLIER, score: 5 } // financing
      }
    },
    newImmigrants: {
      weight: 0.07, // Recent immigrants to Canada
      triggers: {
        // Settlement services
        "budgetItems.immigration":              { min: 6 * MIN_MULTIPLIER, score: 5 },  // settlement programs
        "budgetItems.skillsDevelopment":        { min: 8 * MIN_MULTIPLIER, score: 5 },  // credential recognition
        // Housing and basic needs
        "budgetItems.housing":                  { min: 12 * MIN_MULTIPLIER, score: 5 }, // affordable housing
        // Health and family
        "budgetItems.healthcare":               { min: 95 * MIN_MULTIPLIER, score: 5 }, // healthcare access
        "budgetItems.childrenAndFamilies":      { min: 25 * MIN_MULTIPLIER, score: 4 }, // family support
        // Education and language
        "budgetItems.education":                { min: 20 * MIN_MULTIPLIER, score: 4 }, // language training
        // Employment
        "budgetItems.economicDevelopment":      { min: 6 * MIN_MULTIPLIER, score: 4 },  // job opportunities
        // Anti-discrimination
        "budgetItems.publicSafety":             { min: 8 * MIN_MULTIPLIER, score: 3 }   // community safety
      }
    },
    unionizedWorkers: {
      weight: 0.12, // Union members
      triggers: {
        // Labor rights and protections
        "budgetItems.laborPrograms":            { min: 5 * MIN_MULTIPLIER, score: 5 },  // labor rights
        "budgetItems.publicSafety":             { min: 12 * MIN_MULTIPLIER, score: 4 }, // workplace safety
        // Jobs and infrastructure
        "budgetItems.infrastructure":           { min: 18 * MIN_MULTIPLIER, score: 5 }, // job creation
        "budgetItems.manufacturing":            { min: 10 * MIN_MULTIPLIER, score: 5 }, // industrial policy
        // Progressive taxation
        "revenueMix.corporateTax":              { min: 16 * MIN_MULTIPLIER, score: 4 }, // corporate tax fairness
        "revenueMix.wealthTax":                 { min: 0.5 * MIN_MULTIPLIER, score: 3 }, // wealth inequality
        // Skills and training
        "budgetItems.skillsDevelopment":        { min: 7 * MIN_MULTIPLIER, score: 4 },  // worker training
        // EI premiums - both positive if low and negative if high
        "revenueMix.eiPremiums": [
          { max: 1.3 * MAX_MULTIPLIER, score: 3 }, // positive if low
          { min: 1.8 * MIN_MULTIPLIER, score: -3 } // negative if too high
        ],
      }
    },
    renters: {
      weight: 0.15, // Canadians who rent their homes
      triggers: {
        // Housing affordability
        "budgetItems.housing":                  { min: 15 * MIN_MULTIPLIER, score: 5 }, // rental support
        "taxExpenditures.renterTaxCredits.adjustmentPercent": { min: 12 * MIN_MULTIPLIER, score: 5 }, // renter credits
        // Urban amenities
        "budgetItems.infrastructure":           { min: 12 * MIN_MULTIPLIER, score: 4 }, // community amenities
        "budgetItems.transit":                  { min: 10 * MIN_MULTIPLIER, score: 5 }, // public transit
        // Economic inequality
        "revenueMix.wealthTax":                 { min: 0.6 * MIN_MULTIPLIER, score: 4 }, // wealth redistribution
        // Family support
        "budgetItems.childrenAndFamilies":      { min: 22 * MIN_MULTIPLIER, score: 4 }, // family benefits
        // Rent control and tenant rights
        "budgetItems.publicSafety":             { min: 6 * MIN_MULTIPLIER, score: 3 },  // tenant protections
        // Housing supply
        "budgetItems.economicDevelopment":      { min: 6 * MIN_MULTIPLIER, score: 3 }   // housing development
      }
    },
    veterans: {
      weight: 0.05, // Canadian veterans
      triggers: {
        // Veterans services
        "budgetItems.veteransAffairs":          { min: 8 * MIN_MULTIPLIER, score: 5 },  // veterans programs
        "budgetItems.mentalHealth":             { min: 6 * MIN_MULTIPLIER, score: 5 },  // PTSD/mental health
        // Healthcare
        "budgetItems.healthcare":               { min: 100 * MIN_MULTIPLIER, score: 5 }, // healthcare access
        // Housing and support
        "budgetItems.housing":                  { min: 8 * MIN_MULTIPLIER, score: 4 },  // veterans housing
        "budgetItems.supportForSeniors":        { min: 70 * MIN_MULTIPLIER, score: 4 }, // aging veterans
        // Military and defense
        "budgetItems.defense":                  { min: 25 * MIN_MULTIPLIER, score: 4 }, // military support
        // Transition support
        "budgetItems.skillsDevelopment":        { min: 6 * MIN_MULTIPLIER, score: 4 },  // civilian transition
        // Recognition
        "taxExpenditures.personalTaxCredits":   { min: 10 * MIN_MULTIPLIER, score: 4 }  // veterans tax credits
      }
    }
  }, baselineSentimentOverrides.demographics),

  sectors: mergeWithBaseline({
    business: {
      weight: 0.30, // Business sector overall
      triggers: {
        // Tax competitiveness
        "revenueMix.corporateTax": [
          { max: 13 * MAX_MULTIPLIER, score: 5 }, // competitive corporate tax
          { min: 20 * MIN_MULTIPLIER, score: -4 } // negative if too high
        ],
        // Tax incentives and credits
        "budgetItems.skillsDevelopment": { min: 7 * MIN_MULTIPLIER, score: 3 }, // workforce development
        // Fiscal responsibility
        "budgetItems.deficit": { max: 0.04, score: -3 } // deficit aversion
      }
    },
    environment: {
      weight: 0.15, // Environmental organizations and advocates
      triggers: {
        // Climate action
        "budgetItems.environmentAndClimateChange": { min: 15 * MIN_MULTIPLIER, score: 5 }, // climate programs
        "revenueMix.carbonPricing": [
          { min: 1.5 * MIN_MULTIPLIER, score: 5 }, // carbon pricing support
          { max: 0.01, score: -5 } // strong negative if eliminated
        ],
        // Sustainable transportation
        "budgetItems.transit": { min: 12 * MIN_MULTIPLIER, score: 4 }, // public transit
        // Green infrastructure
        "budgetItems.infrastructure": { min: 12 * MIN_MULTIPLIER, score: 4 }, // green infrastructure
        // Clean technology
        "budgetItems.scienceAndInnovation": { min: 8 * MIN_MULTIPLIER, score: 4 }, // clean tech research
        // Indigenous partnerships
        "budgetItems.indigenousServices": { min: 10 * MIN_MULTIPLIER, score: 4 }, // indigenous stewardship
        // Conservation
        "budgetItems.naturalResources": { min: 8 * MIN_MULTIPLIER, score: 3 }, // conservation programs
        // Regulatory enforcement
        "budgetItems.publicSafety": { min: 6 * MIN_MULTIPLIER, score: 3 } // environmental enforcement
      }
    },
    healthcare: {
      weight: 0.20, // Healthcare stakeholders
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "budgetItems.healthcare": { min: 110 * MIN_MULTIPLIER, score: 5 },                     // 22 required - healthcare funding
        "budgetItems.scienceAndInnovation": { min: 6 * MIN_MULTIPLIER, score: 4 },             // 1.2 required - medical research
        "taxExpenditures.healthTaxCredits": { min: 10 * MIN_MULTIPLIER, score: 3 },  // 2 required - health tax credits
        "budgetItems.supportForSeniors": { min: 70 * MIN_MULTIPLIER, score: 4 },               // 14 required - senior care
        "budgetItems.childrenAndFamilies": { min: 25 * MIN_MULTIPLIER, score: 4 },             // 5 required - family health
        "budgetItems.digitalGovernment": { min: 4 * MIN_MULTIPLIER, score: 4 }                 // 0.8 required - health records
      }
    },
    defense: {
      weight: 0.10, // Defense and security sector
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "budgetItems.defense": { min: 30 * MIN_MULTIPLIER, score: 5 },                          // 6 required - military funding
        "budgetItems.diplomaticRepresentation": { min: 8 * MIN_MULTIPLIER, score: 4 },          // 1.6 required - international presence
        "budgetItems.internationalDevelopment": { min: 7 * MIN_MULTIPLIER, score: 3 },          // 1.4 required - global stability
        "budgetItems.cybersecurity": { min: 4 * MIN_MULTIPLIER, score: 5 },                     // 0.8 required - digital defense
        "budgetItems.publicSafety": { min: 15 * MIN_MULTIPLIER, score: 4 },                    // 3 required - domestic security
        "budgetItems.borderSecurity": { min: 10 * MIN_MULTIPLIER, score: 5 }                   // 2 required - border protection
      }
    },
    education: {
      weight: 0.10, // Education sector
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "budgetItems.education": { min: 30 * MIN_MULTIPLIER, score: 5 },                       // 6 required - education funding
        "budgetItems.skillsDevelopment": { min: 5 * MIN_MULTIPLIER, score: 4 },                // 1 required - workforce training
        "budgetItems.childrenAndFamilies": { min: 25 * MIN_MULTIPLIER, score: 4 },             // 5 required - early childhood education
        "budgetItems.scienceAndInnovation": { min: 6 * MIN_MULTIPLIER, score: 4 },             // 1.2 required - research funding
        "budgetItems.digitalGovernment": { min: 4 * MIN_MULTIPLIER, score: 4 },                // 0.8 required - digital learning
        "budgetItems.loansInvestments.studentLoans": { min: 3 * MIN_MULTIPLIER, score: 5 }     // 0.6 required - education access
      }
    },
    energy: {
      weight: 0.10, // Energy sector
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "budgetItems.environmentAndClimateChange": { min: 8 * MIN_MULTIPLIER, score: 4 },      // 1.6 required - clean energy transition
        "budgetItems.economicDevelopment": { min: 8 * MIN_MULTIPLIER, score: 4 },              // 1.6 required - energy infrastructure
        "revenueMix.carbonPricing": { max: 0.7 * MAX_MULTIPLIER, score: 4 },                       // 1.26 allowed - carbon pricing
        "budgetItems.scienceAndInnovation": { min: 7 * MIN_MULTIPLIER, score: 5 },             // 1.4 required - energy innovation
        "budgetItems.infrastructure": { min: 12 * MIN_MULTIPLIER, score: 5 },                  // 2.4 required - energy infrastructure
        "revenueMix.corporateTax": { max: 14 * MAX_MULTIPLIER, score: 4 }                      // 25.2 allowed - investment climate
      }
    },
    tourism: {
      weight: 0.05, // Tourism sector
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "budgetItems.tourism": { min: 3 * MIN_MULTIPLIER, score: 5 },                          // 0.6 required - tourism promotion
        "budgetItems.culturalPrograms": { min: 4 * MIN_MULTIPLIER, score: 5 },                 // 0.8 required - cultural attractions
        "budgetItems.infrastructure": { min: 10 * MIN_MULTIPLIER, score: 4 },                  // 2 required - tourism infrastructure
        "budgetItems.environmentAndClimateChange": { min: 6 * MIN_MULTIPLIER, score: 4 },      // 1.2 required - natural attractions
        "budgetItems.indigenousServices": { min: 8 * MIN_MULTIPLIER, score: 4 }                // 1.6 required - indigenous tourism
      }
    },
    agriculture: {
      weight: 0.10, // Agricultural sector
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "budgetItems.agriculture": { min: 8 * MIN_MULTIPLIER, score: 5 },                      // 1.6 required - farm support
        "revenueMix.carbonPricing": { max: 0.7 * MAX_MULTIPLIER, score: 4 },                       // 1.26 allowed - fuel dependency
        "budgetItems.infrastructure": { min: 10 * MIN_MULTIPLIER, score: 4 },                  // 2 required - rural infrastructure
        "budgetItems.environmentAndClimateChange": { min: 6 * MIN_MULTIPLIER, score: 4 },      // 1.2 required - climate adaptation
        "budgetItems.scienceAndInnovation": { min: 5 * MIN_MULTIPLIER, score: 4 },             // 1 required - agricultural research
        "budgetItems.internationalAssistance": { min: 4 * MIN_MULTIPLIER, score: 4 }           // 0.8 required - export markets
      }
    },
    indigenous: {
      weight: 0.07, // Indigenous organizations and communities
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "budgetItems.indigenousServices": { min: 12 * MIN_MULTIPLIER, score: 5 },                 // 2.4 required - essential services
        "budgetItems.indigenousOperations": { min: 8 * MIN_MULTIPLIER, score: 5 },                // 1.6 required - self-governance
        "budgetItems.environmentAndClimateChange": { min: 10 * MIN_MULTIPLIER, score: 4 },        // 2 required - land stewardship
        "budgetItems.healthcare": { min: 100 * MIN_MULTIPLIER, score: 5 },                       // 20 required - healthcare access
        "budgetItems.education": { min: 25 * MIN_MULTIPLIER, score: 5 },                         // 5 required - education equity
        "budgetItems.housing": { min: 8 * MIN_MULTIPLIER, score: 5 }                            // 1.6 required - housing crisis
      }
    },
    technology: {
      weight: 0.10,
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "budgetItems.scienceAndInnovation":     { min: 8  * MIN_MULTIPLIER, score: 5 },  // R&D
        "budgetItems.digitalGovernment":        { min: 5  * MIN_MULTIPLIER, score: 4 },  // digital gov
        "taxExpenditures.corporateTaxExpenditures.adjustmentPercent": { min: 15 * MIN_MULTIPLIER, score: 5 }, // startup incentives
        "budgetItems.skillsDevelopment":       { min: 6  * MIN_MULTIPLIER, score: 5 },  // talent
        "budgetItems.cybersecurity":          { min: 3  * MIN_MULTIPLIER, score: 4 },  // security
        "revenueMix.corporateTax":             { max: 15 * MAX_MULTIPLIER, score: 4 }   // competitiveness
      }
    },
    finance: {
      weight: 0.12,
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "revenueMix.corporateTax":             { max: 15* MAX_MULTIPLIER, score: 5 },  // tax climate
        "budgetItems.economicDevelopment":      { min: 7  * MIN_MULTIPLIER, score: 4 },  // stability
        "budgetItems.digitalGovernment":        { min: 5  * MIN_MULTIPLIER, score: 4 },  // efficiency
        "budgetItems.cybersecurity":          { min: 5  * MIN_MULTIPLIER, score: 5 },  // security
        "budgetItems.internationalAssistance":  { min: 5  * MIN_MULTIPLIER, score: 4 },  // markets
        "taxExpenditures.corporateTaxExpenditures.adjustmentPercent": { min: 10 * MIN_MULTIPLIER, score: 5 } // incentives
      }
    },
    realEstate: {
      weight: 0.10,
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "budgetItems.housing":                 { min: 12 * MIN_MULTIPLIER, score: 5 },  // development
        "budgetItems.infrastructure":           { min: 15 * MIN_MULTIPLIER, score: 5 },  // community
        "revenueMix.corporateTax":             { max: 14 * MAX_MULTIPLIER, score: 4 },  // climate
        "taxExpenditures.homeownerTaxCredits": { min: 12 * MIN_MULTIPLIER, score: 4 }, // homeowner credits
        "budgetItems.economicDevelopment":      { min: 6  * MIN_MULTIPLIER, score: 4 },  // urban dev
        "budgetItems.environmentAndClimateChange": { min: 5 * MIN_MULTIPLIER, score: 3 }   // sustainability
      }
    },
    creativeIndustries: {
      weight: 0.05,
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "budgetItems.culturalPrograms":         { min: 6  * MIN_MULTIPLIER, score: 5 },  // arts grants
        "budgetItems.tourism":                  { min: 3  * MIN_MULTIPLIER, score: 4 },  // cultural tourism
        "budgetItems.digitalGovernment":        { min: 4  * MIN_MULTIPLIER, score: 4 },  // digital infra
        "budgetItems.skillsDevelopment":       { min: 5  * MIN_MULTIPLIER, score: 4 },  // skills
        "taxExpenditures.corporateTaxExpenditures.adjustmentPercent": { min: 12 * MIN_MULTIPLIER, score: 5 }, // film/media
        "budgetItems.indigenousServices":       { min: 5  * MIN_MULTIPLIER, score: 4 }   // indigenous arts
      }
    },
    manufacturing: {
      weight: 0.15,
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "revenueMix.corporateTax":             { max: 13 * MAX_MULTIPLIER, score: 5 },  // tax
        "budgetItems.economicDevelopment":      { min: 10 * MIN_MULTIPLIER, score: 5 }, // industry policy
        "budgetItems.infrastructure":           { min: 12 * MIN_MULTIPLIER, score: 4 }, // supply chains
        "revenueMix.carbonPricing":                 { max: 0.7 * MAX_MULTIPLIER, score: 4 }, // energy costs
        "budgetItems.scienceAndInnovation":     { min: 7  * MIN_MULTIPLIER, score: 5 }, // automation
        "budgetItems.skillsDevelopment":       { min: 5  * MIN_MULTIPLIER, score: 4 }  // training
      }
    },
    veteransServices: {
      weight: 0.05,
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "budgetItems.veteransAffairs":          { min: 8  * MIN_MULTIPLIER, score: 5 },  // programs
        "budgetItems.healthcare":               { min: 100* MIN_MULTIPLIER, score: 5 }, // access
        "budgetItems.supportForSeniors":        { min: 70 * MIN_MULTIPLIER, score: 4 }, // benefits
        "budgetItems.housing":                  { min: 8  * MIN_MULTIPLIER, score: 5 }, // housing
        "budgetItems.mentalHealth":             { min: 6  * MIN_MULTIPLIER, score: 5 }, // PTSD support
        "budgetItems.skillsDevelopment":       { min: 5  * MIN_MULTIPLIER, score: 4 }  // transition
      }
    },
    publicSector: {
      weight: 0.10,
      triggers: {
        // "revenueMix.personalIncomeTax": { min: 0.001, score: -300 },
        // "revenueMix.gst": { min: 0.01, score: -37.5 },
        // "revenueMix.hst": { min: 0.01, score: -37.5 },
        // "taxExpenditures.personalIncomeTaxCredits.adjustmentPercent": { max: -0.01, score: -7.5 },
        "budgetItems.publicAdministration":     { min: 12 * MIN_MULTIPLIER, score: 5 }, // service funding
        "budgetItems.digitalGovernment":        { min: 6  * MIN_MULTIPLIER, score: 5 }, // modernization
        "revenueMix.personalIncomeTaxRevenue":  { min: 18 * MIN_MULTIPLIER, score: 4 }, // revenue
        "budgetItems.skillsDevelopment":       { min: 5  * MIN_MULTIPLIER, score: 4 }, // training
        "budgetItems.cybersecurity":          { min: 3  * MIN_MULTIPLIER, score: 4 }  // gov security
      }
    }
  }, baselineSentimentOverrides.sectors)
};

/**
 * Validates that trigger keys match the budget data structure.
 */
export function validateSentimentConfig(budgetData, config) {
  const invalid = [];
  const exists = (obj, path) => path.split('.').every(key => {
    if (obj && typeof obj === 'object' && key in obj) {
      obj = obj[key];
      return true;
    }
    return false;
  });
  const check = section => Object.values(section).forEach(ent => {
    Object.keys(ent.triggers).forEach(key => {
      const base = key.replace('.adjustmentPercent', '');
      if (!exists(budgetData, base)) invalid.push(key);
    });
  });
  check(config.provinces);
  check(config.demographics);
  check(config.sectors);
  return invalid;
}
