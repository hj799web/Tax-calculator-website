import { defineStore } from "pinia";

export const useBudgetSimulatorStore = defineStore("budgetSimulator", {
  state: () => ({
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
        baseAmount: 100.2, // $100.2B (Health and Social Transfers to Provinces)
        adjustmentFactor: 1,
        description:
          "Canada Health Transfer to provinces and territories for healthcare services.",
        color: "#F56565", // red-500
      },
      seniors: {
        id: "seniors",
        name: "Support for Seniors",
        baseAmount: 76.0, // $76.0B (Elderly Benefits)
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
        baseAmount: 23.3, // $23.3B (Indigenous Settlements)
        adjustmentFactor: 1,
        description:
          "Services, infrastructure, and reconciliation efforts for Indigenous communities.",
        color: "#ED8936", // orange-500
      },
      employmentInsurance: {
        id: "employmentInsurance",
        name: "Employment Insurance",
        baseAmount: 23.1, // $23.1B (Employment Insurance)
        adjustmentFactor: 1,
        description:
          "Benefits for unemployed workers, parental leave, and skills training.",
        color: "#9F7AEA", // purple-500
      },
      defensePublicSafety: {
        id: "defensePublicSafety",
        name: "Defense & Public Safety",
        baseAmount: 32.6, // $32.6B (Defence & National Security)
        adjustmentFactor: 1,
        description:
          "Military, RCMP, border services, and other security agencies.",
        color: "#38B2AC", // teal-500
      },
      debtServicing: {
        id: "debtServicing",
        name: "Debt Servicing",
        baseAmount: 47.3, // $47.3B (Public Debt Charges)
        adjustmentFactor: 1,
        description: "Interest payments on the federal debt.",
        color: "#667EEA", // indigo-500
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
            baseAmount: 2.5, // $2.5B
            adjustmentFactor: 1,
            description: "Financial assistance for post-secondary education.",
            color: "#ECC94B", // yellow-500
          },
          agricultureLoans: {
            id: "agricultureLoans",
            name: "Agriculture Loans",
            baseAmount: 0.2, // $0.2B
            adjustmentFactor: 1,
            description: "Support for farmers and agricultural businesses.",
            color: "#ECC94B", // yellow-500
          },
          internationalDevelopment: {
            id: "internationalDevelopment",
            name: "International Development",
            baseAmount: 2.0, // $2.0B
            adjustmentFactor: 1,
            description: "Foreign aid and development assistance.",
            color: "#ECC94B", // yellow-500
          },
          businessInnovation: {
            id: "businessInnovation",
            name: "Business & Innovation",
            baseAmount: 0.6, // $0.6B
            adjustmentFactor: 1,
            description:
              "Loans and investments to support business growth and innovation.",
            color: "#ECC94B", // yellow-500
          },
          defenseSector: {
            id: "defenseSector",
            name: "Defense Sector",
            baseAmount: 1.5, // $1.5B
            adjustmentFactor: 1,
            description:
              "Investments in defense equipment and technology.",
            color: "#ECC94B", // yellow-500
          },
          economicDevelopment: {
            id: "economicDevelopment",
            name: "Economic Development",
            baseAmount: 3.2, // $3.2B
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
      enabled: false,
      targetRevenue: null,
      targetDeficit: null,
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
    
    // Reactive trigger for tax expenditure updates
    lastTaxExpenditureUpdate: Date.now(),
    
    // Reactive trigger for revenue source updates
    lastRevenueSourceUpdate: Date.now(),
    
    // Budget goals
    autoBalanceActive: false,
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

    totalRevenue() {
      // Calculate total revenue directly from all revenue sources with explicit number conversion
      let total = 0;
      try {
        for (const sourceId in this.revenueSources) {
          const amount = Number(this.revenueSources[sourceId]?.adjustedAmount) || 0;
          total += amount;
        }
        return isNaN(total) ? 0 : total;
      } catch (e) {
        console.error('Error calculating total revenue:', e);
        return 0;
      }
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
      return this.mainCategoriesSpending + this.otherCategoriesTotal;
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
        const totalAmount = children.reduce(
          (sum, child) => sum + child.baseAmount,
          0
        );
        const weightedFactor = children.reduce(
          (sum, child) => sum + child.baseAmount * child.adjustmentFactor,
          0
        );
        return totalAmount > 0 ? weightedFactor / totalAmount : 1;
      };
    },

    getGDP() {
      return 2500; // $2.5 trillion expressed in billions
    },


  },

  actions: {
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

    updateRevenueRate(sourceId, newRate) {
      const source = this.revenueSources[sourceId];
      if (source) {
        console.log(`Updating revenue source ${sourceId} rate from ${source.rate} to ${newRate}`);
        source.rate = newRate;
        // Update the amount based on the new rate
        source.amount = source.base * source.rate;
        
        // Recalculate totals for display
        this.recalculateTotals();
        
        // Update the reactive trigger to force component updates
        this.lastRevenueSourceUpdate = Date.now();
        console.log(`Updated lastRevenueSourceUpdate: ${this.lastRevenueSourceUpdate}`);
        
        // Sync to localStorage
        this.syncToLocalStorage();
      }
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
      
      // If auto-balance is active, attempt to balance the budget
      if (this.autoBalanceActive) {
        this.autoBalanceBudget();
      }
      
      // Check for deficit/surplus limits
      const currentSurplus = this.surplus;
      if (currentSurplus > 50) {
        console.warn(`Surplus exceeds $50B limit: $${currentSurplus.toFixed(1)}B`);
      } else if (currentSurplus < -60) {
        console.warn(`Deficit exceeds $60B limit: $${-currentSurplus.toFixed(1)}B`);
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
      this.lastUpdate = Date.now();
    },

    updateGroupSpendingFactor(groupId, factor) {
      const group = Object.values(this.spendingCategories).find(
        (cat) => cat.id === groupId
      );
      if (group && group.isGroup && group.children) {
        Object.values(group.children).forEach((child) => {
          child.adjustmentFactor = factor;
        });
        this.lastUpdate = Date.now();
      }
    },

    updateBudgetGoals(goals) {
      if (goals.enabled !== undefined) this.budgetGoals.enabled = goals.enabled;
      if (goals.targetRevenue !== undefined)
        this.budgetGoals.targetRevenue = goals.targetRevenue;
      if (goals.targetDeficit !== undefined)
        this.budgetGoals.targetDeficit = goals.targetDeficit;
    },

    updateGoalStatus(statusData = {}) {
      const revenueGoal = this.budgetGoals.targetRevenue || 0;
      const currentRevenue = this.totalRevenue || 0;
      const revenueStatus =
        revenueGoal > 0 ? (currentRevenue / revenueGoal) * 100 : 100;

      const deficitGoal = this.budgetGoals.targetDeficit || 0;
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
      const currentDeficit = this.totalSpending - this.totalRevenue;
      if (currentDeficit <= 0) return;
      const reductionFactor = this.totalRevenue / this.totalSpending;
      Object.values(this.spendingCategories).forEach((cat) => {
        if (!cat.isGroup) {
          cat.adjustmentFactor = Math.max(0.5, cat.adjustmentFactor * reductionFactor);
        } else if (cat.children) {
          Object.values(cat.children).forEach((child) => {
            child.adjustmentFactor = Math.max(0.5, child.adjustmentFactor * reductionFactor);
          });
        }
      });
      this.lastUpdate = Date.now();
    },

    resetBudget() {
      // Reset budget goals immutably
      this.budgetGoals = {
        enabled: false,
        targetRevenue: 450,
        targetDeficit: 0,
      };

      // Reset revenue sources immutably
      const resetRevenueSources = {};
      for (const sourceId in this.revenueSources) {
        const source = this.revenueSources[sourceId];
        const defaultRate = this.getDefaultRate(sourceId);
        resetRevenueSources[sourceId] = {
          ...source,
          rate: defaultRate,
          amount: source.base * defaultRate,
          adjustedAmount: source.base * defaultRate,
          expenditureImpact: 0
        };
      }
      this.revenueSources = resetRevenueSources;

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

      // Reset tax expenditures immutably
      const resetExpenditures = {};
      for (const expId in this.taxExpenditures) {
        const exp = this.taxExpenditures[expId];
        resetExpenditures[expId] = {
          ...exp,
          adjustment: exp.baseAdjustment || 0,
          adjustmentFactor: 0,
          revenueImpact: 0
        };
      }
      this.taxExpenditures = resetExpenditures;

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

      // Update all revenue sources to account for reset tax expenditures
      for (const sourceId in this.revenueSources) {
        this.updateRevenueSourceAdjustedAmount(sourceId);
      }

      // Signal reset complete
      this.lastUpdate = Date.now();

      // Sync to localStorage
      this.syncToLocalStorage();

      console.log('Budget reset to initial state');
    },

    syncToLocalStorage() {
      try {
        const budgetData = {
          revenueSources: {},
          spendingCategories: {},
          taxExpenditures: {},
          expandedGroups: this.expandedGroups,
          currentYear: this.currentYear,
          budgetGoals: this.budgetGoals,
          goalStatus: this.goalStatus,
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

        localStorage.setItem("budgetSimulator", JSON.stringify(budgetData));
      } catch (error) {
        console.error("Error saving budget to localStorage:", error);
      }
    },

    loadFromLocalStorage() {
      try {
        const savedData = localStorage.getItem("budgetSimulator");
        if (savedData) {
          const budgetData = JSON.parse(savedData);

          if (budgetData.revenueSources) {
            for (const sourceId in budgetData.revenueSources) {
              if (this.revenueSources[sourceId]) {
                this.revenueSources[sourceId].rate =
                  budgetData.revenueSources[sourceId].rate;
                this.revenueSources[sourceId].amount =
                  this.revenueSources[sourceId].base *
                  this.revenueSources[sourceId].rate;
              }
            }
          }

          if (budgetData.spendingCategories) {
            for (const catId in budgetData.spendingCategories) {
              if (this.spendingCategories[catId]) {
                this.spendingCategories[catId].adjustmentFactor =
                  budgetData.spendingCategories[catId].adjustmentFactor;
              }
            }
          }

          if (budgetData.taxExpenditures) {
            for (const expId in budgetData.taxExpenditures) {
              if (this.taxExpenditures[expId]) {
                this.taxExpenditures[expId].adjustmentFactor =
                  budgetData.taxExpenditures[expId].adjustmentFactor;
              }
            }
          }

          if (budgetData.expandedGroups) {
            this.expandedGroups = budgetData.expandedGroups;
          }

          if (budgetData.currentYear) {
            this.currentYear = budgetData.currentYear;
          }

          if (budgetData.budgetGoals) {
            this.budgetGoals = budgetData.budgetGoals;
          }

          if (budgetData.goalStatus) {
            this.goalStatus = budgetData.goalStatus;
          }

          this.recalculateTotals();
        }
      } catch (error) {
        console.error("Error loading budget from localStorage:", error);
      }
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

    updateTaxExpenditureAdjustment(expenditureId, adjustment) {
      try {
        const expenditure = this.taxExpenditures[expenditureId];
        if (!expenditure) {
          console.error(`Tax expenditure not found: ${expenditureId}`);
          return;
        }

        // Clamp the adjustment between 0 and 100 with explicit number conversion
        const numAdjustment = Number(adjustment) || 0;
        const clampedAdjustment = Math.max(0, Math.min(100, numAdjustment));

        // Calculate the revenue impact with explicit number conversion
        const netAmount = Number(expenditure.netAmount) || 0;
        const revenueImpact = -1 * netAmount * (clampedAdjustment / 100);

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

        // Signal update
        this.lastUpdate = Date.now();

        // Sync to localStorage
        this.syncToLocalStorage();

        console.log(`Updated tax expenditure ${expenditureId} to ${clampedAdjustment}%, impact: ${revenueImpact}B`);
      } catch (e) {
        console.error(`Error updating tax expenditure ${expenditureId}:`, e);
      }
    },

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

    updateRevenueSourceAmount(sourceId, newAmount) {
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
    
    updateRevenueSourceRate(sourceId, newRate) {
      const source = this.revenueSources[sourceId];
      if (!source) {
        console.error(`Revenue source not found: ${sourceId}`);
        return;
      }
      
      // Clamp the rate to valid range if min/max are defined
      let clampedRate = newRate;
      if (source.minRate !== undefined) {
        clampedRate = Math.max(source.minRate, clampedRate);
      }
      if (source.maxRate !== undefined) {
        clampedRate = Math.min(source.maxRate, clampedRate);
      }
      
      // Update the rate and recalculate the amount
      source.rate = clampedRate;
      source.amount = source.base * source.rate;
      
      // Update the adjusted amount (which will include tax expenditure impacts)
      this.updateRevenueSourceAdjustedAmount(sourceId);
      
      // Update the revenue source in the current year's rate history
      if (source.rateByYear) {
        source.rateByYear[this.currentYear] = clampedRate;
      }
      
      // Force reactive update by shallow copying revenueSources
      this.revenueSources = { ...this.revenueSources };
      
      // Update the reactive trigger to force component updates
      this.lastRevenueSourceUpdate = Date.now();
      
      // Update lastUpdate to trigger reactivity
      this.lastUpdate = Date.now();
      
      // Sync to localStorage
      this.syncToLocalStorage();
      
      console.log(`Updated revenue source ${sourceId} rate to ${clampedRate}%, amount: ${source.amount}B, adjusted: ${source.adjustedAmount}B`);
    },

    resetTaxExpenditures() {
      // Reset tax expenditures immutably
      const resetExpenditures = {};
      for (const expId in this.taxExpenditures) {
        const exp = this.taxExpenditures[expId];
        resetExpenditures[expId] = {
          ...exp,
          adjustmentFactor: 0,
          revenueImpact: 0
        };
      }
      this.taxExpenditures = resetExpenditures;

      // Update all revenue sources to reflect reset expenditures
      for (const sourceId in this.revenueSources) {
        this.updateRevenueSourceAdjustedAmount(sourceId);
      }

      // Signal update
      this.lastUpdate = Date.now();

      // Sync to localStorage
      this.syncToLocalStorage();

      console.log('Reset all tax expenditures to 0');
    },
  },
});
