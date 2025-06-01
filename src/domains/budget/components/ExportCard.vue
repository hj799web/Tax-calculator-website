<template>
  <div style="padding: 0; background-color: white; color: #1a1a1a; width: 100%; max-width: 800px; margin: 0 auto; font-family: 'Helvetica Neue', Arial, sans-serif;">
    <!-- Header Section with Gradient Background -->
    <div style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); color: white; padding: 30px 40px; margin-bottom: 30px; border-radius: 0 0 8px 8px;">
      <div style="font-size: 28px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px;">
        Federal Budget Summary
      </div>
      <div style="font-size: 14px; opacity: 0.9; font-weight: 300;">
        Generated on {{ new Date().toLocaleDateString() }} at {{ new Date().toLocaleTimeString() }}
      </div>
    </div>

    <!-- Budget Title and Badge -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding: 0 40px;">
      <h1 style="font-size: 24px; font-weight: 700; color: #1a365d; margin: 0;">
        {{ budgetTitle }}
      </h1>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div v-for="(badge, index) in badges" :key="index" 
             style="padding: 12px 16px; background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 6px; color: #92400E; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">
            {{ badge.icon }} {{ badge.title }}
          </div>
          <div style="font-size: 13px; line-height: 1.4;">
            {{ badge.description }}
          </div>
        </div>
      </div>
    </div>

    <!-- Narrative Section -->
    <div style="padding: 20px; background-color: #F8FAFC; border-left: 4px solid #2c5282; margin: 0 40px 30px; border-radius: 0 6px 6px 0;">
      <p style="font-size: 15px; color: #2d3748; line-height: 1.6; margin: 0;">
        {{ narrative }}
      </p>
    </div>

    <!-- Financial Summary Section -->
    <div style="padding: 0 40px; margin-bottom: 30px;">
      <h2 style="font-size: 20px; font-weight: 600; color: #1a365d; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">
        Financial Summary
      </h2>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
        <!-- Revenue Card -->
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">Total Revenue</div>
          <div style="font-size: 24px; font-weight: 700; color: #1a365d;">{{ formatCurrency(totalRevenue) }}</div>
        </div>
        
        <!-- Spending Card -->
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">Total Spending</div>
          <div style="font-size: 24px; font-weight: 700; color: #1a365d;">{{ formatCurrency(totalSpending) }}</div>
        </div>
        
        <!-- Surplus/Deficit Card -->
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">Surplus/Deficit</div>
          <div :style="{
            fontSize: '24px',
            fontWeight: '700',
            color: surplus >= 0 ? '#059669' : '#dc2626'
          }">
            {{ formatCurrency(surplus) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Sentiment Analysis Section (new page) -->
    <div class="page-break-before"></div>
    <h2 style="font-size: 20px; font-weight: 600; color: #1a365d; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">
      Public Sentiment Analysis
    </h2>
    <div style="padding: 0 40px; margin-bottom: 30px;">
      <!-- Provinces & Territories -->
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #2d3748; margin-bottom: 16px;">Provinces & Territories</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Most Positive -->
          <div style="background: #F0FDF4; padding: 16px; border-radius: 8px; border: 1px solid #86EFAC;">
            <div style="font-size: 14px; color: #166534; margin-bottom: 12px; font-weight: 600;">Most Positive</div>
            <div v-for="[province, score] in topProvinceScores.positive" :key="province" 
                 style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #166534;">{{ province }}</span>
              <span style="color: #166534; font-weight: 600;">{{ getSentimentEmoji(score) }} {{ getSentimentLabel(score) }}</span>
            </div>
          </div>
          <!-- Most Negative -->
          <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border: 1px solid #FCA5A5;">
            <div style="font-size: 14px; color: #991B1B; margin-bottom: 12px; font-weight: 600;">Most Negative</div>
            <div v-for="[province, score] in topProvinceScores.negative" :key="province"
                 style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #991B1B;">{{ province }}</span>
              <span style="color: #991B1B; font-weight: 600;">{{ getSentimentEmoji(score) }} {{ getSentimentLabel(score) }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Sectors -->
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #2d3748; margin-bottom: 16px;">Sectors</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Most Positive -->
          <div style="background: #F0FDF4; padding: 16px; border-radius: 8px; border: 1px solid #86EFAC;">
            <div style="font-size: 14px; color: #166534; margin-bottom: 12px; font-weight: 600;">Most Positive</div>
            <div v-for="[sector, score] in topSectorScores.positive" :key="sector"
                 style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #166534;">{{ sector }}</span>
              <span style="color: #166534; font-weight: 600;">{{ getSentimentEmoji(score) }} {{ getSentimentLabel(score) }}</span>
            </div>
          </div>
          <!-- Most Negative -->
          <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border: 1px solid #FCA5A5;">
            <div style="font-size: 14px; color: #991B1B; margin-bottom: 12px; font-weight: 600;">Most Negative</div>
            <div v-for="[sector, score] in topSectorScores.negative" :key="sector"
                 style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #991B1B;">{{ sector }}</span>
              <span style="color: #991B1B; font-weight: 600;">{{ getSentimentEmoji(score) }} {{ getSentimentLabel(score) }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Demographics -->
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #2d3748; margin-bottom: 16px;">Demographics</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Most Positive -->
          <div style="background: #F0FDF4; padding: 16px; border-radius: 8px; border: 1px solid #86EFAC;">
            <div style="font-size: 14px; color: #166534; margin-bottom: 12px; font-weight: 600;">Most Positive</div>
            <div v-for="[demographic, score] in topDemographicScores.positive" :key="demographic"
                 style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #166534;">{{ demographic }}</span>
              <span style="color: #166534; font-weight: 600;">{{ getSentimentEmoji(score) }} {{ getSentimentLabel(score) }}</span>
            </div>
          </div>
          <!-- Most Negative -->
          <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border: 1px solid #FCA5A5;">
            <div style="font-size: 14px; color: #991B1B; margin-bottom: 12px; font-weight: 600;">Most Negative</div>
            <div v-for="[demographic, score] in topDemographicScores.negative" :key="demographic"
                 style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #991B1B;">{{ demographic }}</span>
              <span style="color: #991B1B; font-weight: 600;">{{ getSentimentEmoji(score) }} {{ getSentimentLabel(score) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Full Budget Breakdown (if enabled) -->
    <div v-if="includeFullBreakdown" class="full-breakdown-table" style="padding: 0 40px; margin-bottom: 30px;">
      <h2 style="font-size: 20px; font-weight: 600; color: #1a365d; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">
        Detailed Budget Breakdown
      </h2>
      
      <!-- Revenue Sources (new page) -->
      <div class="page-break-before"></div>
      <h3 style="font-size: 16px; font-weight: 600; color: #2d3748; margin: 12px 0 8px;">Revenue Sources</h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 30px; padding-top: 0;">
        <div v-for="source in getSortedRevenueSources" :key="source.name" 
             style="background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; overflow: hidden; min-height: 120px; page-break-inside: avoid;">
          <!-- Header -->
          <div style="padding: 12px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <div style="font-size: 14px; font-weight: 600; color: #1a365d;">{{ source.name }}</div>
          </div>
          <!-- Content -->
          <div style="padding: 12px;">
            <!-- Base Amount -->
            <div style="margin-bottom: 8px;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">Base Amount</div>
              <div style="font-size: 14px; font-weight: 600; color: #1a365d;">{{ formatCurrency(source.baseAmount) }}</div>
            </div>
            <!-- Adjusted Amount -->
            <div style="margin-bottom: 8px;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">Adjusted Amount</div>
              <div style="font-size: 14px; font-weight: 600; color: #1a365d;">{{ formatCurrency(source.adjustedAmount) }}</div>
            </div>
            <!-- Change -->
            <div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">Change</div>
              <div :style="{
                fontSize: '14px',
                fontWeight: '600',
                color: source.change > 0 ? '#059669' : source.change < 0 ? '#dc2626' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }">
                <span>{{ formatPercentageWithSign(source.change) }}</span>
                <span v-if="source.change !== 0" style="font-size: 12px;">
                  {{ source.change > 0 ? '↑' : '↓' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Spending Categories (new page) -->
      <div class="page-break-before"></div>
      <h3 style="font-size: 16px; font-weight: 600; color: #2d3748; margin: 12px 0 8px;">Spending Categories</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #64748b; font-weight: 600;">Category</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0; color: #64748b; font-weight: 600;">Base Amount</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0; color: #64748b; font-weight: 600;">Adjusted Amount</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0; color: #64748b; font-weight: 600;">Change</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in getSortedSpendingCategories" :key="category.name" style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; color: #1a365d;">{{ category.name }}</td>
            <td style="padding: 12px; text-align: right; color: #1a365d;">{{ formatCurrency(category.baseAmount) }}</td>
            <td style="padding: 12px; text-align: right; color: #1a365d;">{{ formatCurrency(category.adjustedAmount) }}</td>
            <td style="padding: 12px; text-align: right; color: #1a365d;" :style="{ color: category.change > 0 ? '#059669' : category.change < 0 ? '#dc2626' : '#64748b' }">
              {{ formatPercentageWithSign(category.change) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="margin-top: 40px; padding: 20px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
      <p style="margin: 0;">This budget summary was generated using the Canada Tax Calculator's Budget Simulator.</p>
      <p style="margin: 8px 0 0;">For more information, visit: <a href="https://hj799web.github.io/Tax-calculator-website/" style="color: #2c5282; text-decoration: none;">https://hj799web.github.io/Tax-calculator-website/</a></p>
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

// Helper function to format percentage change with proper sign
const formatPercentageWithSign = (value) => {
  const percentage = (value * 100).toFixed(1);
  return `${percentage > 0 ? '+' : ''}${percentage}%`;
};

// Helper function to calculate percentage change
const calculatePercentageChange = (baseAmount, adjustedAmount) => {
  if (!baseAmount || baseAmount === 0) return 0;
  return (adjustedAmount - baseAmount) / baseAmount;
};

// Helper function to get top positive and negative scores
const getTopSentimentScores = (scores, count = 2) => {
  const entries = Object.entries(scores);
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  return {
    positive: sorted.slice(0, count),
    negative: sorted.slice(-count).reverse()
  };
};

// Computed properties for top sentiment scores
const topProvinceScores = computed(() => {
  if (!props.sentimentScores?.provinces) return { positive: [], negative: [] };
  return getTopSentimentScores(props.sentimentScores.provinces);
});

const topSectorScores = computed(() => {
  if (!props.sentimentScores?.sectors) return { positive: [], negative: [] };
  return getTopSentimentScores(props.sentimentScores.sectors);
});

const topDemographicScores = computed(() => {
  if (!props.sentimentScores?.demographics) return { positive: [], negative: [] };
  return getTopSentimentScores(props.sentimentScores.demographics);
});

// Computed property to get sorted revenue sources by percentage change
const getSortedRevenueSources = computed(() => {
  if (!props.budget?.revenueSources) return [];
  
  return Object.values(props.budget.revenueSources)
    .map(source => {
      const baseAmount = source.base * source.rate;
      const adjustedAmount = source.adjustedAmount;
      const change = calculatePercentageChange(baseAmount, adjustedAmount);
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

  /* Improve color contrast for print */
  @media print and (color) {
    * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
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

.page-break-before {
  page-break-before: always;
  break-before: page;
}
</style>
