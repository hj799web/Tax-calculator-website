<template>
  <div style="padding: 0; background-color: white; color: #333; width: 100%; max-width: 800px; margin: 0 auto;">
    <!-- Header Section with Solid Background -->
    <div style="background-color: #4361ee; color: white; padding: 20px; margin-bottom: 20px;">
      <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">
        Federal Budget Summary
      </div>
      <div style="font-size: 14px;">
        Generated on {{ new Date().toLocaleDateString() }} at {{ new Date().toLocaleTimeString() }}
      </div>
    </div>

    <!-- Budget Title and Badge -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding: 0 20px;">
      <h1 style="font-size: 22px; font-weight: bold; color: #333;">
        {{ budgetTitle }}
      </h1>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div v-for="(badge, index) in badges" :key="index" style="padding: 10px; background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 5px; color: #92400E;">
        <div style="font-size: 16px; font-weight: bold;">
          {{ badge.icon }} {{ badge.title }}
        </div>
        <div style="font-size: 12px;">
          {{ badge.description }}
          </div>
        </div>
      </div>
    </div>

    <!-- Narrative Section -->
    <div style="padding: 15px; background-color: #EFF6FF; border-left: 4px solid #3B82F6; margin-bottom: 20px; margin-left: 20px; margin-right: 20px;">
      <p style="font-size: 14px; color: #374151; line-height: 1.5;">
        {{ narrative }}
      </p>
    </div>

    <!-- Financial Summary Section -->
    <div class="financial-summary-section" style="margin-bottom: 20px; padding: 0 20px;">
      <h2 style="font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px; margin-bottom: 15px;">
        Financial Overview
      </h2>
      <div style="display: flex; gap: 15px;">
        <div style="flex: 1; padding: 15px; background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 5px;">
          <div style="font-size: 14px; color: #1E40AF; font-weight: 500; margin-bottom: 5px;">
            Total Revenue
          </div>
          <div style="font-size: 20px; font-weight: bold; color: #1E3A8A;">
            {{ formatCurrency(totalRevenue) }}
          </div>
        </div>
        <div style="flex: 1; padding: 15px; background-color: #F5F3FF; border: 1px solid #DDD6FE; border-radius: 5px;">
          <div style="font-size: 14px; color: #5B21B6; font-weight: 500; margin-bottom: 5px;">
            Total Spending
          </div>
          <div style="font-size: 20px; font-weight: bold; color: #4C1D95;">
            {{ formatCurrency(totalSpending) }}
          </div>
        </div>
        <div
          v-if="surplus >= 0"
          style="flex: 1; padding: 15px; background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 5px;"
        >
          <div style="font-size: 14px; color: #047857; font-weight: 500; margin-bottom: 5px;">
            Surplus
          </div>
          <div style="font-size: 20px; font-weight: bold; color: #065F46;">
            {{ formatCurrency(surplus) }}
          </div>
        </div>
        <div
          v-else
          style="flex: 1; padding: 15px; background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 5px;"
        >
          <div style="font-size: 14px; color: #B91C1C; font-weight: 500; margin-bottom: 5px;">
            Deficit
          </div>
          <div style="font-size: 20px; font-weight: bold; color: #7F1D1D;">
            {{ formatCurrency(surplus) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Public Sentiment Section -->
    <div
      v-if="sentimentScores"
      class="sentiment-section"
      style="margin-bottom: 20px; padding: 0 20px;"
    >
      <h2 style="font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px; margin-bottom: 15px;">
        Public Sentiment Analysis
      </h2>
      
      <!-- Overall Sentiment Score -->
      <div class="sentiment-card" style="margin-bottom: 15px; padding: 15px; background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <div style="font-size: 16px; font-weight: 600; color: #111827;">
            Overall Public Sentiment
          </div>
          <div style="font-size: 16px; font-weight: bold; color: #111827;">
            {{ getSentimentEmoji(sentimentScores.overall) }} {{ sentimentScores.overall.toFixed(1) }}/10
          </div>
        </div>
        <div style="width: 100%; background-color: #E5E7EB; height: 10px; border-radius: 5px; overflow: hidden;">
          <div 
            style="height: 10px; border-radius: 5px;"
            :style="{ width: `${calculateBarWidth(sentimentScores.overall)}%`, backgroundColor: getSentimentBarColor(sentimentScores.overall) }"
          />
        </div>
        <div style="font-size: 14px; margin-top: 8px; color: #4B5563; text-align: center;">
          {{ getSentimentLabel(sentimentScores.overall) }}
        </div>
      </div>
      
      <!-- Regional Sentiment -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #1E40AF; margin-bottom: 10px; padding-left: 5px; border-left: 3px solid #3B82F6;">
          Regional Sentiment
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          <div 
            v-for="(score, region) in sentimentScores.provinces" 
            :key="region" 
            class="sentiment-card"
            style="padding: 10px; border-radius: 6px; border: 1px solid #E5E7EB;"
          >
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <div style="font-weight: 500; font-size: 14px;">
                {{ region }}
              </div>
              <div style="font-weight: 600; font-size: 14px;">
                {{ getSentimentEmoji(score) }} {{ score.toFixed(1) }}
              </div>
            </div>
            <div style="width: 100%; background-color: #E5E7EB; height: 6px; border-radius: 3px; overflow: hidden;">
              <div 
                style="height: 6px; border-radius: 3px;"
                :style="{ width: `${calculateBarWidth(score)}%`, backgroundColor: getSentimentBarColor(score) }"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Demographic Sentiment -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #5B21B6; margin-bottom: 10px; padding-left: 5px; border-left: 3px solid #8B5CF6;">
          Demographic Sentiment
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          <div 
            v-for="(score, demographic) in sentimentScores.demographics" 
            :key="demographic" 
            class="sentiment-card"
            style="padding: 10px; border-radius: 6px; border: 1px solid #E5E7EB;"
          >
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <div style="font-weight: 500; font-size: 14px;">
                {{ demographic }}
              </div>
              <div style="font-weight: 600; font-size: 14px;">
                {{ getSentimentEmoji(score) }} {{ score.toFixed(1) }}
              </div>
            </div>
            <div style="width: 100%; background-color: #E5E7EB; height: 6px; border-radius: 3px; overflow: hidden;">
              <div 
                style="height: 6px; border-radius: 3px;"
                :style="{ width: `${calculateBarWidth(score)}%`, backgroundColor: getSentimentBarColor(score) }"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sectoral Sentiment -->
      <div>
        <h3 style="font-size: 16px; font-weight: 600; color: #065F46; margin-bottom: 10px; padding-left: 5px; border-left: 3px solid #10B981;">
          Sectoral Sentiment
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          <div 
            v-for="(score, sector) in sentimentScores.sectors" 
            :key="sector" 
            class="sentiment-card"
            style="padding: 10px; border-radius: 6px; border: 1px solid #E5E7EB;"
          >
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <div style="font-weight: 500; font-size: 14px;">
                {{ sector }}
              </div>
              <div style="font-weight: 600; font-size: 14px;">
                {{ getSentimentEmoji(score) }} {{ score.toFixed(1) }}
              </div>
            </div>
            <div style="width: 100%; background-color: #E5E7EB; height: 6px; border-radius: 3px; overflow: hidden;">
              <div 
                style="height: 6px; border-radius: 3px;"
                :style="{ width: `${calculateBarWidth(score)}%`, backgroundColor: getSentimentBarColor(score) }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Breakdown Section -->
    <div
      v-if="includeFullBreakdown"
      class="budget-breakdown"
      style="padding: 0 20px; margin-bottom: 20px;"
    >
      <h2 style="font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px; margin-bottom: 15px;">
        Full Budget Breakdown
      </h2>
      
      <!-- Revenue Breakdown -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px; color: #1E40AF;">
          Revenue Sources
        </h3>
        <!-- Most Significant Changes -->
        <div v-if="getMostSignificantRevenueChanges.length > 0" style="margin-bottom: 15px; padding: 10px; background-color: #FEF2F2; border-radius: 5px;">
          <h4 style="font-size: 14px; font-weight: 600; color: #991B1B; margin-bottom: 8px;">
            Most Significant Revenue Changes
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <div v-for="(source, index) in getMostSignificantRevenueChanges" :key="index" 
                 style="padding: 8px; background-color: white; border-radius: 4px; border: 1px solid #FCA5A5;">
              <div style="font-weight: 500;">{{ source.name }}</div>
              <div :style="{ color: source.change > 0 ? '#059669' : '#DC2626' }">
                {{ formatPercentageChange(source.change * 100) }}
              </div>
            </div>
          </div>
        </div>
        <!-- Revenue Sources Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <thead>
            <tr style="background-color: #F3F4F6; border-bottom: 2px solid #E5E7EB;">
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Revenue Source</th>
              <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Base Amount</th>
              <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Adjusted Amount</th>
              <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Change</th>
            </tr>
          </thead>
          <tbody>
              <tr
              v-for="source in getSortedRevenueSources" 
              :key="source.id"
                style="border-bottom: 1px solid #E5E7EB;"
              >
              <td style="padding: 12px; color: #1F2937;">{{ source.name }}</td>
              <td style="padding: 12px; text-align: right; color: #1F2937;">{{ formatCurrency(source.baseAmount) }}</td>
              <td style="padding: 12px; text-align: right; color: #1F2937;">
                  {{ formatCurrency(source.adjustedAmount) }}
                <span :style="{ color: source.change > 0 ? '#059669' : '#DC2626' }">
                  ({{ source.change > 0 ? '+' : '' }}{{ formatCurrency((source.adjustedAmount - source.baseAmount)) }})
                </span>
              </td>
              <td 
                style="padding: 12px; text-align: right; font-weight: 500;"
                :style="{ color: source.change > 0 ? '#059669' : '#DC2626' }"
              >
                {{ formatPercentageChange(source.change * 100) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Spending Breakdown -->
      <div>
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px; color: #5B21B6;">
          Spending Categories
        </h3>
        <!-- Most Significant Changes -->
        <div v-if="getMostSignificantSpendingChanges.length > 0" style="margin-bottom: 15px; padding: 10px; background-color: #FEF2F2; border-radius: 5px;">
          <h4 style="font-size: 14px; font-weight: 600; color: #991B1B; margin-bottom: 8px;">
            Most Significant Spending Changes
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <div v-for="(category, index) in getMostSignificantSpendingChanges" :key="index" 
                 style="padding: 8px; background-color: white; border-radius: 4px; border: 1px solid #FCA5A5;">
              <div style="font-weight: 500;">{{ category.name }}</div>
              <div :style="{ color: category.change > 0 ? '#059669' : '#DC2626' }">
                {{ formatPercentageChange(category.change * 100) }}
              </div>
            </div>
          </div>
        </div>
        <!-- Spending Categories Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <thead>
            <tr style="background-color: #F3F4F6; border-bottom: 2px solid #E5E7EB;">
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Spending Category</th>
              <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Base Amount</th>
              <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Adjusted Amount</th>
              <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Change</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(category, index) in getSortedSpendingCategories" :key="category.id">
              <!-- Category Type Headers -->
              <tr v-if="index === 0 || category.categoryType !== getSortedSpendingCategories[index - 1].categoryType"
                  style="background-color: #F9FAFB;">
                <td colspan="4" style="padding: 8px 12px; font-weight: 600; color: #374151;">
                  {{ category.categoryType === 'main' ? 'Main Categories' :
                     category.categoryType === 'other' ? 'Other Categories' :
                     category.categoryType === 'government' ? 'Government Operations' :
                     category.categoryType === 'tax' ? 'Tax Expenditures & Credits' : '' }}
                </td>
              </tr>
              <!-- Category Row -->
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 12px; color: #1F2937;">{{ category.name }}</td>
                <td style="padding: 12px; text-align: right; color: #1F2937;">{{ formatCurrency(category.baseAmount) }}</td>
                <td style="padding: 12px; text-align: right; color: #1F2937;">
                  {{ formatCurrency(category.adjustedAmount) }}
                  <span :style="{ color: category.change > 0 ? '#059669' : '#DC2626' }">
                    ({{ category.change > 0 ? '+' : '' }}{{ formatCurrency((category.adjustedAmount - category.baseAmount)) }})
                  </span>
                </td>
                <td 
                  style="padding: 12px; text-align: right; font-weight: 500;"
                  :style="{ color: category.change > 0 ? '#059669' : '#DC2626' }"
                >
                  {{ formatPercentageChange(category.change * 100) }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 11px; color: #6B7280;">
      Generated by the Federal Budget Simulator | Fiscal Year {{ new Date().getFullYear() }}
    </div>
  </div>
</template>

<script setup>
// Props: budgetTitle, badges, narrative, totalRevenue, totalSpending, surplus, sentimentScores, includeFullBreakdown, budget, formatCurrency, formatPercentageChange
import { getSentimentEmoji, getSentimentLabel } from '@/domains/sentiment/utils/computeSentimentScores';
import { computed } from 'vue';

const props = defineProps({
  budgetTitle: { type: String, default: 'Budget Summary' },
  badges: { type: Array, default: () => [] },
  narrative: { type: String, default: '' },
  totalRevenue: { type: Number, default: 0 },
  totalSpending: { type: Number, default: 0 },
  surplus: { type: Number, default: 0 },
  sentimentScores: { type: Object, default: () => ({}) },
  includeFullBreakdown: { type: Boolean, default: false },
  budget: { type: Object, default: () => ({}) },
  formatCurrency: { type: Function, default: (val) => `$${val}B` },
  formatPercentageChange: { type: Function, default: (val) => `${val.toFixed(1)}%` }
})

// Helper function to calculate the width percentage for sentiment bars
function calculateBarWidth(score) {
  // Scale from 1-5 to 0-100% with proper distribution
  // 1 = 0%, 3 = 50%, 5 = 100%
  return Math.max(0, Math.min(100, (score - 1) * 25));
}

// Helper function to get sentiment progress bar color based on score
function getSentimentBarColor(score) {
  if (score >= 4) return '#10B981'; // green-500 for good scores (4+)
  if (score >= 3) return '#9CA3AF'; // gray-400 for neutral scores (3-4)
  if (score >= 2) return '#F59E0B'; // yellow-500 for concerning scores (2-3)
  return '#EF4444'; // red-500 for bad scores (below 2)
}

// Computed property to get sorted revenue sources by percentage change
const getSortedRevenueSources = computed(() => {
  if (!props.budget?.revenueSources) return [];
  
  return Object.values(props.budget.revenueSources)
    .map(source => {
      const baseAmount = source.base * source.rate;
      const adjustedAmount = source.adjustedAmount;
      const change = (adjustedAmount / baseAmount) - 1;
      return {
        ...source,
        baseAmount,
        adjustedAmount,
        change,
        adjustmentFactor: 1 + change // Convert change to adjustment factor
      };
    })
    .sort((a, b) => Math.abs(b.adjustmentFactor - 1) - Math.abs(a.adjustmentFactor - 1));
});

// Computed property to get sorted spending categories by percentage change
const getSortedSpendingCategories = computed(() => {
  if (!props.budget?.spendingCategories) return [];
  
  const categories = [];
  
  // Process all categories
  Object.values(props.budget.spendingCategories).forEach(category => {
    if (category.isGroup) {
      // Handle group categories (other categories, government operations, tax expenditures)
      if (category.children) {
        Object.values(category.children).forEach(child => {
          if (child.baseAmount !== undefined) {
            categories.push({
              ...child,
              baseAmount: child.baseAmount,
              adjustedAmount: child.baseAmount * (child.adjustmentFactor || 1),
              change: (child.adjustmentFactor || 1) - 1,
              adjustmentFactor: child.adjustmentFactor || 1,
              categoryType: category.id === 'loansInvestments' ? 'other' :
                           category.id === 'governmentOperations' ? 'government' :
                           category.id === 'taxExpenditures' ? 'tax' : 'main'
            });
          }
        });
      }
    } else if (!category.id.includes('.')) { // Only include top-level categories
      // Handle main categories
      if (category.baseAmount !== undefined) {
        categories.push({
          ...category,
          baseAmount: category.baseAmount,
          adjustedAmount: category.baseAmount * (category.adjustmentFactor || 1),
          change: (category.adjustmentFactor || 1) - 1,
          adjustmentFactor: category.adjustmentFactor || 1,
          categoryType: 'main'
        });
      }
    }
  });

  // Sort categories by type and then by change magnitude
  return categories.sort((a, b) => {
    // First sort by category type
    const typeOrder = { main: 1, other: 2, government: 3, tax: 4 };
    const typeDiff = typeOrder[a.categoryType] - typeOrder[b.categoryType];
    if (typeDiff !== 0) return typeDiff;
    
    // Then sort by change magnitude within each type
    return Math.abs(b.adjustmentFactor - 1) - Math.abs(a.adjustmentFactor - 1);
  });
});

// Computed property to get most significant revenue changes (top 3)
const getMostSignificantRevenueChanges = computed(() => {
  return getSortedRevenueSources.value
    .filter(source => Math.abs(source.adjustmentFactor - 1) > 0.05)
    .slice(0, 3);
});

// Computed property to get most significant spending changes (top 3)
const getMostSignificantSpendingChanges = computed(() => {
  return getSortedSpendingCategories.value
    .filter(category => Math.abs(category.adjustmentFactor - 1) > 0.05)
    .slice(0, 3);
});
</script>

<style scoped>
.export-container.summary-only .full-breakdown-table {
  display: none;
}

/* Add styles for the budget breakdown section */
.budget-breakdown {
  display: block;
}

.summary-only .budget-breakdown {
  display: none;
}

/* Add page break controls for PDF generation */
@media print {
  /* Prevent awkward breaks within sections */
  .budget-breakdown {
    page-break-inside: avoid;
  }

  /* Add page breaks between major sections */
  .financial-summary-section {
    page-break-after: always;
  }

  .sentiment-section {
    page-break-after: always;
  }

  /* Prevent breaks within tables */
  table {
    page-break-inside: avoid;
  }

  /* Prevent breaks within sentiment cards */
  .sentiment-card {
    page-break-inside: avoid;
  }

  /* Add some spacing between sections */
  .section-spacer {
    margin-bottom: 2rem;
  }

  /* Ensure headers stay with their content */
  h2, h3 {
    page-break-after: avoid;
  }

  /* Ensure table headers repeat on new pages */
  thead {
    display: table-header-group;
  }
}

@media (max-width: 600px) {
  .card-title, .card-content, .summary-card, .main-category-header, .other-category-header, .subcategory-header, .gov-ops-header, .tax-expenditure-header, .tile-title, .tile-amount, .slider-labels {
    writing-mode: initial !important;
    text-orientation: initial !important;
    transform: none !important;
    display: block !important;
    white-space: normal !important;
    word-break: break-word !important;
  }
}
</style>
