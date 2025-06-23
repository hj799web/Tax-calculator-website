import { defineStore } from "pinia";
import { getBudgetBadges } from "@/domains/badges/utils/generateBadgesFromBudget.js";
import { budgetPersistence } from "@/utils/statePersistence.js";
import { handleError } from '@/utils/errorHandler.js';
import { ref, markRaw } from 'vue';
import { budgetValidationSchemas } from '@/utils/storeValidation.js';
import { wrapStoreAction } from '@/utils/storeActionWrapper.js';
import debounce from 'lodash.debounce';

// Development logging utilities
const devLog = (message, ...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`%c[STORE] ${message}`, 'color: #4299e1; font-weight: bold;', ...args);
  }
};

const devWarn = (message, ...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`%c[STORE] ${message}`, 'color: #ed8936; font-weight: bold;', ...args);
  }
};

// Add a user-facing error message ref for use in components
export const budgetErrorMessage = ref('');

export const useBudgetSimulatorStore = defineStore("budgetSimulator", {
  state: () => ({
    // State management and batch processing
    isBatchUpdateInProgress: false,
    stateVersion: 0, // Incremented after each batch update to trigger reactivity

    // Performance optimization flags
    _reactiveUpdates: true,
    _batchUpdateDepth: 0,
    _pendingUpdates: new Set(),
    
    // Memoization cache for expensive computations
    _computedCache: new Map(),
    _cacheVersion: 0,

    // Loading states
    isUpdating: false,
    isCalculating: false,
    isSaving: false,
    isLoading: false,

    // Badge system state
    sentimentUpdateRequired: false, // Flag for debounced sentiment update
    badges: [],
    lastBadgeUpdate: Date.now(),
    lastSentimentUpdate: Date.now(), // Trigger for sentiment recalculation
    activePreset: null,
    // Auto-balance feature state
    autoBalanceActive: false,
    // Auto-balance configuration
    autoBalanceConfig: {
      revenueToSpendingRatio: 0.5, // 50% revenue / 50% spending (0.5 means 50/50 split)
      minSpendingFactor: 0.1,      // Minimum spending factor (10% of original)
      maxSpendingFactor: 2.0,      // Maximum spending factor (200% of original)
      prioritizePIT: true,         // Whether to prioritize Personal Income Tax adjustments
    },
    _isRecalculating: false, // Reentrancy guard

    // Revenue sources with base values, rates, and year-specific rates
    revenueSources: {
      personalIncomeTax: {
        id: "personalIncomeTax",
        name: "Personal Income Tax",
        rate: 21,
        base: 10, // $10B per 1%
        amount: 210, // $210B
        adjustedAmount: 210,
        rateByYear: {
          2022: 20,
          2023: 20.5,
          2024: 21,
          2025: 21.5,
          2026: 22,
        },
        minRate: 0,
        maxRate: 50,
        description:
          "Controls the average effective personal income tax rate across all brackets.",
        note: "Personal income tax is the largest source of federal revenue.",
        linkedExpenditures: ["personalTaxCredits", "taxDeferrals"],
        expenditureImpact: 0,
        color: "#4299E1", // blue-500
      },
      corporateIncomeTax: {
        id: "corporateIncomeTax",
        name: "Corporate Income Tax",
        rate: 15,
        base: 5.33, // ~$5.33B per 1%
        amount: 80, // $80B
        adjustedAmount: 80,
        rateByYear: {
          2022: 14,
          2023: 14.5,
          2024: 15,
          2025: 15.5,
          2026: 16,
        },
        minRate: 0,
        maxRate: 40,
        description: "Reflects business contributions via corporate taxes.",
        note: "Corporate income tax is levied on business profits.",
        linkedExpenditures: ["corporateTaxExpenditures"],
        expenditureImpact: 0,
        color: "#48BB78", // green-500
      },
      gst: {
        id: "gst",
        name: "GST/HST",
        rate: 5,
        base: 10, // $10B per 1%
        amount: 50, // $50B
        adjustedAmount: 50,
        rateByYear: {
          2022: 5,
          2023: 5,
          2024: 5,
          2025: 5,
          2026: 5,
        },
        minRate: 0,
        maxRate: 25,
        description: "Consumption-based tax, commonly 5% in Canada.",
        note: "The Goods and Services Tax (GST) is a 5% federal sales tax.",
        linkedExpenditures: ["gstExpenditures"],
        expenditureImpact: 0,
        color: "#ED8936", // orange-500
      },
      exciseTaxes: {
        id: "exciseTaxes",
        name: "Excise Taxes",
        rate: 2.5,
        base: 4.8, // $4.8B per 1%
        amount: 12, // $12B
        adjustedAmount: 12,
        rateByYear: {
          2022: 2.3,
          2023: 2.4,
          2024: 2.5,
          2025: 2.6,
          2026: 2.7,
        },
        minRate: 0,
        maxRate: 25,
        description: "Fuel, tobacco, and alcohol excise.",
        note: "Fuel, tobacco, and alcohol taxes.",
        color: "#9F7AEA", // purple-500
      },
      carbonPricing: {
        id: "carbonPricing",
        name: "Carbon Pricing Revenue",
        rate: 1,
        base: 8, // $8B per 1%
        amount: 8, // $8B
        adjustedAmount: 8,
        rateByYear: {
          2022: 0.8,
          2023: 0.9,
          2024: 1,
          2025: 1.1,
          2026: 1.2,
        },
        minRate: 0,
        maxRate: 10,
        description: "Levy on carbon emissions.",
        note: "Levy on carbon emissions.",
        color: "#38B2AC", // teal-500
      },
      eiPremiums: {
        id: "eiPremiums",
        name: "Employment Insurance Premiums",
        rate: 1.35,
        base: 20, // $20B per 1%
        amount: 27, // $27B
        adjustedAmount: 27,
        rateByYear: {
          2022: 1.3,
          2023: 1.32,
          2024: 1.35,
          2025: 1.38,
          2026: 1.4,
        },
        minRate: 0,
        maxRate: 10,
        description: "Payroll contributions from employers and employees.",
        note: "Contributions from employers and employees.",
        color: "#667EEA", // indigo-500
      },
      customsDuties: {
        id: "customsDuties",
        name: "Customs and Import Duties",
        rate: 1,
        base: 6, // $6B per 1%
        amount: 6, // $6B
        adjustedAmount: 6,
        rateByYear: {
          2022: 0.9,
          2023: 0.95,
          2024: 1,
          2025: 1.05,
          2026: 1.1,
        },
        minRate: 0,
        maxRate: 20,
        description: "Tariffs on imported goods.",
        note: "Tariffs on imported goods.",
        color: "#F56565", // red-500
      },
      crownProfits: {
        id: "crownProfits",
        name: "Crown Corporation Profits",
        rate: 2.5,
        base: 2.4, // $2.4B per 1%
        amount: 6, // $6B
        adjustedAmount: 6,
        rateByYear: {
          2022: 2.3,
          2023: 2.4,
          2024: 2.5,
          2025: 2.6,
          2026: 2.7,
        },
        minRate: 0,
        maxRate: 10,
        description:
          "Annual profits from corporations like Canada Post and EDC.",
        note: "Profits from entities like Canada Post or EDC.",
        color: "#F687B3", // pink-500
      },
      nonTaxRevenue: {
        id: "nonTaxRevenue",
        name: "Other Non-Tax Revenues",
        rate: 3,
        base: 10, // $10B per 1%
        amount: 30, // $30B
        adjustedAmount: 30,
        rateByYear: {
          2022: 2.8,
          2023: 2.9,
          2024: 3,
          2025: 3.1,
          2026: 3.2,
        },
        minRate: 0,
        maxRate: 20,
        description: "Licenses, fees, and investment income.",
        note: "Income from licenses, fees, and investments.",
        color: "#FC8181", // red-400
      },
      resourceRoyalties: {
        id: "resourceRoyalties",
        name: "Resource Royalties",
        rate: 1,
        base: 5, // $5B per 1%
        amount: 5, // $5B
        adjustedAmount: 5,
        rateByYear: {
          2022: 0.8,
          2023: 0.9,
          2024: 1,
          2025: 1.1,
          2026: 1.2,
        },
        minRate: 0,
        maxRate: 10,
        description: "Oil, gas, and mineral royalties.",
        note: "Oil, gas, and mineral royalties (volatile).",
        color: "#B794F4", // purple-400
      },
    },

    // Spending categories including groups and standalone categories
    spendingCategories: {
      healthcare: {
        id: "healthcare",
        name: "Healthcare (CHT)",
        baseAmount: 50.4, // $50.4B (Canada Health Transfer)
        adjustmentFactor: 1,
        description:
          "Canada Health Transfer to provinces and territories for healthcare services.",
        color: "#F56565", // red-500
      },
      seniors: {
        id: "seniors",
        name: "Support for Seniors",
        baseAmount: 76.0, // $76.0B (OAS, GIS, Allowances)
        adjustmentFactor: 1,
        description:
          "Old Age Security, Guaranteed Income Supplement, and other senior support programs.",
        color: "#4299E1", // blue-500
      },
      childrenFamilies: {
        id: "childrenFamilies",
        name: "Children and Families",
        baseAmount: 26.3, // $26.3B (Canada Child Benefit)
        adjustmentFactor: 1,
        description:
          "Canada Child Benefit and other family support programs.",
        color: "#48BB78", // green-500
      },
      indigenousServices: {
        id: "indigenousServices",
        name: "Indigenous Services & Reconciliation",
        baseAmount: 35.5, // $35.5B (ISC & CIRNAC)
        adjustmentFactor: 1,
        description:
          "Services, infrastructure, and reconciliation efforts for Indigenous communities.",
        color: "#ED8936", // orange-500
      },
      employmentInsurance: {
        id: "employmentInsurance",
        name: "Employment Insurance",
        baseAmount: 23.1, // $23.1B (Employment Insurance and Other Benefits)
        adjustmentFactor: 1,
        description:
          "Benefits for unemployed workers, parental leave, and skills training.",
        color: "#9F7AEA", // purple-500
      },
      defensePublicSafety: {
        id: "defensePublicSafety",
        name: "Defense & Public Safety",
        baseAmount: 32.6, // $32.6B (DND, RCMP, CBSA)
        adjustmentFactor: 1,
        description:
          "Military, RCMP, border services, and other security agencies.",
        color: "#38B2AC", // teal-500
      },
      // Loans, Investments & Advances group
      loansInvestments: {
        id: "loansInvestments",
        name: "Loans, Investments & Advances",
        isGroup: true,
        isExpanded: false,
        color: "#ECC94B", // yellow-500
        children: {
          studentLoans: {
            id: "studentLoans",
            name: "Student Loans",
            baseAmount: 24.0, // $24.0B (Canada Student Financial Assistance Program)
            adjustmentFactor: 1,
            description: "Financial assistance for post-secondary education.",
            color: "#ECC94B", // yellow-500
          },
          agricultureLoans: {
            id: "agricultureLoans",
            name: "Agriculture Loans",
            baseAmount: 0.162, // $0.162B (AgriRecovery and other programs)
            adjustmentFactor: 1,
            description: "Support for farmers and agricultural businesses.",
            color: "#ECC94B", // yellow-500
          },
          internationalDevelopment: {
            id: "internationalDevelopment",
            name: "International Development",
            baseAmount: 53.0, // $53.0B (International development loans and grants)
            adjustmentFactor: 1,
            description: "Foreign aid and development assistance.",
            color: "#ECC94B", // yellow-500
          },
          businessInnovation: {
            id: "businessInnovation",
            name: "Business & Innovation",
            baseAmount: 0.6, // $0.6B (Innovation and infrastructure projects)
            adjustmentFactor: 1,
            description:
              "Loans and investments to support business growth and innovation.",
            color: "#ED64A6", // pink-500
          },
          defenseSector: {
            id: "defenseSector",
            name: "Defense Sector",
            baseAmount: 1.45, // $1.45B (Defense sector loans and investments)
            adjustmentFactor: 1,
            description:
              "Investments in defense equipment and technology.",
            color: "#ECC94B", // yellow-500
          },
          economicDevelopment: {
            id: "economicDevelopment",
            name: "Economic Development",
            baseAmount: 0.5, // $0.5B (Regional development programs)
            adjustmentFactor: 1,
            description:
              "Regional development programs and initiatives.",
            color: "#ECC94B", // yellow-500
          },
        },
      },
      // Government Operations group
      governmentOperations: {
        id: "governmentOperations",
        name: "Government Operations",
        isGroup: true,
        isExpanded: false,
        color: "#ED64A6", // pink-500
        children: {
          transportationInfrastructure: {
            id: "transportationInfrastructure",
            name: "Transportation Infrastructure",
            baseAmount: 15.0, // $15.0B
            adjustmentFactor: 1,
            description:
              "Investments in national transportation infrastructure, including roadways, bridges, ports, and rail systems.",
            color: "#ED64A6", // pink-500
          },
          environmentalPrograms: {
            id: "environmentalPrograms",
            name: "Environmental Programs",
            baseAmount: 8.0, // $8.0B
            adjustmentFactor: 1,
            description:
              "Funds dedicated to climate change initiatives, conservation efforts, and environmental protection.",
            color: "#ED64A6", // pink-500
          },
          publicSafetyEmergency: {
            id: "publicSafetyEmergency",
            name: "Public Safety and Emergency Preparedness",
            baseAmount: 9.0, // $9.0B
            adjustmentFactor: 1,
            description:
              "Funding for national security agencies to respond to emergencies and public safety threats.",
            color: "#ED64A6", // pink-500
          },
          governmentBuildings: {
            id: "governmentBuildings",
            name: "Government Buildings and Properties",
            baseAmount: 7.0, // $7.0B
            adjustmentFactor: 1,
            description:
              "Maintenance and construction of government buildings for essential services.",
            color: "#ED64A6", // pink-500
          },
          researchInnovation: {
            id: "researchInnovation",
            name: "Research and Innovation",
            baseAmount: 10.0, // $10.0B
            adjustmentFactor: 1,
            description:
              "Investments in research and development across sectors for scientific advances.",
            color: "#ED64A6", // pink-500
          },
          digitalGovernment: {
            id: "digitalGovernment",
            name: "Digital Government and IT Infrastructure",
            baseAmount: 5.0, // $5.0B
            adjustmentFactor: 1,
            description:
              "Modernizing federal digital services and IT infrastructure.",
            color: "#ED64A6", // pink-500
          },
          federalEmployeeSalaries: {
            id: "federalEmployeeSalaries",
            name: "Federal Employee Salaries and Benefits",
            baseAmount: 35.0, // $35.0B
            adjustmentFactor: 1,
            description:
              "Salaries, pensions, and benefits for federal employees.",
            color: "#ED64A6", // pink-500
          },
          legalJusticeSystem: {
            id: "legalJusticeSystem",
            name: "Legal and Justice System",
            baseAmount: 5.0, // $5.0B
            adjustmentFactor: 1,
            description:
              "Supports the national legal and justice system.",
            color: "#ED64A6", // pink-500
          },
          indigenousServicesOps: {
            id: "indigenousServicesOps",
            name: "Indigenous Services Operational Expenses",
            baseAmount: 4.0, // $4.0B
            adjustmentFactor: 1,
            description:
              "Operational costs for Indigenous Services Canada.",
            color: "#ED64A6", // pink-500
          },
          culturalHeritage: {
            id: "culturalHeritage",
            name: "Cultural and Heritage Programs",
            baseAmount: 2.0, // $2.0B
            adjustmentFactor: 1,
            description:
              "Funding for national cultural institutions and heritage preservation.",
            color: "#ED64A6", // pink-500
          },
          scientificResearch: {
            id: "scientificResearch",
            name: "Scientific Research and Development (R&D)",
            baseAmount: 5.0, // $5.0B
            adjustmentFactor: 1,
            description:
              "Funding for scientific research across various sectors.",
            color: "#ED64A6", // pink-500
          },
          diplomaticRepresentation: {
            id: "diplomaticRepresentation",
            name: "Diplomatic and International Representation",
            baseAmount: 5.0, // $5.0B
            adjustmentFactor: 1,
            description:
              "Operational costs of Global Affairs Canada and diplomatic missions.",
            color: "#ED64A6", // pink-500
          },
        },
      },
    },

    // Fixed costs that cannot be adjusted by users
    fixedCosts: {
      debtServicing: {
        id: "debtServicing",
        name: "Debt Servicing",
        amount: 47.3, // $47.3B (Public Debt Charges)
        description: "Interest payments on the federal debt (fixed cost).",
        color: "#667EEA", // indigo-500
      },
    },

    // Tax Expenditures / Tax Credits
    taxExpenditures: {
      personalTaxCredits: {
        id: "personalTaxCredits",
        name: "Personal Income Tax Credits",
        baseAmount: 120, // $120B gross base
        netAmount: 102, // $102B net (adjusted for interaction)
        interactionFactor: 0.85, // 15% interaction adjustment
        adjustmentFactor: 0, // Default neutral adjustment
        minAdjustment: -100,
        maxAdjustment: 100,
        description:
          "Tax credits and deductions for individuals, including the basic personal amount and charitable donations.",
        linkedRevenueSource: "personalIncomeTax",
        tooltip:
          "Reducing personal tax credits increases revenue; increasing credits reduces revenue.",
        color: "#3182CE", // blue-600
      },
      corporateTaxExpenditures: {
        id: "corporateTaxExpenditures",
        name: "Corporate Tax Expenditures",
        baseAmount: 25, // $25B gross base
        netAmount: 23.75, // $23.75B net (adjusted for interaction)
        interactionFactor: 0.95, // 5% interaction adjustment
        adjustmentFactor: 0,
        minAdjustment: -100,
        maxAdjustment: 100,
        description:
          "Tax credits and deductions for businesses, including R&D credits and small business deductions.",
        linkedRevenueSource: "corporateIncomeTax",
        tooltip:
          "Reducing corporate tax expenditures increases revenue; increasing them reduces revenue.",
        color: "#2C7A7B", // teal-700
      },
      gstExpenditures: {
        id: "gstExpenditures",
        name: "GST/HST Expenditures",
        baseAmount: 22, // $22B gross base
        netAmount: 22, // $22B net (no interaction adjustment)
        interactionFactor: 1,
        adjustmentFactor: 0,
        minAdjustment: -100,
        maxAdjustment: 100,
        description:
          "GST/HST exemptions and zero-rated items including basic groceries and prescription drugs.",
        linkedRevenueSource: "gst",
        tooltip:
          "Reducing GST/HST expenditures increases revenue; increasing them reduces revenue.",
        color: "#DD6B20", // orange-700
      },
      taxDeferrals: {
        id: "taxDeferrals",
        name: "Deferrals (RRSP/RPP/TFSA)",
        baseAmount: 33, // $33B gross base
        netAmount: 24, // $24B net (adjusted for long-term impact)
        interactionFactor: 0.73,
        adjustmentFactor: 0,
        minAdjustment: -100,
        maxAdjustment: 100,
        description:
          "Tax-advantaged savings accounts including RRSPs, Registered Pension Plans, and TFSA.",
        linkedRevenueSource: "personalIncomeTax",
        tooltip:
          "Reducing tax deferrals increases short-term revenue; increasing them reduces current revenue.",
        color: "#805AD5", // purple-600
      },
    },

    // Budget goals and goal status
    budgetGoals: {
      enabled: true,
      revenueTarget: 400, // Target revenue in billions
      deficitTarget: 30, // Target deficit in billions
    },
    goalStatus: {
      revenue: {
        status: "",
        icon: "",
        text: "",
        message: "",
      },
      deficit: {
        status: "",
        icon: "",
        text: "",
        message: "",
      },
    },

    // Current fiscal year
    currentYear: 2024,
    
    // Reactive trigger for spending updates
    lastSpendingUpdate: Date.now(),
    
    // Reactive trigger for tax expenditure updates
    lastTaxExpenditureUpdate: Date.now(),
    
    // Reactive trigger for revenue source updates
    lastRevenueSourceUpdate: Date.now(),
    
    // Budget goals
    lastUpdate: 0,

    // Explicit state for expanded groups
    expandedGroups: {
      incomeTaxes: true,
      consumptionTaxes: true,
      otherRevenues: true,
      mainCategories: true,
      otherCategories: false,
      governmentOperations: false,
      taxExpenditures: true,
    },
    fiscalIndicators: {
      gdp: 2500, // $2.5 trillion (2024 estimate)
      debt: 1173, // $1.173 trillion (2024 estimate)
    },
  }),

  getters: {
    formattedFiscalYear() {
      return `${this.currentYear - 1}-${this.currentYear}`;
    },

    availableFiscalYears() {
      return Object.keys(this.revenueSources.personalIncomeTax.rateByYear)
        .map((year) => parseInt(year))
        .sort()
        .map((year) => ({
          value: year,
          label: `${year - 1}-${year}`,
        }));
    },

    currentDebt() {
      // Add the current year's deficit (if any) to the base debt
      const baseDebt = this.fiscalIndicators?.debt || 0;
      const deficit = this.surplus < 0 ? Math.abs(this.surplus) : 0;
      return baseDebt + deficit;
    },

    debtToGdpRatio() {
      const gdp = this.fiscalIndicators?.gdp || 0;
      const debt = this.currentDebt || 0;
      return gdp && gdp > 0 ? (debt / gdp) * 100 : 0;
    },

    // Unified getter for all consumers (sentiment, badges, export, etc.)
    budgetData() {
      const cacheKey = `budgetData_${this.stateVersion}_${this.lastUpdate}_${this._cacheVersion}`;
      
      if (this._computedCache.has(cacheKey)) {
        return this._computedCache.get(cacheKey);
      }
      
      // Always return a valid structure
      try {
        const result = this.budgetDataForBadges;
        this._computedCache.set(cacheKey, markRaw(result));
        return result;
      } catch (e) {
        handleError(e, (msg) => budgetErrorMessage.value = msg);
        // Fallback: return a minimal valid object if something goes wrong
        // Include default revenue mix values to prevent fiscal chaos warnings
        const fallback = {
          totalRevenue: 0,
          totalSpending: 0,
          surplus: 0,
          revenueMix: {
            personalIncomeTax: this.revenueSources.personalIncomeTax?.rate ?? 21,
            personalIncomeTaxAmount: this.revenueSources.personalIncomeTax?.adjustedAmount ?? 210,
            
            corporateIncomeTax: this.revenueSources.corporateIncomeTax?.rate ?? 15,
            corporateIncomeTaxAmount: this.revenueSources.corporateIncomeTax?.adjustedAmount ?? 80,
            
            gst: this.revenueSources.gst?.rate ?? 5,
            gstAmount: this.revenueSources.gst?.adjustedAmount ?? 50,
            
            carbonPricing: this.revenueSources.carbonPricing?.rate ?? 1,
            carbonPricingAmount: this.revenueSources.carbonPricing?.adjustedAmount ?? 10,
            
            exciseTaxes: this.revenueSources.exciseTaxes?.rate ?? 2.5,
            exciseTaxesAmount: this.revenueSources.exciseTaxes?.adjustedAmount ?? 25,
            
            eiPremiums: this.revenueSources.eiPremiums?.rate ?? 1.35,
            eiPremiumsAmount: this.revenueSources.eiPremiums?.adjustedAmount ?? 13.5,
            
            customsDuties: this.revenueSources.customsDuties?.rate ?? 1,
            customsDutiesAmount: this.revenueSources.customsDuties?.adjustedAmount ?? 10,
            
            crownProfits: this.revenueSources.crownProfits?.rate ?? 2.5,
            crownProfitsAmount: this.revenueSources.crownProfits?.adjustedAmount ?? 25,
            
            nonTaxRevenue: this.revenueSources.nonTaxRevenue?.rate ?? 3,
            nonTaxRevenueAmount: this.revenueSources.nonTaxRevenue?.adjustedAmount ?? 30,
            
            resourceRoyalties: this.revenueSources.resourceRoyalties?.rate ?? 1,
            resourceRoyaltiesAmount: this.revenueSources.resourceRoyalties?.adjustedAmount ?? 10
          },
          taxExpenditures: {},
          budgetItems: {}
        };
        this._computedCache.set(cacheKey, markRaw(fallback));
        return fallback;
      }  
    },

    baselineRevenue() {
      const defaultRates = {
        personalIncomeTax: 21,
        corporateIncomeTax: 15,
        gst: 5,
        exciseTaxes: 2.5,
        carbonPricing: 1,
        eiPremiums: 1.35,
        customsDuties: 1,
        crownProfits: 2.5,
        nonTaxRevenue: 3,
        resourceRoyalties: 1,
      };

      return Object.entries(this.revenueSources).reduce(
        (total, [id, source]) =>
          total + source.base * (defaultRates[id] || source.rate),
        0
      );
    },

    additionalRevenue() {
      return this.totalRevenue - this.baselineRevenue;
    },

    surplus() {
      return this.totalRevenue - this.totalSpending;
    },

    // Category totals for revenue sources
    incomeTaxTotal() {
      // Personal Income Tax + Corporate Income Tax
      const personalIncomeTax = Number(this.revenueSources.personalIncomeTax?.adjustedAmount) || 0;
      const corporateIncomeTax = Number(this.revenueSources.corporateIncomeTax?.adjustedAmount) || 0;
      return personalIncomeTax + corporateIncomeTax;
    },
    
    consumptionTaxTotal() {
      // GST/HST + Excise Taxes + Carbon Pricing + Customs Duties
      const gst = Number(this.revenueSources.gst?.adjustedAmount) || 0;
      const exciseTaxes = Number(this.revenueSources.exciseTaxes?.adjustedAmount) || 0;
      const carbonPricing = Number(this.revenueSources.carbonPricing?.adjustedAmount) || 0;
      const customsDuties = Number(this.revenueSources.customsDuties?.adjustedAmount) || 0;
      return gst + exciseTaxes + carbonPricing + customsDuties;
    },
    
    otherRevenueTotal() {
      // EI Premiums + Crown Corporation Profits + Resource Royalties + Non-Tax Revenue
      const eiPremiums = Number(this.revenueSources.eiPremiums?.adjustedAmount) || 0;
      const crownProfits = Number(this.revenueSources.crownProfits?.adjustedAmount) || 0;
      const resourceRoyalties = Number(this.revenueSources.resourceRoyalties?.adjustedAmount) || 0;
      const nonTaxRevenue = Number(this.revenueSources.nonTaxRevenue?.adjustedAmount) || 0;
      return eiPremiums + crownProfits + resourceRoyalties + nonTaxRevenue;
    },
    
    totalRevenue() {
      // Sum of all category totals
      return this.incomeTaxTotal + this.consumptionTaxTotal + this.otherRevenueTotal;
    },

    mainCategoriesSpending() {
      const mains = Object.values(this.spendingCategories).filter(
        (cat) => !cat.isGroup
      );
      return mains.reduce(
        (total, cat) => total + cat.baseAmount * cat.adjustmentFactor,
        0
      );
    },

    loansInvestmentsSpending() {
      const children = this.spendingCategories.loansInvestments.children;
      return Object.values(children).reduce(
        (total, cat) => total + cat.baseAmount * cat.adjustmentFactor,
        0
      );
    },

    governmentOperationsSpending() {
      const children = this.spendingCategories.governmentOperations.children;
      return Object.values(children).reduce(
        (total, cat) => total + cat.baseAmount * cat.adjustmentFactor,
        0
      );
    },

    otherCategoriesTotal() {
      return this.loansInvestmentsSpending + this.governmentOperationsSpending;
    },

    totalSpending() {
      return this.mainCategoriesSpending + this.otherCategoriesTotal + this.fixedCostsTotal;
    },

    fixedCostsTotal() {
      return Object.values(this.fixedCosts).reduce(
        (total, cost) => total + cost.amount,
        0
      );
    },

    debtServicing() {
      return this.fixedCosts.debtServicing?.amount || 0;
    },

    revenueGoalStatus() {
      if (!this.budgetGoals.enabled || !this.budgetGoals.targetRevenue) {
        return null;
      }
      return this.goalStatus.revenue;
    },

    deficitGoalStatus() {
      if (!this.budgetGoals.enabled || this.budgetGoals.targetDeficit === null) {
        return null;
      }
      return this.goalStatus.deficit;
    },

    isGroupExpanded() {
      return (groupId) => {
        const group = Object.values(this.spendingCategories).find(
          (cat) => cat.id === groupId
        );
        return group && group.isGroup ? group.isExpanded : false;
      };
    },

    getGroupChildren() {
      return (groupId) => {
        const group = Object.values(this.spendingCategories).find(
          (cat) => cat.id === groupId
        );
        return group && group.isGroup ? Object.values(group.children) : [];
      };
    },

    getGroupTotal() {
      return (groupId) => {
        const children = this.getGroupChildren(groupId);
        return children.reduce(
          (total, child) => total + child.baseAmount * child.adjustmentFactor,
          0
        );
      };
    },

    getGroupBaseTotal() {
      return (groupId) => {
        const children = this.getGroupChildren(groupId);
        return children.reduce((total, child) => total + child.baseAmount, 0);
      };
    },

    getGroupFactor() {
      return (groupId) => {
        const children = this.getGroupChildren(groupId);
        if (children.length === 0) return 1;
        const totalAmount = children.reduce((sum, child) => sum + child.baseAmount, 0);
        const weightedFactor = children.reduce((sum, child) => sum + child.baseAmount * child.adjustmentFactor, 0);
        return totalAmount > 0 ? weightedFactor / totalAmount : 1;
      };
    },

    // Badge system getters
    budgetDataForBadges() {
      // Debug logging to identify mismatches (development only)
      devLog('[KEY MAPPING] Store spending categories:', Object.keys(this.spendingCategories));
      
      // Prepare the budget data in the format expected by the badge engine
      const budgetData = {
        totalRevenue: this.totalRevenue,
        totalSpending: this.totalSpending,
        surplus: this.surplus,
        debtServicing: this.debtServicing, // Add debt servicing as a separate field
        // revenueMix: Sent to sentiment scoring and badge systems.
        // Key mapping:
        // - corporateTax is sourced from corporateIncomeTax in the store
        // - gst represents GST/HST combined (no separate hst key)
        // - All keys should match those expected by the sentiment scoring system
        revenueMix: {
          // Include both rate and amount for each revenue source
          personalIncomeTax: this.revenueSources.personalIncomeTax?.rate ?? 21,
          personalIncomeTaxAmount: this.revenueSources.personalIncomeTax?.adjustedAmount ?? 210,
          
          corporateIncomeTax: this.revenueSources.corporateIncomeTax?.rate ?? 15,
          corporateIncomeTaxAmount: this.revenueSources.corporateIncomeTax?.adjustedAmount ?? 80,
          
          gst: this.revenueSources.gst?.rate ?? 5,
          gstAmount: this.revenueSources.gst?.adjustedAmount ?? 50,
          
          hst: this.revenueSources.gst?.rate ?? 5, // If you ever separate HST, update here
          hstAmount: this.revenueSources.gst?.adjustedAmount ?? 50,
          
          exciseTaxes: this.revenueSources.exciseTaxes?.rate ?? 2.5,
          exciseTaxesAmount: this.revenueSources.exciseTaxes?.adjustedAmount ?? 25,
          
          carbonPricing: this.revenueSources.carbonPricing?.rate ?? 1,
          carbonPricingAmount: this.revenueSources.carbonPricing?.adjustedAmount ?? 10,
          
          eiPremiums: this.revenueSources.eiPremiums?.rate ?? 1.35,
          eiPremiumsAmount: this.revenueSources.eiPremiums?.adjustedAmount ?? 13.5,
          
          customsDuties: this.revenueSources.customsDuties?.rate ?? 1,
          customsDutiesAmount: this.revenueSources.customsDuties?.adjustedAmount ?? 10,
          
          crownProfits: this.revenueSources.crownProfits?.rate ?? 2.5,
          crownProfitsAmount: this.revenueSources.crownProfits?.adjustedAmount ?? 25,
          
          nonTaxRevenue: this.revenueSources.nonTaxRevenue?.rate ?? 3,
          nonTaxRevenueAmount: this.revenueSources.nonTaxRevenue?.adjustedAmount ?? 30,
          
          resourceRoyalties: this.revenueSources.resourceRoyalties?.rate ?? 1,
          resourceRoyaltiesAmount: this.revenueSources.resourceRoyalties?.adjustedAmount ?? 10
        },
        taxExpenditures: {
          // Correct key mapping - match the expected badge keys to internal store keys
          personalIncomeTaxCredits: this.taxExpenditures.personalTaxCredits || { adjustmentPercent: 0 },
          corporateTaxExpenditures: this.taxExpenditures.corporateTaxExpenditures || { adjustmentPercent: 0 },
          gstExpenditures: this.taxExpenditures.gstExpenditures || { adjustmentPercent: 0 },
          deferrals: this.taxExpenditures.taxDeferrals || { adjustmentPercent: 0 }
        },
        budgetItems: {
          // Main spending categories with corrected mappings
          healthcare: this.spendingCategories.healthcare?.adjustedAmount ?? 0,
          education: this.spendingCategories.education?.adjustedAmount ?? 0,
          
          // Fixed key mappings for mismatched categories
          childrenAndFamilies: this.spendingCategories.childrenFamilies?.adjustedAmount ?? 0,
          supportForSeniors: this.spendingCategories.seniors?.adjustedAmount ?? 0,
          
          indigenousServices: this.spendingCategories.indigenousServices?.adjustedAmount ?? 0,
          defense: this.spendingCategories.defense?.adjustedAmount ?? 0,
          
          // Other spending categories – standardized keys
          scienceAndInnovation: this.spendingCategories.scienceAndInnovation?.adjustedAmount ?? 0,
          infrastructure: this.spendingCategories.infrastructure?.adjustedAmount ?? 0,
          digitalGovernment: this.spendingCategories.digitalGovernment?.adjustedAmount ?? 0,
          environmentAndClimateChange: this.spendingCategories.environmentAndClimateChange?.adjustedAmount ?? 0,
          carbonPricing: this.spendingCategories.carbonPricing?.adjustedAmount ?? 0,
          agriculture: this.spendingCategories.agriculture?.adjustedAmount ?? 0,
          internationalDevelopment: this.spendingCategories.internationalDevelopment?.adjustedAmount ?? 0,
          culturalPrograms: this.spendingCategories.culturalPrograms?.adjustedAmount ?? 0,
          transit: this.spendingCategories.transit?.adjustedAmount ?? 0,
          economicDevelopment: this.spendingCategories.economicDevelopment?.adjustedAmount ?? 0,
          indigenousOperations: this.spendingCategories.indigenousOperations?.adjustedAmount ?? 0,
          diplomaticRepresentation: this.spendingCategories.diplomaticRepresentation?.adjustedAmount ?? 0
        }
      };
      
      // Debug log the mapped data (development only)
      devLog('[KEY MAPPING] Mapped budget data for badges:', {
        revenueKeyCount: Object.keys(budgetData.revenueMix).length,
        expenditureKeyCount: Object.keys(budgetData.taxExpenditures).length,
        spendingCategoryKeyCount: Object.keys(budgetData.budgetItems).length
      });
      
      return budgetData;
    },

    earnedBadges() {
      return this.badges;
    },

    // Optimized revenue sources with shallow reactivity
    optimizedRevenueSources() {
      if (!this._reactiveUpdates) {
        return markRaw(this.revenueSources);
      }
      return this.revenueSources;
    },
  },

  actions: {
    setSentimentUpdateRequired(val = true) {
      this.sentimentUpdateRequired = val;
    },
    clearSentimentDirty() {
      this.sentimentUpdateRequired = false;
    },
    triggerSentimentUpdate() {
      // Update the lastSentimentUpdate timestamp to force reactivity
      this.lastSentimentUpdate = Date.now();
      console.log('[STORE] Triggered sentiment update:', this.lastSentimentUpdate);
    },
    beginBatchUpdate() {
      if (this.isBatchUpdateInProgress) {
        console.warn('[STORE] Batch update already in progress');
        return false;
      }
      
      this._batchUpdateDepth++;
      this.isBatchUpdateInProgress = true;
      this._reactiveUpdates = false; // Disable reactive updates during batch
      this._pendingUpdates.clear();
      
      console.log('[STORE] Beginning batch update');
      // Disable sentiment updates during batch operations
      this.setSentimentUpdateRequired(false);
      return true;
    },
    completeBatchUpdate() {
      if (!this.isBatchUpdateInProgress) {
        console.warn('[STORE] No batch update in progress');
        return false;
      }
      
      this._batchUpdateDepth--;
      
      if (this._batchUpdateDepth === 0) {
        console.log('[STORE] Completing batch update');
        
        // Perform all recalculations once
        this.recalculateTotals();
        
        // Clear cache to force recomputation
        this._computedCache.clear();
        this._cacheVersion++;
        
        // Update state version to trigger reactivity
        this.stateVersion++;
        console.log(`[STORE] State version updated to ${this.stateVersion}`);
        
        // Re-enable reactive updates
        this._reactiveUpdates = true;
        
        // Enable sentiment updates and trigger a calculation
        this.setSentimentUpdateRequired(true);
        this.triggerSentimentUpdate();
        
        // Sync to localStorage to ensure UI components can refresh
        this.syncToLocalStorage();
        
        this.isBatchUpdateInProgress = false;
      }
      
      return true;
    },
    initializeStore() {
      // Initialize with default values if not already loaded
      if (!this.loadFromLocalStorage()) {
        // Initialize revenue sources immutably
        const initialRevenueSources = {};
        for (const sourceId in this.revenueSources) {
          const source = this.revenueSources[sourceId];
          initialRevenueSources[sourceId] = {
            ...source,
            amount: source.base * source.rate,
            adjustedAmount: source.base * source.rate,
            expenditureImpact: 0
          };
        }
        this.revenueSources = initialRevenueSources;

        // Initialize tax expenditures immutably
        const initialExpenditures = {};
        for (const expId in this.taxExpenditures) {
          const exp = this.taxExpenditures[expId];
          initialExpenditures[expId] = {
            ...exp,
            adjustment: exp.baseAdjustment || 0,
            revenueImpact: 0
          };
        }
        this.taxExpenditures = initialExpenditures;

        // Update all revenue sources to account for tax expenditure impacts
        for (const sourceId in this.revenueSources) {
          this.updateRevenueSourceAdjustedAmount(sourceId);
        }

        // Save initial state
        this.syncToLocalStorage();
      }

      // Signal initialization complete
      this.lastUpdate = Date.now();
    },
    
    // Load budget data from localStorage
    loadFromLocalStorage() {
      try {
        const storedData = localStorage.getItem("budgetSimulator");
        if (storedData) {
          // Optionally, parse and restore any desired parts of the state:
          const parsedData = JSON.parse(storedData);
          this.activePreset = parsedData.activePreset || null;
          
          // Restore fixed costs if they exist in storage
          if (parsedData.fixedCosts) {
            this.fixedCosts = { ...this.fixedCosts, ...parsedData.fixedCosts };
          }
          
          // If you want to restore other properties, you can set them here:
          // e.g., this.badges = parsedData.badges || [];
          console.log("Loaded budget from localStorage:", parsedData);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error loading budget from localStorage:", error);
        return false;
      }
    },
  
    setCurrentYear(year) {
      // Update revenue sources immutably with year-specific rates
      const updatedSources = {};
      for (const sourceId in this.revenueSources) {
        const source = this.revenueSources[sourceId];
        if (source.rateByYear && source.rateByYear[year] !== undefined) {
          updatedSources[sourceId] = {
            ...source,
            rate: source.rateByYear[year],
            amount: source.base * source.rateByYear[year],
            adjustedAmount: source.base * source.rateByYear[year]
          };
        } else {
          updatedSources[sourceId] = source;
        }
      }

      // Update state immutably
      this.currentYear = year;
      this.revenueSources = updatedSources;

      // Update adjusted amounts for all sources
      for (const sourceId in this.revenueSources) {
        this.updateRevenueSourceAdjustedAmount(sourceId);
      }

      // Signal update
      this.lastUpdate = Date.now();
    },

    toggleGroupExpansion(groupId) {
      const group = Object.values(this.spendingCategories).find(
        (cat) => cat.id === groupId
      );
      if (group && group.isGroup) {
        group.isExpanded = !group.isExpanded;
      }
      // Update explicit expandedGroups state as needed
      this.expandedGroups = { ...this.expandedGroups, [groupId]: group ? group.isExpanded : false };
    },

    /**
     * Canonical method for updating revenue source rates with proper reactivity
     * @param {string} sourceId - The ID of the revenue source to update
     * @param {number} newRate - The new rate to set
     * @returns {boolean} - Success flag
     */
    setRevenueRate(sourceId, newRate) {
      const source = this.revenueSources[sourceId];
      if (!source) {
        devWarn(`Revenue source not found: ${sourceId}`);
        return false;
      }
      
      // Clamp the rate to valid range if min/max are defined
      let clampedRate = newRate;
      if (source.minRate !== undefined) {
        clampedRate = Math.max(source.minRate, clampedRate);
      }
      if (source.maxRate !== undefined) {
        clampedRate = Math.min(source.maxRate, clampedRate);
      }
      
      // Create a shallow copy of the source for reactive updates
      const updatedSource = { ...source };
      
      // Update the rate and recalculate the amount
      updatedSource.rate = clampedRate;
      updatedSource.amount = updatedSource.base * updatedSource.rate;
      
      // Special logging for carbon tax to help diagnose issues
      if (sourceId === 'carbonPricing') {
        devLog(`[CARBON TAX] Updating rate from ${source.rate} to ${clampedRate}, batch mode: ${this.isBatchUpdateInProgress}`);
      } else {
        devLog(`Updating revenue source ${sourceId} rate from ${source.rate} to ${clampedRate}`);
      }
      
      // Update the rate history for the current year
      if (updatedSource.rateByYear) {
        updatedSource.rateByYear = { ...updatedSource.rateByYear };
        updatedSource.rateByYear[this.currentYear] = clampedRate;
      }
      
      // Update the revenue source reactively
      this.revenueSources = {
        ...this.revenueSources,
        [sourceId]: updatedSource
      };
      
      // Update the adjusted amount (accounting for tax expenditure impacts)
      this.updateRevenueSourceAdjustedAmount(sourceId);
      
      // Only perform additional updates if not in batch mode
      if (!this.isBatchUpdateInProgress) {
        // Recalculate totals for display
        this.recalculateTotals();
        
        // Update the reactive triggers to force component updates
        this.lastRevenueSourceUpdate = Date.now();
        this.lastUpdate = Date.now();
        
        // Signal that sentiment update is needed
        this.setSentimentUpdateRequired(true);
        
        // Sync to localStorage
        this.syncToLocalStorage();
        
        devLog(`Updated revenue source ${sourceId} rate to ${clampedRate}%, amount: ${this.revenueSources[sourceId].amount.toFixed(2)}B, adjusted: ${this.revenueSources[sourceId].adjustedAmount?.toFixed(2)}B`);
      }
      
      return true;
    },
    
    /**
     * Legacy method for backward compatibility - delegates to setRevenueRate
     * @deprecated Use setRevenueRate instead
     */
    updateRevenueRate(sourceId, newRate) {
      const currentRate = this.revenueSources[sourceId]?.rate;
      
      // Only update if value actually changed
      if (currentRate === newRate) {
        return true;
      }
      
      if (this.isBatchUpdateInProgress) {
        this._pendingUpdates.add(`revenue_${sourceId}`);
      }
      
      this.isUpdating = true;
      try {
        const result = this.setRevenueRate(sourceId, newRate);
        
        // Auto-save state after successful update
        this.autoSaveState();
        
        return result;
      } finally {
        this.isUpdating = false;
      }
    },

    // Debounced update method for frequent changes
    debouncedUpdateRevenueRate: debounce(function(sourceId, newRate) {
      this.updateRevenueRate(sourceId, newRate);
    }, 100),

    // Clear cache when needed
    clearCache() {
      this._computedCache.clear();
      this._cacheVersion++;
    },

    recalculateTotals() {
      // Update all revenue sources to reflect current tax expenditures
      Object.keys(this.revenueSources).forEach((id) => {
        this.updateRevenueSourceAdjustedAmount(id);
      });
      
      // Update the reactive triggers to force component updates
      this.lastTaxExpenditureUpdate = Date.now();
      this.lastRevenueSourceUpdate = Date.now();
      
      // Update the goal status if goals are enabled
      if (this.budgetGoals.enabled) {
        this.updateGoalStatus();
      }
      
      // Update badges based on current budget
      this.updateBadges();
      
      // If auto-balance is active, attempt to balance the budget
      // But avoid infinite recursion by checking a flag
      if (this.autoBalanceActive && !this._isRecalculating) {
        this._isRecalculating = true;
        
        try {
          // If we have a target deficit, use goal-based balancing
          if (this.budgetGoals.enabled && this.budgetGoals.targetDeficit !== null) {
            // Call autoBalanceBudgetForGoal directly
            this.autoBalanceBudgetForGoal();
          } else {
            // Otherwise use regular auto-balance
            this.autoBalanceBudget();
          }
        } finally {
          this._isRecalculating = false;
        }
      }
      
      // Check for deficit/surplus limits
      const currentSurplus = this.surplus;
      if (currentSurplus > 50) {
        console.warn(`Surplus exceeds $50B limit: $${currentSurplus.toFixed(1)}B`);
      } else if (currentSurplus < -50) {
        console.warn(`Deficit exceeds $50B limit: $${-currentSurplus.toFixed(1)}B`);
      }
    },

    updateSpendingFactor(categoryId, factor) {
      let found = false;
      // Update in main categories
      Object.values(this.spendingCategories).forEach((cat) => {
        if (cat.id === categoryId && !cat.isGroup) {
          cat.adjustmentFactor = factor;
          found = true;
        }
      });
      // Update in group children if not found
      if (!found) {
        Object.values(this.spendingCategories)
          .filter((cat) => cat.isGroup && cat.children)
          .forEach((group) => {
            const child = Object.values(group.children).find(
              (c) => c.id === categoryId
            );
            if (child) {
              child.adjustmentFactor = factor;
            }
          });
      }
      // Only update timestamps if not in batch mode
      if (!this.isBatchUpdateInProgress) {
        this.lastUpdate = Date.now();
        // Signal that sentiment update is needed
        this.setSentimentUpdateRequired(true);
      }
    },

    updateGroupSpendingFactor(groupId, factor) {
      const group = Object.values(this.spendingCategories).find(
        (cat) => cat.id === groupId
      );
      if (group && group.isGroup && group.children) {
        Object.values(group.children).forEach((child) => {
          child.adjustmentFactor = factor;
        });
        // Only update timestamps if not in batch mode
        if (!this.isBatchUpdateInProgress) {
          this.lastUpdate = Date.now();
          // Signal that sentiment update is needed
          this.setSentimentUpdateRequired(true);
        }
      }
    },

    updateBudgetGoals(goals) {
      if (goals.enabled !== undefined) this.budgetGoals.enabled = goals.enabled;
      if (goals.revenueTarget !== undefined)
        this.budgetGoals.revenueTarget = goals.revenueTarget;
      if (goals.deficitTarget !== undefined)
        this.budgetGoals.deficitTarget = goals.deficitTarget;
    },

    updateGoalStatus(statusData = {}) {
      const revenueGoal = this.budgetGoals.revenueTarget || 0;
      const currentRevenue = this.totalRevenue || 0;
      const revenueStatus =
        revenueGoal > 0 ? (currentRevenue / revenueGoal) * 100 : 100;

      const deficitGoal = this.budgetGoals.deficitTarget || 0;
      const currentDeficit = this.surplus < 0 ? Math.abs(this.surplus) : 0;
      const deficitStatus =
        deficitGoal > 0
          ? currentDeficit <= deficitGoal
            ? 100
            : (deficitGoal / currentDeficit) * 100
          : currentDeficit === 0
          ? 100
          : 0;

      this.goalStatus = {
        revenue: statusData.revenue || revenueStatus,
        deficit: statusData.deficit || deficitStatus,
      };
    },

    autoBalanceBudget() {
      // Prevent recursive calls
      if (this._isRecalculating) {
        console.log('Avoiding recursive auto-balance call');
        return;
      }
      
      try {
        this._isRecalculating = true;
        
        // Calculate the current deficit
        const currentDeficit = this.totalSpending - this.totalRevenue;
        
        // If there's no deficit or a surplus, no need to balance
        if (currentDeficit <= 0) {
          console.log('Budget already balanced or in surplus');
          return;
        }
        
        console.log(`Attempting to balance budget. Current deficit: $${currentDeficit.toFixed(1)}B`);
        
        // Define priority order for revenue sources to adjust
        const prioritySourceIds = [
          'personalIncomeTax',  // First choice: adjust personal income tax
          'corporateIncomeTax', // Second choice: adjust corporate income tax
          'gst',                // Third choice: adjust GST
          'carbonPricing',      // Fourth choice: adjust carbon pricing
          'exciseTaxes',        // Fifth choice: adjust excise taxes
          'customsDuties',      // Sixth choice: adjust customs duties
          'resourceRoyalties',  // Seventh choice: adjust resource royalties
          'nonTaxRevenue'       // Eighth choice: adjust non-tax revenue
        ];
        
        // Filter to get only available and adjustable revenue sources
        const adjustableSources = prioritySourceIds
          .map(id => ({
            id,
            ...this.revenueSources[id]
          }))
          .filter(source => source && source.base > 0 && source.rate < (source.maxRate || 100));
        
        if (adjustableSources.length === 0) {
          console.log('No adjustable revenue sources found');
          return;
        }
        
        // Calculate how much deficit remains to be covered
        let remainingDeficit = currentDeficit;
        let adjustedSources = [];
        
        // First try to adjust one major source if it can cover most of the deficit
        for (const source of adjustableSources) {
          // Calculate how much additional revenue this source can generate
          const currentRevenue = source.amount;
          const maxPossibleRevenue = source.base * (source.maxRate || 100);
          const additionalRevenuePotential = maxPossibleRevenue - currentRevenue;
          
          // If this source alone can cover at least 70% of the deficit, use it
          if (additionalRevenuePotential >= remainingDeficit * 0.7) {
            // Calculate the new rate needed to cover the deficit
            const rateIncrease = remainingDeficit / source.base;
            const newRate = Math.min(source.rate + rateIncrease, source.maxRate || 100);
            
            console.log(`Adjusting ${source.name} rate from ${source.rate.toFixed(1)}% to ${newRate.toFixed(1)}%`);
            
            // Update the revenue source rate
            this.setRevenueRate(source.id, newRate);
            adjustedSources.push(source.name);
            
            // The deficit is now covered
            remainingDeficit = 0;
            break;
          }
        }
        
        // If we still have a deficit, adjust multiple sources
        if (remainingDeficit > 0) {
          // Sort sources by their potential to generate additional revenue
          adjustableSources.sort((a, b) => {
            const aPotential = a.base * ((a.maxRate || 100) - a.rate);
            const bPotential = b.base * ((b.maxRate || 100) - b.rate);
            return bPotential - aPotential; // Sort in descending order
          });
          
          // Adjust sources one by one until the deficit is covered
          for (const source of adjustableSources) {
            // Skip sources we've already adjusted
            if (adjustedSources.includes(source.name)) continue;
            
            // Calculate how much additional revenue this source can generate
            const currentRevenue = source.amount;
            const maxPossibleRevenue = source.base * (source.maxRate || 100);
            const additionalRevenuePotential = maxPossibleRevenue - currentRevenue;
            
            // If this source can help reduce the deficit
            if (additionalRevenuePotential > 0) {
              // Determine how much of the remaining deficit this source should cover
              const deficitToCover = Math.min(remainingDeficit, additionalRevenuePotential);
              
              // Calculate the new rate needed
              const rateIncrease = deficitToCover / source.base;
              const newRate = Math.min(source.rate + rateIncrease, source.maxRate || 100);
              
              console.log(`Adjusting ${source.name} rate from ${source.rate.toFixed(1)}% to ${newRate.toFixed(1)}%`);
              
              // Update the revenue source rate
              this.setRevenueRate(source.id, newRate);
              adjustedSources.push(source.name);
              
              // Update the remaining deficit
              remainingDeficit -= deficitToCover;
              
              // If we've covered the deficit, we can stop
              if (remainingDeficit <= 0.1) break;
            }
          }
        }
        
        // Signal update
        this.lastUpdate = Date.now();
        
        if (adjustedSources.length > 0) {
          console.log(`Budget auto-balanced by adjusting ${adjustedSources.length} revenue source(s): ${adjustedSources.join(', ')}`);
        } else {
          console.log('Could not auto-balance the budget with available revenue sources');
        }
      } catch (e) {
        console.error('Error in autoBalanceBudget:', e);
      } finally {
        // Reset the reentrancy guard
        this._isRecalculating = false;
      }
    },

    toggleAutoBalance(active) {
      // Update the store state
      this.autoBalanceActive = active;

      // Diagnostic logging
      console.log('[AutoBalance] toggleAutoBalance called with:', {
        active,
        goalsEnabled: this.budgetGoals.enabled,
        targetDeficit: this.budgetGoals.targetDeficit
      });

      // Make sure budget goals are enabled when auto-balance is activated
      if (active && !this.budgetGoals.enabled) {
        this.budgetGoals.enabled = true;
      }

      // If auto-balance is now enabled, balance the budget
      if (this.autoBalanceActive) {
        // If goals are enabled but targetDeficit is null/undefined, default to zero
        if (this.budgetGoals.enabled && (this.budgetGoals.targetDeficit === null || this.budgetGoals.targetDeficit === undefined)) {
          console.log('[AutoBalance] budgetGoals.targetDeficit was not set; defaulting to 0');
          this.budgetGoals.targetDeficit = 0;
        }
        if (this.budgetGoals.enabled && this.budgetGoals.targetDeficit !== null && this.budgetGoals.targetDeficit !== undefined) {
          console.log("[AutoBalance] Using goal-based auto-balance (target deficit mode)");
          const feedback = this.autoBalanceBudgetForGoal();
          if (feedback && feedback.message) {
            console.log(`[AutoBalance] Result: ${feedback.message}`);
          }
        } else {
          console.log("[AutoBalance] Using standard auto-balance (no target deficit)");
          this.autoBalanceBudget();
        }
      }
    },

    /**
     * Auto-balance the budget to meet a specific deficit goal
     * @returns {Object} Feedback object with success flag and message
     */
    autoBalanceBudgetForGoal() {
      const feedback = {
        success: false,
        message: '',
        achieved: false,
        deficitGap: 0,
        revenueGap: 0
      };
      
      try {
        this.beginBatchUpdate();
        
        // Ensure budget goals are enabled
        this.budgetGoals.enabled = true;
        
        // Set default target deficit if not set
        if (this.budgetGoals.targetDeficit === null || this.budgetGoals.targetDeficit === undefined) {
          this.budgetGoals.targetDeficit = 0;
        }
        
        // Calculate revenue adjustment needed
        let revenueAdjustmentNeeded = 0;
        if (this.budgetGoals.targetRevenue !== null && this.budgetGoals.targetRevenue !== undefined) {
          revenueAdjustmentNeeded = this.budgetGoals.targetRevenue - this.totalRevenue;
          feedback.revenueGap = Math.abs(revenueAdjustmentNeeded);
        }
        
        // Calculate deficit adjustment needed
        const targetDeficit = this.budgetGoals.targetDeficit;
        const currentDeficit = this.totalSpending - this.totalRevenue;
        const deficitAdjustmentNeeded = currentDeficit - targetDeficit;
        feedback.deficitGap = Math.abs(deficitAdjustmentNeeded);
        
        // If we have both targets, prioritize revenue target
        const adjustmentNeeded = this.budgetGoals.targetRevenue !== null ? 
          revenueAdjustmentNeeded : deficitAdjustmentNeeded;
        
        devLog(`Need to adjust revenue by $${adjustmentNeeded.toFixed(1)}B to reach target`);
        
        // If we're already close enough, don't adjust
        if (Math.abs(adjustmentNeeded) < 0.1) {
          devLog('Already at target, no adjustment needed');
          feedback.success = true;
          feedback.achieved = true;
          feedback.message = 'Already at target';
          return feedback;
        }
        
        // Define the main revenue sources eligible for adjustment
        const mainRevenueSources = [
          'personalIncomeTax',
          'corporateIncomeTax',
          'gst',
          'exciseTaxes',
          'carbonPricing',
          'eiPremiums',
          'customsDuties'
        ];
        
        // Filter to those that exist and have a valid base value
        const adjustableSources = mainRevenueSources
          .map(id => ({
            id,
            ...this.revenueSources[id]
          }))
          .filter(source => source && source.base > 0);
        
        if (adjustableSources.length === 0) {
          feedback.success = false;
          feedback.message = 'No adjustable revenue sources found';
          return feedback;
        }
        
        // Use the adjustRevenueProportionally helper method
        const result = this.adjustRevenueProportionally(adjustmentNeeded, adjustableSources);
        
        if (!result.success) {
          feedback.success = false;
          feedback.message = result.message || 'Failed to adjust revenue sources';
          return feedback;
        }
        
        // Check if we achieved the target
        const finalRevenue = this.totalRevenue;
        const finalDeficit = this.totalSpending - finalRevenue;
        
        // Check revenue target achievement
        if (this.budgetGoals.targetRevenue !== null) {
          const revenueGap = Math.abs(finalRevenue - this.budgetGoals.targetRevenue);
          const revenueThreshold = this.budgetGoals.targetRevenue * 0.05; // 5% threshold
          feedback.achieved = revenueGap <= revenueThreshold;
          
          if (!feedback.achieved) {
            feedback.success = false;
            feedback.message = `Auto-balance could not reach the revenue target (off by $${revenueGap.toFixed(2)}B). Some sliders may be at their min/max bounds.`;
            devWarn(`[AutoBalance] Could not reach revenue target. Gap: $${revenueGap.toFixed(2)}B`);
          } else {
            feedback.success = true;
            feedback.message = 'Auto-balance succeeded in reaching revenue target.';
          }
        } else {
          // Check deficit target achievement
          const deficitGap = Math.abs(finalDeficit - targetDeficit);
          const thresholdAchieved = 0.5; // $0.5B threshold for considering goal achieved
          feedback.achieved = deficitGap <= thresholdAchieved;
          
          if (!feedback.achieved) {
            feedback.success = false;
            feedback.message = `Auto-balance could not reach the deficit target (off by $${deficitGap.toFixed(2)}B). Some sliders may be at their min/max bounds.`;
            devWarn(`[AutoBalance] Could not reach deficit target. Gap: $${deficitGap.toFixed(2)}B`);
          } else {
            feedback.success = true;
            feedback.message = 'Auto-balance succeeded in reaching deficit target.';
          }
        }
        
        return feedback;
      } catch (err) {
        feedback.success = false;
        feedback.message = `Error in autoBalanceBudgetForGoal: ${err.message || err}`;
        console.error(feedback.message);
        return feedback;
      } finally {
        this.completeBatchUpdate();
      }
    },

    /**
     * Helper method to adjust revenue sources proportionally to meet a target adjustment amount
     * @param {number} totalAdjustment - Dollar amount to adjust (positive = increase, negative = decrease)
     * @param {Array} adjustableSources - Array of revenue sources that can be adjusted
     * @returns {Object} - Result with success flag and details of changes
     */
    adjustRevenueProportionally(totalAdjustment, adjustableSources) {
      // Skip if adjustment is negligible
      if (Math.abs(totalAdjustment) < 1e-2) {
        return { success: true, changes: {}, message: 'No adjustment needed' };
      }
      
      // Prepare result object
      const result = {
        success: true,
        changes: {},
        actualAdjustment: 0,
        message: ''
      };
      
      // Validate inputs
      if (!Array.isArray(adjustableSources) || adjustableSources.length === 0) {
        return {
          success: false,
          changes: {},
          message: 'No adjustable revenue sources available'
        };
      }
      
      try {
        // Step 1: Prioritize PIT if configured to do so
        let remainingAdjustment = totalAdjustment;
        if (this.autoBalanceConfig.prioritizePIT) {
          const pitSource = adjustableSources.find(item => item.id === 'personalIncomeTax');
          if (pitSource) {
            const oldRate = pitSource.rate;
            const pitBase = pitSource.base;
            const pitMax = pitSource.maxRate !== undefined ? pitSource.maxRate : 100;
            const pitMin = pitSource.minRate !== undefined ? pitSource.minRate : 0;
            
            // Allocate 50% of the total adjustment to PIT
            const targetPitAdjustment = totalAdjustment * 0.5;
            let rateChange = targetPitAdjustment / pitBase;
            let newRate = Math.min(Math.max(oldRate + rateChange, pitMin), pitMax);
            
            // Calculate actual change after clamping
            rateChange = newRate - oldRate;
            const actualPitAdjustment = rateChange * pitBase;
            
            // Store the change
            result.changes[pitSource.id] = {
              oldRate,
              newRate,
              amountChange: actualPitAdjustment
            };
            
            // Update remaining adjustment needed
            remainingAdjustment -= actualPitAdjustment;
            result.actualAdjustment += actualPitAdjustment;
            
            // Apply the change
            this.setRevenueRate(pitSource.id, newRate);
            
            devLog(`[AutoBalance] PIT: ${oldRate.toFixed(3)} → ${newRate.toFixed(3)} | Δ$${actualPitAdjustment.toFixed(2)}B`);
          }
        }

        // Step 2: Distribute remaining adjustment to other sources proportionally
        if (Math.abs(remainingAdjustment) > 1e-2) {
          // Filter sources, excluding PIT if we already adjusted it
          const otherSources = this.autoBalanceConfig.prioritizePIT
            ? adjustableSources.filter(item => item.id !== 'personalIncomeTax')
            : adjustableSources;
          
          if (otherSources.length === 0) {
            devLog('[AutoBalance] No other adjustable sources found for remaining adjustment');
          } else {
            // Calculate total base for proportional distribution
            const totalBase = otherSources.reduce((sum, item) => sum + item.base, 0);
            
            if (totalBase <= 0) {
              devLog('[AutoBalance] Warning: Total base for remaining sources is zero or negative');
            } else {
              // Calculate and apply changes for each source
              otherSources.forEach(item => {
                const oldRate = item.rate;
                const base = item.base;
                const maxRate = item.maxRate !== undefined ? item.maxRate : 100;
                const minRate = item.minRate !== undefined ? item.minRate : 0;
                
                // Calculate proportional adjustment based on this source's share of the total base
                const share = base / totalBase;
                let targetAdjustment = remainingAdjustment * share;
                let rateChange = targetAdjustment / base;
                let newRate = Math.min(Math.max(oldRate + rateChange, minRate), maxRate);
                
                // Calculate actual adjustment after clamping
                rateChange = newRate - oldRate;
                const actualAdjustment = rateChange * base;
                
                // Store the change
                result.changes[item.id] = {
                  oldRate,
                  newRate,
                  amountChange: actualAdjustment
                };
                
                result.actualAdjustment += actualAdjustment;
                
                // Apply the change
                this.setRevenueRate(item.id, newRate);
                
                devLog(`[AutoBalance] ${item.name || item.id}: ${oldRate.toFixed(3)} → ${newRate.toFixed(3)} | Δ$${actualAdjustment.toFixed(2)}B`);
              });
            }
          }
        }
        
        // Check if we achieved a sufficient portion of the requested adjustment
        const achievementRatio = Math.abs(result.actualAdjustment / totalAdjustment);
        result.success = achievementRatio >= 0.8; // Success if we achieved at least 80% of the target
        
        if (!result.success) {
          result.message = `Revenue adjustment achieved only ${(achievementRatio * 100).toFixed(1)}% of target`;
        }
        
        return result;
      } catch (err) {
        devWarn('[AutoBalance] Error in adjustRevenueProportionally:', err);
        return {
          success: false,
          changes: {},
          message: `Error adjusting revenue: ${err.message || err}`
        };
      }
    },
    
    /**
     * Helper method to adjust spending categories proportionally to meet a target adjustment amount
     * @param {number} totalAdjustment - Dollar amount to adjust (positive = increase, negative = decrease)
     * @returns {Object} - Result with success flag and details of changes
     */
    adjustSpendingProportionally(totalAdjustment) {
      // Skip if adjustment is negligible
      if (Math.abs(totalAdjustment) < 1e-2) {
        return { success: true, changes: {}, message: 'No adjustment needed' };
      }
      
      // Prepare result object
      const result = {
        success: true,
        changes: {},
        actualAdjustment: 0,
        message: ''
      };
      
      try {
        // Find all non-group spending categories
        const adjustableCategories = Object.entries(this.spendingCategories)
          // eslint-disable-next-line no-unused-vars
          .filter(([id, category]) => !category.isGroup && category.baseAmount > 0)
          .map(([id, category]) => ({ id, category }));
        
        if (adjustableCategories.length === 0) {
          return {
            success: false,
            changes: {},
            message: 'No adjustable spending categories available'
          };
        }
        
        // Calculate total base amount for proportional distribution
        const totalBaseAmount = adjustableCategories.reduce(
          (sum, item) => sum + item.category.baseAmount,
          0
        );
        
        if (totalBaseAmount <= 0) {
          return {
            success: false,
            changes: {},
            message: 'Total base amount for spending categories is zero or negative'
          };
        }
        
        // Calculate and apply changes for each category
        adjustableCategories.forEach(item => {
          const oldFactor = item.category.adjustmentFactor || 1;
          const baseAmount = item.category.baseAmount;
          
          // Calculate proportional adjustment
          const share = baseAmount / totalBaseAmount;
          const targetAdjustment = totalAdjustment * share;
          
          // Calculate new factor: current factor + ($ change / base amount)
          let factorChange = targetAdjustment / baseAmount;
          let newFactor = oldFactor + factorChange;
          
          // Clamp to configured min/max factor values
          newFactor = Math.max(this.autoBalanceConfig.minSpendingFactor, 
                      Math.min(this.autoBalanceConfig.maxSpendingFactor, newFactor));
          
          // Calculate actual adjustment after clamping
          factorChange = newFactor - oldFactor;
          const actualAdjustment = factorChange * baseAmount;
          
          // Store the change
          result.changes[item.id] = {
            oldFactor,
            newFactor,
            amountChange: actualAdjustment
          };
          
          result.actualAdjustment += actualAdjustment;
          
          devLog(`[AutoBalance] Spending ${item.id}: ${oldFactor.toFixed(3)} → ${newFactor.toFixed(3)} | Δ$${actualAdjustment.toFixed(2)}B`);
        });
        
        // Check if we achieved a sufficient portion of the requested adjustment
        const achievementRatio = Math.abs(result.actualAdjustment / totalAdjustment);
        result.success = achievementRatio >= 0.8; // Success if we achieved at least 80% of the target
        
        if (!result.success) {
          result.message = `Spending adjustment achieved only ${(achievementRatio * 100).toFixed(1)}% of target`;
        }
        
        return result;
      } catch (err) {
        devWarn('[AutoBalance] Error in adjustSpendingProportionally:', err);
        return {
          success: false,
          changes: {},
          message: `Error adjusting spending: ${err.message || err}`
        };
      }
    },
    
    resetBudget() {
      devLog('Starting budget reset...');
      
      // Store the current auto-balance state to log it
      const wasAutoBalanceActive = this.autoBalanceActive;
      if (wasAutoBalanceActive) {
        devLog('Auto-Balance was active - disabling it for reset');
      }
      
      // Disable auto-balance first to prevent it from interfering with the reset
      // This must happen before any other changes
      this.autoBalanceActive = false;
      
      // Reset active preset
      this.activePreset = null;
      
      // Clear badges
      this.badges = [];
      
      // Ensure currentYear is set to the default value
      if (!this.currentYear) {
        this.currentYear = 2024;
      }
      
      // Skip automatic recalculation to ensure we maintain exact values
      this._isRecalculating = true; // Prevent recursive calls
      
      try {
        // Define exact original values for all revenue sources
        const sources = {
          // Income Taxes: 290B total (210 + 80)
          personalIncomeTax: { rate: 21, amount: 210, adjustedAmount: 210 },
          corporateIncomeTax: { rate: 15, amount: 80, adjustedAmount: 80 },
          
          // Consumption Taxes: 76B total (50 + 12 + 8 + 6)
          gst: { rate: 5, amount: 50, adjustedAmount: 50 },
          exciseTaxes: { rate: 2.5, amount: 12, adjustedAmount: 12 },
          carbonPricing: { rate: 1, amount: 8, adjustedAmount: 8 },
          customsDuties: { rate: 1, amount: 6, adjustedAmount: 6 },
          
          // Other Revenue: 68B total (27 + 6 + 5 + 30)
          eiPremiums: { rate: 1.35, amount: 27, adjustedAmount: 27 },
          crownProfits: { rate: 2.5, amount: 6, adjustedAmount: 6 },
          resourceRoyalties: { rate: 1, amount: 5, adjustedAmount: 5 },
          nonTaxRevenue: { rate: 3, amount: 30, adjustedAmount: 30 }
        };
        
        // Calculate expected total dynamically instead of hardcoding it
        const expectedTotal = Object.values(sources).reduce((total, source) => total + source.amount, 0);
        devLog(`Expected total revenue after reset: ${expectedTotal}B`);

        // Create a new shallow copy of revenue sources to maintain reactivity
        const resetSources = { ...this.revenueSources };
        
        // Reset each revenue source individually to preserve all properties
        Object.keys(sources).forEach(sourceId => {
          if (resetSources[sourceId]) {
            const source = sources[sourceId];
            
            // Create a shallow copy of each source to maintain reactivity
            resetSources[sourceId] = {
              ...resetSources[sourceId],
              rate: source.rate,
              amount: source.amount,
              adjustedAmount: source.adjustedAmount,
              expenditureImpact: 0
            };
            
            devLog(`Reset ${sourceId} to rate: ${source.rate}, amount: ${source.amount}B`);
          } else {
            devWarn(`Revenue source ${sourceId} does not exist and cannot be reset`);
          }
        });
        
        // Apply the immutable update to revenue sources
        this.revenueSources = resetSources;
        
        // Reset spending categories immutably
        const resetCategories = {};
        for (const catId in this.spendingCategories) {
          const cat = this.spendingCategories[catId];
          if (!cat.isGroup) {
            resetCategories[catId] = { ...cat, adjustmentFactor: 1 };
          } else if (cat.children) {
            const resetChildren = {};
            for (const childId in cat.children) {
              resetChildren[childId] = { ...cat.children[childId], adjustmentFactor: 1 };
            }
            resetCategories[catId] = { ...cat, children: resetChildren };
          }
        }
        this.spendingCategories = resetCategories;
        
        // Fixed costs remain unchanged during reset
        // (debt servicing is not user-adjustable)
        
        // Reset expanded groups immutably
        this.expandedGroups = {
          incomeTaxes: true,
          consumptionTaxes: true,
          otherRevenues: true,
          mainCategories: true,
          otherCategories: false,
          governmentOperations: false,
          taxExpenditures: true,
        };
        
        // Handle CPP Premiums if they exist in the store but not in our defaults
        if (this.revenueSources.cppPremiums) {
          devLog('CPP Premiums found in store but not in defaults - setting to zero');
          // Update immutably
          this.revenueSources = {
            ...this.revenueSources,
            cppPremiums: {
              ...this.revenueSources.cppPremiums,
              rate: 0,
              amount: 0,
              adjustedAmount: 0,
              expenditureImpact: 0
            }
          };
        }
        
        // Now perform a controlled recalculation
        this.recalculateTotals();
        
        // Verify the total revenue is correct
        const actualTotal = this.totalRevenue;
        
        devLog(`Total revenue after reset: ${actualTotal}B (expected: ${expectedTotal}B)`);
        
        // Ensure badges remain empty after recalculation
        this.badges = [];
        this.lastBadgeUpdate = Date.now();
        
        // Force a UI update for all revenue sources
        this.lastRevenueSourceUpdate = Date.now();
        
        // Double-check that auto-balance is still disabled
        // This is critical when auto-balance was active before reset
        if (this.autoBalanceActive) {
          devWarn('Auto-balance was re-enabled during reset - forcing it off again');
          this.autoBalanceActive = false;
        }
        
        // Double-check totals one more time
        const finalTotal = this.totalRevenue;
        if (Math.abs(finalTotal - expectedTotal) > 0.5) {
          devWarn(`Final revenue check: ${finalTotal}B doesn't match expected ${expectedTotal}B`);
          // Force direct correction of any discrepancy immutably
          const correction = expectedTotal - finalTotal;
          
          this.revenueSources = {
            ...this.revenueSources,
            personalIncomeTax: {
              ...this.revenueSources.personalIncomeTax,
              amount: this.revenueSources.personalIncomeTax.amount + correction,
              adjustedAmount: this.revenueSources.personalIncomeTax.adjustedAmount + correction,
              rate: (this.revenueSources.personalIncomeTax.amount + correction) / this.revenueSources.personalIncomeTax.base
            }
          };
          
          devLog(`Applied final correction of ${correction}B to personal income tax`);
        }
      } finally {
        this._isRecalculating = false;
      }

      // Signal reset complete
      this.lastUpdate = Date.now();

      // Sync to localStorage
      this.syncToLocalStorage();

      console.log('Budget reset to initial state with badges cleared');
      console.log('Total Revenue after reset:', this.totalRevenue);
    },

    syncToLocalStorage() {
      try {
        this.isSaving = true;
        
        const budgetData = {
          revenueSources: {},
          spendingCategories: {},
          taxExpenditures: {},
          fixedCosts: this.fixedCosts, // Include fixed costs in storage
          expandedGroups: this.expandedGroups,
          currentYear: this.currentYear,
          budgetGoals: this.budgetGoals,
          goalStatus: this.goalStatus,
          badges: this.badges,
          lastBadgeUpdate: this.lastBadgeUpdate,
          activePreset: this.activePreset
        };

        for (const sourceId in this.revenueSources) {
          budgetData.revenueSources[sourceId] = {
            rate: this.revenueSources[sourceId].rate,
          };
        }

        for (const catId in this.spendingCategories) {
          budgetData.spendingCategories[catId] = {
            adjustmentFactor: this.spendingCategories[catId].adjustmentFactor,
          };
        }

        for (const expId in this.taxExpenditures) {
          budgetData.taxExpenditures[expId] = {
            adjustmentFactor: this.taxExpenditures[expId].adjustmentFactor,
          };
        }

        // Use the enhanced state persistence utility
        budgetPersistence.save(budgetData);
        
        console.log("Successfully saved budget to localStorage using enhanced persistence");
      } catch (error) {
        console.error("Error saving budget to localStorage:", error);
      } finally {
        this.isSaving = false;
      }
    },

    // Enhanced state persistence methods
    autoSaveState() {
      try {
        const stateToSave = {
          revenueSources: this.revenueSources,
          spendingCategories: this.spendingCategories,
          taxExpenditures: this.taxExpenditures,
          currentYear: this.currentYear,
          expandedGroups: this.expandedGroups,
          badges: this.badges,
          activePreset: this.activePreset,
          lastUpdate: Date.now()
        };
        
        budgetPersistence.autoSave(stateToSave);
      } catch (error) {
        console.error('[BudgetStore] Failed to auto-save state:', error);
      }
    },

    // Enhanced initialization with loading state
    async initializeBudget() {
      this.isLoading = true;
      try {
        // Try to load from localStorage first
        const savedState = budgetPersistence.load();
        
        if (savedState) {
          // Restore state
          this.restoreFromSavedState(savedState);
        } else {
          // Initialize with defaults
          this.initializeWithDefaults();
        }
        
        // Ensure calculations are up to date
        this.recalculateTotals();
        
      } catch (error) {
        console.error('[BudgetStore] Failed to initialize budget:', error);
        // Fallback to defaults
        this.initializeWithDefaults();
      } finally {
        this.isLoading = false;
      }
    },

    // Restore state from saved data
    restoreFromSavedState(savedState) {
      if (savedState.revenueSources) {
        Object.keys(savedState.revenueSources).forEach(sourceId => {
          if (this.revenueSources[sourceId]) {
            this.revenueSources[sourceId].rate = savedState.revenueSources[sourceId].rate;
          }
        });
      }
      
      if (savedState.spendingCategories) {
        Object.keys(savedState.spendingCategories).forEach(categoryId => {
          if (this.spendingCategories[categoryId]) {
            this.spendingCategories[categoryId].adjustmentFactor = savedState.spendingCategories[categoryId].adjustmentFactor;
          }
        });
      }
      
      if (savedState.currentYear) {
        this.currentYear = savedState.currentYear;
      }
      
      if (savedState.expandedGroups) {
        this.expandedGroups = { ...this.expandedGroups, ...savedState.expandedGroups };
      }
      
      if (savedState.badges) {
        this.badges = savedState.badges;
      }
      
      if (savedState.activePreset) {
        this.activePreset = savedState.activePreset;
      }
    },

    // Initialize with default values
    initializeWithDefaults() {
      // Initialize revenue sources immutably
      const initialRevenueSources = {};
      for (const sourceId in this.revenueSources) {
        const source = this.revenueSources[sourceId];
        initialRevenueSources[sourceId] = {
          ...source,
          amount: source.base * source.rate,
          adjustedAmount: source.base * source.rate,
          expenditureImpact: 0
        };
      }
      this.revenueSources = initialRevenueSources;

      // Initialize tax expenditures immutably
      const initialExpenditures = {};
      for (const expId in this.taxExpenditures) {
        const exp = this.taxExpenditures[expId];
        initialExpenditures[expId] = {
          ...exp,
          adjustment: exp.baseAdjustment || 0,
          revenueImpact: 0
        };
      }
      this.taxExpenditures = initialExpenditures;

      // Update all revenue sources to account for tax expenditure impacts
      for (const sourceId in this.revenueSources) {
        this.updateRevenueSourceAdjustedAmount(sourceId);
      }

      // Save initial state
      this.syncToLocalStorage();
    },

    getDefaultRate(sourceId) {
      const source = this.revenueSources[sourceId];
      if (source && source.rateByYear && source.rateByYear[this.currentYear] !== undefined) {
        return source.rateByYear[this.currentYear];
      }
      // Fallback defaults
      switch (sourceId) {
        case "personalIncomeTax":
          return 21;
        case "corporateIncomeTax":
          return 15;
        case "gst":
          return 5;
        case "exciseTaxes":
          return 2.5;
        case "carbonPricing":
          return 1;
        case "eiPremiums":
          return 1.35;
        case "customsDuties":
          return 1;
        case "crownProfits":
          return 2.5;
        case "nonTaxRevenue":
          return 3;
        case "resourceRoyalties":
          return 1;
        default:
          return 0;
      }
    },

    updateTaxExpenditureAdjustment: wrapStoreAction(
      function(expenditureId, adjustment) {
        try {
          const expenditure = this.taxExpenditures[expenditureId];
          if (!expenditure) return;

          const numAdjustment = Number(adjustment) || 0;
          const clampedAdjustment = Math.max(-100, Math.min(100, numAdjustment));

          // Calculate the revenue impact with explicit number conversion
          const netAmount = Number(expenditure.netAmount) || 0;
          const revenueImpact = -1 * netAmount * (clampedAdjustment / 100);

          console.log(`Updating tax expenditure ${expenditureId} to ${clampedAdjustment}%, impact: ${revenueImpact}B, batch mode: ${this.isBatchUpdateInProgress}`);

          // Update the tax expenditure immutably
          this.taxExpenditures = {
            ...this.taxExpenditures,
            [expenditureId]: {
              ...expenditure,
              adjustmentFactor: clampedAdjustment,
              revenueImpact: isNaN(revenueImpact) ? 0 : revenueImpact
            }
          };

          // Update the linked revenue source
          if (expenditure.linkedRevenueSource) {
            this.updateRevenueSourceAdjustedAmount(expenditure.linkedRevenueSource);
          }

          // Only update timestamps if not in batch mode
          if (!this.isBatchUpdateInProgress) {
            // Signal update
            this.lastUpdate = Date.now();
            this.lastTaxExpenditureUpdate = Date.now();
            
            // Signal that sentiment update is needed
            this.setSentimentUpdateRequired(true);
            
            // Sync to localStorage
            this.syncToLocalStorage();
          }
        } catch (e) {
          console.error(`Error updating tax expenditure ${expenditureId}:`, e);
        }
      },
      budgetValidationSchemas.taxExpenditureAdjustment,
      'updateTaxExpenditureAdjustment'
    ),

    updateLinkedRevenueSource(expenditureId) {
      try {
        const expenditure = this.taxExpenditures[expenditureId];
        if (!expenditure) {
          console.error(`Tax expenditure not found: ${expenditureId}`);
          return;
        }

        // Calculate impact and update the linked revenue source
        if (expenditure.linkedRevenueSource) {
          this.updateRevenueSourceAdjustedAmount(expenditure.linkedRevenueSource);
        }
      } catch (e) {
        console.error(`Error updating linked revenue source for ${expenditureId}:`, e);
      }
    },

    updateRevenueSourceAdjustedAmount(revSourceId) {
      try {
        const source = this.revenueSources[revSourceId];
        if (!source) {
          console.error(`Revenue source not found: ${revSourceId}`);
          return;
        }
        
        // Calculate total impact from all linked tax expenditures with explicit number conversion
        let totalImpact = 0;
        Object.values(this.taxExpenditures).forEach(exp => {
          if (exp.linkedRevenueSource === revSourceId && exp.adjustmentFactor !== undefined) {
            const netAmount = Number(exp.netAmount) || 0;
            const adjustmentFactor = Number(exp.adjustmentFactor) || 0;
            const impact = -1 * netAmount * (adjustmentFactor / 100);
            totalImpact += isNaN(impact) ? 0 : impact;
          }
        });
        
        // Update the revenue source immutably with explicit number conversion
        const sourceAmount = Number(source.amount) || 0;
        const adjustedAmount = Math.max(0, sourceAmount + totalImpact);
        
        this.revenueSources = {
          ...this.revenueSources,
          [revSourceId]: {
            ...source,
            adjustedAmount: isNaN(adjustedAmount) ? sourceAmount : adjustedAmount,
            expenditureImpact: isNaN(totalImpact) ? 0 : totalImpact
          }
        };
        
        // Signal update
        this.lastUpdate = Date.now();
        
        console.log(`Updated revenue source ${revSourceId}: base amount ${sourceAmount}B, tax impact ${totalImpact}B, adjusted ${adjustedAmount}B`);
      } catch (e) {
        console.error(`Error updating revenue source ${revSourceId}:`, e);
      }
    },

    updateRevenueSourceAmount: wrapStoreAction(
      function(sourceId, newAmount) {
        try {
          const source = this.revenueSources[sourceId];
          if (!source) {
            console.error(`Revenue source not found: ${sourceId}`);
            return;
          }
          
          // Convert to number explicitly and handle invalid values
          const numAmount = Number(newAmount);
          if (isNaN(numAmount)) {
            console.error(`Invalid amount provided for ${sourceId}: ${newAmount}`);
            return;
          }
          
          // Create a new revenue source object with updated values
          const updatedSource = {
            ...source,
            amount: numAmount,
            adjustedAmount: numAmount
          };
          
          // Calculate the new rate based on the base value
          if (source.base) {
            const baseValue = Number(source.base) || 1; // Prevent division by zero
            updatedSource.rate = numAmount / baseValue;
          }
          
          // Update the revenue source immutably
          this.revenueSources = {
            ...this.revenueSources,
            [sourceId]: updatedSource
          };
          
          // Update adjusted amount to account for tax expenditures
          this.updateRevenueSourceAdjustedAmount(sourceId);
          
          // Signal update
          this.lastUpdate = Date.now();
          
          // Sync to localStorage
          this.syncToLocalStorage();
          
          console.log(`Updated revenue source ${sourceId} amount to ${numAmount}B`);
        } catch (e) {
          console.error(`Error updating revenue source amount for ${sourceId}:`, e);
        }
      },
      budgetValidationSchemas.revenueSourceAmount,
      'updateRevenueSourceAmount'
    ),
    
    /**
     * Alternative method name for backward compatibility - delegates to setRevenueRate
     * @deprecated Use setRevenueRate instead
     */
    updateRevenueSourceRate(sourceId, newRate) {
      return this.setRevenueRate(sourceId, newRate);
    },

    resetTaxExpenditures() {
      // Reset tax expenditures immutably
      const resetExpenditures = {};
      for (const expId in this.taxExpenditures) {
        const exp = this.taxExpenditures[expId];
        resetExpenditures[expId] = {
          ...exp,
          adjustmentFactor: 0,
          revenueImpact: 0,
          adjustmentPercent: 0,
          adjustedAmount: exp.baseAmount
        };
      }
      this.taxExpenditures = resetExpenditures;
      this.lastTaxExpenditureUpdate = Date.now();

      // Update all revenue sources to reflect reset expenditures
      for (const sourceId in this.revenueSources) {
        this.updateRevenueSourceAdjustedAmount(sourceId);
      }

      // Signal update and recalculate totals
      this.lastUpdate = Date.now();
      this.recalculateTotals();
      
      // Update badges after tax expenditures are reset
      this.updateBadges();
      
      console.log('Reset all tax expenditures to 0');
    },

    updateBadges() {
      // Get the budget data in the format expected by the badge engine
      const budgetData = this.budgetDataForBadges;
      
      console.log('%c[STORE DEBUG] updateBadges called', 'background: #e74c3c; color: white; padding: 2px 5px; border-radius: 3px;');
      console.log('Active preset in store:', this.activePreset);
      console.log('Budget data for badges:', budgetData);
      
      // CRITICAL FIX: Ensure we're passing the activePreset correctly
      // The activePreset must be a string, not undefined or null
      const presetKey = this.activePreset || null;
      
      console.log('%c[STORE DEBUG] Calling getBudgetBadges with preset:', 'color: #e67e22;', presetKey);
      
      // Get the earned badges using the getBudgetBadges function, passing the active preset
      const earnedBadges = getBudgetBadges(budgetData, presetKey);
      
      console.log('%c[STORE DEBUG] Earned badges:', 'color: #2ecc71;', earnedBadges.map(b => b.title));
      
      // Update the badges state
      this.badges = [...earnedBadges]; // Use spread operator to ensure reactivity
      this.lastBadgeUpdate = Date.now();
      
      // Force a UI update by triggering a reactive property
      this.$patch({ lastBadgeUpdate: Date.now() });
      
      // Sync to localStorage
      this.syncToLocalStorage();
    },
    

  },
});
