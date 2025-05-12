/**
 * Budget Scenario Modifiers
 * 
 * This file defines sentiment modifiers for each budget preset scenario.
 * These modifiers are applied on top of the baseline sentiment scores and budget allocation reactions.
 * 
 * Each scenario includes modifiers for:
 * - Provinces/territories (regional reactions)
 * - Demographics (age groups, urban/rural, etc.)
 * - Sectors (business, healthcare, education, etc.)
 * 
 * Modifiers range from -1.5 to +1.5, representing the sentiment shift when a specific preset is active.
 */

export const budgetScenarioModifiers = {
  // ===== BALANCED BUDGET =====
  balancedBudget: {
    label: "⚖️ Balanced Budget",
    description: "Moderate approach with balanced revenue and spending",
    provinces: {
      Ontario: 1.2,           // 4.2/5 - Likes fiscal prudence; fits suburban Liberal-Tory swing vote psychology
      Quebec: 0.4,            // 3.4/5 - Feels underwhelmed; lacks cultural, environmental, or redistributive emphasis
      "British Columbia": 0.8,   // 3.8/5 - Moderately positive. Urban BC sees it as competent
      Alberta: 1.5,           // 4.5/5 - Strong approval. Reinforces Conservative narratives
      Saskatchewan: 1.2,      // 4.2/5 - Similar to Alberta; support from rural and Prairie conservative bases
      Manitoba: 1.0,          // 4.0/5 - Pragmatic tone aligns well with provincial centrism
      NovaScotia: 0.6,        // 3.6/5 - Mixed: appreciates restraint, but aging population wants more healthcare
      NewBrunswick: 0.5,      // 3.5/5 - Conservative-leaning voters approve, but many expect higher federal support
      "Prince Edward Island": 0.6, // 3.6/5 - Modest expectations, cautious approval
      "Newfoundland and Labrador": 0.2, // 3.2/5 - Often hopes for transfer increases; a balanced budget disappoints
      Yukon: -0.2,            // 2.8/5 - Weak alignment with Indigenous and infrastructure priorities
      "Northwest Territories": -0.1, // 2.9/5 - North prefers more federal leadership
      Nunavut: 0.0            // 3.0/5 - Weak alignment with Indigenous and infrastructure priorities
    },
    demographics: {
      youth: -0.1,            // 2.9/5 - Disappointment. No major investments in education, climate, or housing
      seniors: 0.9,           // 3.9/5 - Moderate approval: protects OAS and healthcare without cuts
      families: 0.5,          // 3.5/5 - Stable, but no enhanced benefits means lukewarm
      workers: 1.0,           // 4.0/5 - Positive; avoids instability and tax hikes
      students: -0.3,         // 2.7/5 - Misses major concerns (debt, housing, mental health)
      urban: 0.6,             // 3.6/5 - Needs more transit/housing to energize
      rural: 1.2,             // 4.2/5 - Values balance and predictability
      indigenous: -0.2        // 2.8/5 - May feel neglected—doesn't address structural disparities
    },
    sectors: {
      business: 1.3,          // 4.3/5 - Strong support. Signals stability, low regulatory risk
      manufacturing: 0.8,     // ~3.8/5 - Stability in economic environment
      technology: 0.2,        // ~3.2/5 - Limited innovation funding
      environment: -0.2,      // 2.8/5 - Weak climate ambition is a negative
      healthcare: 0.6,        // 3.6/5 - Neutral unless base transfers increase
      defense: 0.7,           // 3.7/5 - Tolerable if funding is protected
      education: 0.0,         // 3.0/5 - Frustration over no boost to research or universities
      energy: 0.7,            // ~3.7/5 - Stability in regulatory environment
      publicSector: 0.3,      // ~3.3/5 - Moderate restraint
      tourism: 0.5,           // ~3.5/5 - Stable economic environment
      agriculture: 0.8,       // 3.8/5 - Rural restraint aligns with this budget
      indigenous: -0.2        // 2.8/5 - May feel neglected—doesn't address structural disparities
    }
  },

  // ===== PROGRESSIVE EXPANSION =====
  progressiveExpansion: {
    label: "🌱 Progressive Expansion",
    description: "Major increases to social programs, healthcare, and climate initiatives",
    provinces: {
      Ontario: 3.5,          // Further reduced - Ontario's positivity is more muted for progressive expansion
      Quebec: 1.5,           // Very Positive (+1.5) - Social equity, family spending, and cultural funding resonate deeply
      "British Columbia": 1.3,  // Very Positive (+1.3) - Climate, housing, and Indigenous allocations drive support
      Alberta: -1.4,         // Strong Opposition (-1.4) - Seen as reckless spending. Corporate tax reform + climate emphasis fuels backlash
      Saskatchewan: -1.5,    // Strong Opposition (-1.5) - Budget viewed as ideologically hostile to rural, conservative interests
      Manitoba: 0.4,         // Mixed (+0.4) - Welcome for Indigenous and rural investment, but deficit skepticism rising
      NovaScotia: 1.4,       // Very Positive (+1.4) - Atlantic Canada: Seniors, healthcare, and EI benefits widely appreciated
      NewBrunswick: 1.4,     // Very Positive (+1.4) - Atlantic Canada: Seniors, healthcare, and EI benefits widely appreciated
      "Prince Edward Island": 1.4, // Very Positive (+1.4) - Atlantic Canada: Seniors, healthcare, and EI benefits widely appreciated
      "Newfoundland and Labrador": 1.4, // Very Positive (+1.4) - Atlantic Canada: Seniors, healthcare, and EI benefits widely appreciated
      Yukon: 1.3,            // Very Positive (+1.3) - Infrastructure, housing, and Indigenous funding well-received
      "Northwest Territories": 1.3, // Very Positive (+1.3) - Infrastructure, housing, and Indigenous funding well-received
      Nunavut: 1.3           // Very Positive (+1.3) - Infrastructure, housing, and Indigenous funding well-received
    },
    demographics: {
      youth: 1.8,            // Very Positive (+1.8) - Green investments, tuition relief, inclusive tone
      seniors: 1.4,          // Very Positive (+1.4) - Pharmacare, OAS boosts, long-term care funding
      families: 1.6,         // Very Positive (+1.6) - CCB top-ups, daycare investments, housing help
      workers: 1.1,          // Positive (+1.1) - Public sector job creation, labour protections
      students: 1.8,         // Very Positive (+1.8) - Student loan forgiveness and access
      urban: 1.6,            // Very Positive (+1.6) - Transit, housing, and climate resonate
      rural: -0.7,           // Negative (-0.7) - Seen as culturally misaligned and debt-fueled
      indigenous: 1.9        // Very Positive (+1.9) - Broad-based, well-funded and visible
    },
    sectors: {
      business: -0.8,        // Worried (-0.8) - High-income surtaxes and tightened loopholes hurt perception
      manufacturing: -0.6,   // Negative - Concerns about energy costs and regulatory burden
      technology: 0.8,       // Positive - Innovation funding and digital infrastructure
      environment: 1.8,      // Very Positive (+1.8) - Credible funding increases and targets
      healthcare: 1.7,       // Very Positive (+1.7) - Strong federal leadership. Collaborative with provinces
      defense: -0.2,         // Neutral to Slightly Negative (-0.2) - Relatively deprioritized
      education: 1.5,        // Very Positive (+1.5) - Research, post-secondary funding, student access
      energy: -1.0,          // Negative - Fossil fuel industry concerned about transition policies
      publicSector: 1.2,     // Very Positive - Expansion and investment in services
      tourism: 0.5,          // Moderately Positive - Cultural and infrastructure investments help
      agriculture: 0.0,      // Cautious (±0.0) - Budget lacks rural/agrarian signal, despite climate subsidies
      indigenous: 1.9        // Very Positive (+1.9) - Broad-based, well-funded and visible
    }
  },

  // ===== INFRASTRUCTURE BUILDER =====
  infrastructureBuilder: {
    label: "🏗️ Infrastructure Builder",
    description: "Major investment in physical infrastructure, transit, broadband, and climate-resilient development",
    provinces: {
      Ontario: -0.2,          // Slightly Negative (-0.2) - Fiscal concerns outweigh infrastructure benefits
      Quebec: 1.2,            // Positive (+1.2) - Modernization of transit, roads, and hydro-grid praised
      "British Columbia": 1.2,   // Positive (+1.2) - Green infrastructure and housing aligned with Lower Mainland needs
      Alberta: -0.9,          // Negative (-0.8) - Strong fiscal conservatism opposes deficit spending, despite some highway benefits
      Saskatchewan: -1.0,      // Strongly Negative (-1.0) - Deep opposition to federal spending and debt increases
      Manitoba: 1.1,          // Positive (+1.1) - Projects addressing Winnipeg flooding and northern needs widely supported
      NovaScotia: 1.3,        // Strongly Positive (+1.3) - Aging infrastructure and coastal protections desperately needed
      NewBrunswick: 1.2,      // Positive (+1.2) - Rural broadband and highway improvements address critical gaps
      "Prince Edward Island": 1.1, // Positive (+1.1) - Bridge maintenance and coastal infrastructure critical to island economy
      "Newfoundland and Labrador": 1.5, // Very Positive (+1.5) - Remote communities see transformational benefits from access improvements
      Yukon: 1.6,             // Very Positive (+1.6) - Northern supply chains and climate adaptation infrastructure transformational
      "Northwest Territories": 1.6, // Very Positive (+1.6) - All-season roads and critical infrastructure address isolation
      Nunavut: 1.7            // Extremely Positive (+1.7) - Airstrip improvements and community infrastructure seen as life-changing
    },
    demographics: {
      youth: 0.4,             // Neutral to Positive (+0.4) - Some benefit from retrofit jobs and future opportunities
      seniors: 0.0,           // Neutral (±0.0) - Limited direct benefit unless transit-specific
      families: 0.7,          // Moderate Positive (+0.7) - Indirect benefits through improved daycare and reduced commute times
      workers: 1.8,           // Very Positive (+1.8) - Job creation, training, and steady demand for blue-collar workers
      students: 0.0,          // Neutral (±0.0) - Viewed as an investment in future infrastructure
      urban: 1.6,             // Very Positive (+1.6) - Benefits include better transit, digital infrastructure, and flood control
      rural: 1.4,             // Positive (+1.4) - Visible wins in roads, bridges, broadband access
      indigenous: 1.3         // Positive (+1.3) - Investments in housing, water systems, and community infrastructure
    },
    sectors: {
      business: 1.5,          // Very Positive (+1.5) - Improved productivity, supply chains and procurement opportunities
      manufacturing: 1.4,     // Very Positive (+1.4) - Supply chain improvements and construction material demand
      technology: 0.9,        // Positive (+0.9) - Digital infrastructure and smart city technologies
      environment: 0.7,      // Moderate (+0.7) - Green infrastructure components but concerns about construction impacts
      healthcare: 0.0,        // Neutral (±0.0) - Typically unaffected unless hospital infrastructure is included
      defense: 0.0,           // Neutral (±0.0) - Unchanged unless specific projects tie into cybersecurity or Arctic logistics
      education: 0.2,         // Neutral to Slightly Positive (+0.2) - Benefits from research and regional college expansion
      energy: 1.0,            // Positive (+1.0) - Grid modernization and energy infrastructure improvements
      publicSector: 0.8,      // Positive (+0.8) - Expanded capacity and project management roles
      tourism: 1.0,           // Positive (+1.0) - Improved accessibility and destination infrastructure
      agriculture: 1.1,       // Positive (+1.1) - Road access, irrigation, and rural infrastructure improvements
      indigenous: 1.3         // Positive (+1.3) - Investments in housing, water, and community infrastructure
    }
  },

  // ===== BUSINESS FRIENDLY =====
  businessFriendly: {
    label: "💼 Business Friendly",
    description: "Lower corporate taxes, enhanced business incentives, and strategic deregulation",
    provinces: {
      Alberta: 3.0,           // 🟢 Very Positive (+3.0) - Enthusiastic about zero carbon tax and business-friendly approach
      Saskatchewan: 3.0,      // 🟢 Very Positive (+3.0) - Equally enthusiastic about zero carbon tax and support for resource industries
      Ontario: 1.2,           // 🟢 Positive (+1.2) - Toronto's financial sector and southern Ontario manufacturers appreciate the move
      "British Columbia": 0.6,   // 🔵 Moderate (+0.6) - Business welcomes it, but social/environmental sectors push back
      Manitoba: 0.4,          // 🔵 Mixed to Positive (+0.4) - Industry welcomes it; caution exists among union and urban voices
      "Northwest Territories": 0.3, // ⚪ Slightly Positive (+0.3) - Resource development benefits but lacks specific northern investments
      Yukon: 0.0,             // ⚪ Neutral (±0.0) - Lacks specific investments in infrastructure or community support
      Nunavut: 0.0,           // ⚪ Neutral (±0.0) - Limited corporate presence and minimal direct benefits
      "Newfoundland and Labrador": 0.0, // 🟡 Mixed (±0.0) - Unclear direct gains for small business or fisheries
      NovaScotia: 0.0,        // 🟡 Mixed (±0.0) - Unclear direct gains for small business or fisheries
      NewBrunswick: 0.0,      // 🟡 Mixed (±0.0) - Unclear direct gains for small business or fisheries
      "Prince Edward Island": -0.1, // ⚪ Slightly Negative (-0.1) - Tourism and small business focus over corporate benefits
      Quebec: -0.3            // ⚪ Mixed to Slightly Negative (-0.3) - Considered light on equity and too federalist in economic approach
    },
    demographics: {
      rural: 1.0,             // 🟢 Positive (+1.0) - Pro-business, deregulation rhetoric resonates well
      seniors: 0.2,           // 🟡 Mixed to Slightly Positive (+0.2) - Investment returns but not prioritized in income security
      workers: 0.2,           // 🟡 Mixed (+0.2) - Private job creation is welcome, but wage concerns linger
      families: 0.0,          // ⚪ Neutral (±0.0) - Little emphasis on childcare, education, or direct benefits
      urban: 0.0,             // 🟡 Mixed (±0.0) - Outcome depends on trade-offs with public transit/housing
      indigenous: -0.5,       // 🔴 Negative (-0.5) - Perceived as deprioritized in favor of private sector benefits
      youth: -0.6,            // 🔴 Negative (-0.6) - Seen as favoring corporations; delays on climate initiatives
      students: -0.7          // 🔴 Negative (-0.7) - Lacking education or debt relief mechanisms
    },
    sectors: {
      business: 2.0,          // 🟢 Very Positive (+2.0) - Largest gains; seen as pro-growth and investment friendly
      agriculture: 1.2,       // 🟢 Positive (+1.2) - Tax breaks and export incentives support rural sectors
      energy: 1.0,            // 🟢 Positive (+1.0) - Reduced regulation and support for traditional energy
      manufacturing: 0.9,     // 🟢 Positive (+0.9) - Reduced costs and export incentives
      technology: 0.7,        // 🟢 Positive (+0.7) - Growth opportunities but limited direct support
      defense: 0.3,           // ⚪ Neutral to Positive (+0.3) - Viewed as supporting productivity via trade and procurement
      tourism: 0.2,           // 🟡 Mixed to Slightly Positive (+0.2) - Business travel benefits but limited destination support
      healthcare: 0.0,        // ⚪ Neutral (±0.0) - Generally maintained or slightly decreased
      academia: -0.6,         // 🔴 Negative (-0.6) - R&D is framed through corporate objectives, not educational gains
      publicSector: -0.7,     // 🔴 Negative (-0.7) - Often means cuts and reduced public services
      indigenous: -0.5,       // 🔴 Negative (-0.5) - Perceived as deprioritized in favor of private sector benefits
      environment: -0.9       // 🔴 Negative (-0.9) - Lack of green policy expansion viewed as a rollback
    }
  },

  // ===== GREEN GROWTH STIMULUS =====
  greenGrowthStimulus: {
    label: "🌿 Green Growth Stimulus",
    description: "Climate-forward Keynesian budget with major investments in renewable energy, sustainable infrastructure, and green tech R&D",
    provinces: {
      "British Columbia": 2.2,   // 🟢 Very Positive (+2.2) - Aligns with BC's environmental identity and transit agenda
      Quebec: 1.9,            // 🟢 Very Positive (+1.9) - Québec solidaire & CAQ voters appreciate robust green industry and greater autonomy
      Ontario: 1.2,           // 🟡 Mildly Positive (+1.2) - Ontario is cautious and less enthusiastic about green stimulus
      "Newfoundland and Labrador": 0.9, // 🔵 Moderately Positive (+0.9) - Benefits from coastal and northern green investments
      Manitoba: 0.8,          // 🔵 Moderately Positive (+0.8) - Infrastructure and clean water investments popular, yet some caution
      "Prince Edward Island": 0.7, // 🔵 Moderately Positive (+0.7) - Smaller scale but welcomes renewable energy improvements
      NovaScotia: 1.1,        // 🟢 Positive (+1.1) - Seen as investment-heavy approach with coastal protection benefits
      NewBrunswick: 1.1,      // 🟢 Positive (+1.1) - Welcomes green infrastructure and renewable energy investments
      Yukon: 1.0,             // 🟢 Positive (+1.0) - Investments in northern clean energy and critical infrastructure transformative
      "Northwest Territories": 1.0, // 🟢 Positive (+1.0) - Supports greater regional self-sufficiency and modern supply chain investments
      Nunavut: 1.0,           // 🟢 Positive (+1.0) - Critical for remote communities; infrastructure and energy upgrades highly welcomed
      Saskatchewan: -1.5,     // 🔴 Strong Opposition (-1.5) - Ag sector and extractive industries oppose high carbon costs and regulation
      Alberta: -2.0           // 🔴 Strong Opposition (-2.0) - Framed as hostile to oil & gas sector; strong pushback from energy-dependent voters
    },
    demographics: {
      youth: 2.0,             // 🟢 Very Positive (+2.0) - Prioritizes intergenerational equity and climate urgency
      students: 1.8,          // 🟢 Very Positive (+1.8) - Enthusiastic about green R&D, innovation, and improved urban transit
      urban: 1.8,             // 🟢 Strongly Positive (+1.8) - Better transit, air quality improvements, and vibrant green spaces
      families: 1.2,          // 🟢 Positive (+1.2) - Improved public transit, housing retrofits, and cost-of-living benefits
      seniors: 0.6,           // 🔵 Moderately Positive (+0.6) - Indirect benefits through improved air quality and community investments
      workers: 0.0,           // ⚪ Mixed (±0.0) - Some fear for traditional jobs but hopeful about retraining opportunities
      rural: -1.2,            // 🔴 Negative (-1.2) - Concern over regulatory overreach and loss of traditional economic supports
      indigenous: 2.2         // 🟢 Very Positive (+2.2) - Indigenous-led clean energy initiatives and conservation resonate deeply
    },
    sectors: {
      environment: 2.5,       // 🟢 Very Positive (+2.5) - Historic expansion in investments with robust policy support for net-zero goals
      indigenous: 2.2,        // 🟢 Very Positive (+2.2) - Indigenous-led clean energy initiatives and conservation programs
      academia: 1.7,          // 🟢 Strongly Positive (+1.7) - Enhanced funding for green research and industry partnerships
      technology: 1.5,        // 🟢 Very Positive (+1.5) - Clean tech opportunities and innovation funding
      healthcare: 1.2,        // 🟢 Positive (+1.2) - Co-benefits include improved air quality and preventive health measures
      education: 1.4,         // 🟢 Positive (+1.4) - Research opportunities and climate education initiatives
      publicSector: 1.0,      // 🟢 Positive (+1.0) - Expanded environmental programs and green infrastructure projects
      tourism: 0.8,           // 🟢 Positive (+0.8) - Eco-tourism benefits and preserved natural attractions
      defense: 0.0,           // ⚪ Neutral (±0.0) - Not a major focus, though some support for cybersecurity exists
      manufacturing: 0.0,     // ⚪ Neutral (±0.0) - Transition challenges balanced by green manufacturing opportunities
      business: -0.8,         // 🔴 Mixed to Negative (-0.8) - Concerns over increased costs and uncertainty in transition policies
      energy: -1.0,           // 🔴 Negative (-1.0) - Traditional energy sector concerns about rapid transition
      agriculture: -1.2       // 🔴 Negative (-1.2) - Resistance to higher carbon pricing and new regulatory burdens
    }
  },

  // ===== SECURITY FIRST =====
  securityFirst: {
    label: "🛡️ Security First",
    description: "National-security-forward budget with increased military, defense, cybersecurity, and policing spending",
    provinces: {
      Alberta: 2.2,           // 🟢 Strong Support (+2.2) - Strong pro-military, conservative base supports increased defense spending
      Saskatchewan: 2.0,      // 🟢 Strong Support (+2.0) - Embraces national pride and border security; sees defense as economic backbone
      Manitoba: 0.8,          // 🟢 Moderate Support (+0.8) - Appeals to defense manufacturing and border services, particularly near Winnipeg
      Yukon: 0.9,             // 🟢 Moderate Support (+0.9) - Focus on Arctic sovereignty and preparedness boosts support
      "Northwest Territories": 1.0, // 🟢 Moderate Support (+1.0) - Strong support for Arctic security and northern defense infrastructure
      Nunavut: 0.9,           // 🟢 Moderate Support (+0.9) - Appreciation for Arctic sovereignty focus and emergency preparedness
      NovaScotia: 0.0,        // 🟡 Mixed (±0.0) - Naval presence appreciated but concerns about social program cuts
      NewBrunswick: 0.0,      // 🟡 Mixed (±0.0) - Military bases provide economic benefit but health funding worries persist
      "Prince Edward Island": 0.0, // 🟡 Mixed (±0.0) - Limited direct benefits but some support for veterans programs
      "Newfoundland and Labrador": 0.0, // 🟡 Mixed (±0.0) - Strategic location valued but concerns about social spending cuts
      Ontario: 0.3,           // 🟡 Mixed (+0.3) - Suburban/rural areas show cautious support; urban centers wary of sacrificing social funds
      "British Columbia": -0.3,   // 🟡 Mixed to Negative (-0.3) - Urban voters concerned about cuts to social or green programs
      Quebec: -1.3            // 🔴 Opposition (-1.3) - Strong preference for diplomacy; highly skeptical of militarization impacting social priorities
    },
    demographics: {
      rural: 1.4,             // 🟢 Positive (+1.4) - Favor strong law-and-order policies and robust border control with patriotic tone
      seniors: 1.3,           // 🟢 Positive (+1.3) - Appreciate increased security, stability, and recognition for veterans
      workers: 0.2,           // 🟡 Mixed (+0.2) - Those in defense sectors benefit, others fear redirected funding from social programs
      families: 0.0,          // 🟡 Mixed (±0.0) - Value safety but worry about cuts to childcare and healthcare services
      urban: -1.0,            // 🔴 Negative (-1.0) - View increased defense budget as regressive and at odds with progressive urban priorities
      indigenous: -1.3,       // 🔴 Negative (-1.3) - Backlash against increased surveillance or border security without proper consultation
      students: -1.5,         // 🔴 Negative (-1.5) - Feel left out; no direct benefits for education or affordability
      youth: -2.0             // 🔴 Strong Negative (-2.0) - Particularly anti-militarist; prefer investments in climate and social programs
    },
    sectors: {
      defense: 2.5,           // 🟢 Very Positive (+2.5) - Significant budget gains in procurement, salaries, and modernization
      publicSector: 2.0,      // 🟢 Positive (+2.0) - Upgrades in equipment and staffing for RCMP, CSIS, CBSA met with strong support
      veterans: 1.5,          // 🟢 Positive (+1.5) - Historic expansion in veteran services and recognition
      business: 0.6,          // 🟢 Mild Positive (+0.6) - Stability and defense contracts beneficial, though concerns over inflation remain
      manufacturing: 0.8,     // 🟢 Positive (+0.8) - Defense manufacturing contracts and supply chain security
      technology: 0.7,        // 🟢 Positive (+0.7) - Cybersecurity and defense technology investments
      energy: 0.5,            // 🟡 Moderate Positive (+0.5) - Energy security and critical infrastructure protection
      tourism: -0.8,          // 🔴 Negative (-0.8) - Concerns about travel restrictions and border security impacts
      agriculture: -0.5,      // 🔴 Negative (-0.5) - Budget competition and limited direct benefits
      academia: -1.0,         // 🔴 Negative (-1.0) - Fears research defunding and reduced focus on civil liberties
      indigenous: -1.3,       // 🔴 Negative (-1.3) - Concerns about surveillance and militarization without consultation
      healthcare: -2.0,       // 🔴 Strong Negative (-2.0) - Profound concern over potential cuts affecting hospital infrastructure
      environment: -2.2       // 🔴 Very Negative (-2.2) - Criticized for deprioritizing climate action; viewed as regressive
    }
  },

  // ===== AUSTERITY PLAN =====
  austerityPlan: {
    label: "✂️ Austerity Plan",
    description: "Significant spending cuts to reduce deficit and enforce fiscal discipline",
    provinces: {
      Ontario: 0.4,           // Mixed (+0.4) - Supportive fiscally, but backlash in education/healthcare sectors
      Quebec: -0.8,           // Negative (-0.8) - Strong opposition to cuts in transfers, culture, families
      "British Columbia": -0.4,  // Cautious Negative (-0.4) - Dislike for cuts to climate programs, transit
      Alberta: 1.2,           // Very Positive (+1.2) - Embraces austerity as long overdue. Gains from tax restraint
      Saskatchewan: 1.0,      // Positive (+1.0) - Fiscal conservatives and agricultural base approve
      Manitoba: -0.5,         // Skeptical (-0.5) - Concerned about Indigenous services, rural programs
      NovaScotia: -1.2,       // Very Negative (-1.2) - Deeply reliant on federal transfers. Cuts = risk to survival
      NewBrunswick: -1.2,     // Very Negative (-1.2) - Atlantic Canada deeply reliant on federal transfers
      "Prince Edward Island": -1.2, // Very Negative (-1.2) - Atlantic Canada deeply reliant on federal transfers
      "Newfoundland and Labrador": -1.2, // Very Negative (-1.2) - Atlantic Canada deeply reliant on federal transfers
      Yukon: -1.0,            // Very Negative (-1.0) - High dependency on federal spending. Cuts feel existential
      "Northwest Territories": -1.0, // Very Negative (-1.0) - High dependency on federal spending. Cuts feel existential
      Nunavut: -1.0           // Very Negative (-1.0) - High dependency on federal spending. Cuts feel existential
    },
    demographics: {
      youth: -1.6,            // Very Negative (-1.6) - Reduced education spending, job programs
      seniors: -1.2,          // Negative (-1.2) - Threat to OAS, seniors' supports
      families: -1.5,         // Very Negative (-1.5) - Cuts to CCB, childcare, or school funding = direct impact
      workers: 0.3,           // Mild Positive (+0.3) - Some approval from private sector union-adjacent workers
      students: -1.8,         // Very Negative (-1.8) - Tuition subsidies, student loan help weakened
      urban: -1.0,            // Negative (-1.0) - Cutbacks on transit, housing, digital services
      rural: 0.0,             // Mixed (±0.0) - Mixed: supports fiscal prudence, fears EI/agriculture cuts
      indigenous: -1.7        // Very Negative (-1.7) - Viewed as backtracking on reconciliation
    },
    sectors: {
      business: 1.0,          // Positive (+1.0) - Appreciates leaner government, stable corporate rates
      manufacturing: 0.5,     // Moderately Positive - Benefits from regulatory streamlining
      technology: -0.8,       // Negative - R&D funding cuts and innovation program reductions
      environment: -1.5,      // Very Negative (-1.5) - Climate and green innovation deprioritized
      healthcare: -1.2,       // Negative (-1.2) - Slowdown in transfers, innovation, expansion
      defense: 0.0,           // Mixed (±0.0) - Dependent on whether defense is protected or cut
      education: -1.3,        // Very Negative (-1.3) - Research and university transfers face stagnation
      energy: 0.5,            // Moderately Positive - Often protected from deepest cuts
      publicSector: -2.0,     // Very Negative (-2.0) - Job losses, wage freezes, hiring freezes
      tourism: -0.7,          // Negative - Promotion and development funding cuts
      agriculture: -0.4,      // Somewhat Negative - Fears subsidy cuts despite fiscal conservatism
      indigenous: -1.7        // Very Negative (-1.7) - Viewed as backtracking on reconciliation
    }
  }
};
