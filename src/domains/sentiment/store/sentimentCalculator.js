import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useBudgetStore } from '@/domains/budget/store/budgetSimulator';
import { useSentimentSettingsStore } from './sentimentSettings';

export const useSentimentCalculatorStore = defineStore('sentimentCalculator', () => {
  const budgetStore = useBudgetStore();
  const settingsStore = useSentimentSettingsStore();

  // Base factors for sentiment calculation
  const baseFactors = ref({
    revenue: {
      personalIncomeTax: { weight: 0.3, impact: 0 },
      corporateIncomeTax: { weight: 0.2, impact: 0 },
      gst: { weight: 0.15, impact: 0 },
      otherTaxes: { weight: 0.35, impact: 0 }
    },
    spending: {
      healthcare: { weight: 0.25, impact: 0 },
      education: { weight: 0.2, impact: 0 },
      infrastructure: { weight: 0.15, impact: 0 },
      socialServices: { weight: 0.2, impact: 0 },
      other: { weight: 0.2, impact: 0 }
    }
  });

  // Demographic factors
  const demographicFactors = ref({
    ageGroups: {
      youth: { weight: 0.3, impact: 0 },
      workingAge: { weight: 0.4, impact: 0 },
      seniors: { weight: 0.3, impact: 0 }
    },
    incomeLevels: {
      low: { weight: 0.3, impact: 0 },
      middle: { weight: 0.4, impact: 0 },
      high: { weight: 0.3, impact: 0 }
    }
  });

  // Calculate impact of budget changes
  const calculateImpact = (budgetChanges) => {
    // Revenue impact
    Object.keys(baseFactors.value.revenue).forEach(source => {
      const change = budgetChanges.revenue?.[source] || 0;
      baseFactors.value.revenue[source].impact = change * baseFactors.value.revenue[source].weight;
    });

    // Spending impact
    Object.keys(baseFactors.value.spending).forEach(category => {
      const change = budgetChanges.spending?.[category] || 0;
      baseFactors.value.spending[category].impact = change * baseFactors.value.spending[category].weight;
    });

    // Update demographic impacts
    updateDemographicSentiment();
  };

  // Update sentiment based on demographic factors
  const updateDemographicSentiment = () => {
    // Calculate impact on different age groups
    Object.keys(demographicFactors.value.ageGroups).forEach(group => {
      const impact = calculateAgeGroupImpact(group);
      demographicFactors.value.ageGroups[group].impact = impact;
    });

    // Calculate impact on different income levels
    Object.keys(demographicFactors.value.incomeLevels).forEach(level => {
      const impact = calculateIncomeLevelImpact(level);
      demographicFactors.value.incomeLevels[level].impact = impact;
    });
  };

  // Calculate impact on specific age group
  const calculateAgeGroupImpact = (group) => {
    let impact = 0;
    
    // Different age groups are affected differently by spending changes
    switch(group) {
      case 'youth':
        impact = baseFactors.value.spending.education.impact * 0.4 +
                baseFactors.value.spending.socialServices.impact * 0.3;
        break;
      case 'workingAge':
        impact = baseFactors.value.revenue.personalIncomeTax.impact * 0.3 +
                baseFactors.value.spending.healthcare.impact * 0.3;
        break;
      case 'seniors':
        impact = baseFactors.value.spending.healthcare.impact * 0.4 +
                baseFactors.value.spending.socialServices.impact * 0.4;
        break;
    }

    return impact * settingsStore.sensitivity.demographics;
  };

  // Calculate impact on specific income level
  const calculateIncomeLevelImpact = (level) => {
    let impact = 0;
    
    // Different income levels are affected differently by tax changes
    switch(level) {
      case 'low':
        impact = baseFactors.value.revenue.gst.impact * 0.4 +
                baseFactors.value.spending.socialServices.impact * 0.4;
        break;
      case 'middle':
        impact = baseFactors.value.revenue.personalIncomeTax.impact * 0.4 +
                baseFactors.value.spending.healthcare.impact * 0.3;
        break;
      case 'high':
        impact = baseFactors.value.revenue.corporateIncomeTax.impact * 0.4 +
                baseFactors.value.revenue.personalIncomeTax.impact * 0.3;
        break;
    }

    return impact * settingsStore.sensitivity.demographics;
  };

  // Computed properties for overall sentiment
  const overallSentiment = computed(() => {
    const revenueImpact = Object.values(baseFactors.value.revenue)
      .reduce((sum, factor) => sum + factor.impact, 0);
    
    const spendingImpact = Object.values(baseFactors.value.spending)
      .reduce((sum, factor) => sum + factor.impact, 0);
    
    return (revenueImpact + spendingImpact) * settingsStore.sensitivity.overall;
  });

  // Get sentiment for specific demographic group
  const getDemographicSentiment = (group) => {
    return demographicFactors.value.ageGroups[group]?.impact || 0;
  };

  // Get sentiment for specific income level
  const getIncomeLevelSentiment = (level) => {
    return demographicFactors.value.incomeLevels[level]?.impact || 0;
  };

  return {
    baseFactors,
    demographicFactors,
    calculateImpact,
    updateDemographicSentiment,
    overallSentiment,
    getDemographicSentiment,
    getIncomeLevelSentiment
  };
}); 