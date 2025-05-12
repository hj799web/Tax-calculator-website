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
      <div style="padding: 10px; background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 5px; color: #92400E;">
        <div style="font-size: 16px; font-weight: bold;">
          {{ badge.icon }} {{ badge.title }}
        </div>
        <div style="font-size: 12px;">
          {{ badge.description }}
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
    <div style="margin-bottom: 20px; padding: 0 20px;">
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
      style="margin-bottom: 20px; padding: 0 20px;"
    >
      <h2 style="font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px; margin-bottom: 15px;">
        Public Sentiment Analysis
      </h2>
      
      <!-- Overall Sentiment Score -->
      <div style="margin-bottom: 15px; padding: 15px; background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px;">
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
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; color: #4B5563;">
          <thead style="text-transform: uppercase; font-size: 11px; background-color: #F3F4F6;">
            <tr>
              <th style="padding: 8px 12px; border-bottom: 1px solid #E5E7EB;">
                Source
              </th>
              <th style="padding: 8px 12px; text-align: right; border-bottom: 1px solid #E5E7EB;">
                Amount
              </th>
              <th style="padding: 8px 12px; text-align: right; border-bottom: 1px solid #E5E7EB;">
                % of Total
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="budget?.revenueSources">
              <tr
                v-for="(source, id) in budget.revenueSources"
                :key="id"
                style="border-bottom: 1px solid #E5E7EB;"
              >
                <td style="padding: 8px 12px;">
                  {{ source.name }}
                </td>
                <td style="padding: 8px 12px; text-align: right;">
                  {{ formatCurrency(source.adjustedAmount) }}
                </td>
                <td style="padding: 8px 12px; text-align: right;">
                  {{ ((source.adjustedAmount / totalRevenue) * 100).toFixed(1) }}%
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot style="font-weight: 600; background-color: #EFF6FF;">
            <tr>
              <td style="padding: 8px 12px;">
                Total Revenue
              </td>
              <td style="padding: 8px 12px; text-align: right;">
                {{ formatCurrency(totalRevenue) }}
              </td>
              <td style="padding: 8px 12px; text-align: right;">
                100%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- Spending Breakdown -->
      <div>
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px; color: #5B21B6;">
          Spending Categories
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; color: #4B5563;">
          <thead style="text-transform: uppercase; font-size: 11px; background-color: #F3F4F6;">
            <tr>
              <th style="padding: 8px 12px; border-bottom: 1px solid #E5E7EB;">
                Category
              </th>
              <th style="padding: 8px 12px; text-align: right; border-bottom: 1px solid #E5E7EB;">
                Amount
              </th>
              <th style="padding: 8px 12px; text-align: right; border-bottom: 1px solid #E5E7EB;">
                % of Total
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="budget?.spendingCategories">
              <tr
                v-for="(category, id) in getMainSpendingCategories()"
                :key="id"
                style="border-bottom: 1px solid #E5E7EB;"
              >
                <td style="padding: 8px 12px;">
                  {{ category.name }}
                </td>
                <td style="padding: 8px 12px; text-align: right;">
                  {{ formatCurrency(category.adjustedAmount) }}
                </td>
                <td style="padding: 8px 12px; text-align: right;">
                  {{ ((category.adjustedAmount / totalSpending) * 100).toFixed(1) }}%
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot style="font-weight: 600; background-color: #F5F3FF;">
            <tr>
              <td style="padding: 8px 12px;">
                Total Spending
              </td>
              <td style="padding: 8px 12px; text-align: right;">
                {{ formatCurrency(totalSpending) }}
              </td>
              <td style="padding: 8px 12px; text-align: right;">
                100%
              </td>
            </tr>
          </tfoot>
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
// Props: budgetTitle, badge, narrative, totalRevenue, totalSpending, surplus, sentimentScores, includeFullBreakdown, budget, formatCurrency
import { getSentimentEmoji, getSentimentLabel } from '@/domains/sentiment/utils/computeSentimentScores';

const props = defineProps({
  budgetTitle: { type: String, default: 'Budget Summary' },
  badge: { type: Object, default: () => ({ title: '', description: '', icon: '🏆' }) },
  narrative: { type: String, default: '' },
  totalRevenue: { type: Number, default: 0 },
  totalSpending: { type: Number, default: 0 },
  surplus: { type: Number, default: 0 },
  sentimentScores: { type: Object, default: () => ({}) },
  includeFullBreakdown: { type: Boolean, default: false },
  budget: { type: Object, default: () => ({}) },
  formatCurrency: { type: Function, default: (val) => `$${val}B` }
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

// Helper function to get main spending categories (non-group categories)
function getMainSpendingCategories() {
  if (!props.budget?.spendingCategories) return [];
  
  return Object.values(props.budget.spendingCategories)
    .filter(category => !category.isGroup)
    .map(category => ({
      id: category.id,
      name: category.name,
      adjustedAmount: category.baseAmount * category.adjustmentFactor
    }))
    .sort((a, b) => b.adjustedAmount - a.adjustedAmount); // Sort by amount descending
}
</script>

<style scoped>
.export-container.summary-only .full-breakdown-table {
  display: none;
}
</style>
