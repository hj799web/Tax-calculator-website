<template>
  <teleport to="body">
    <transition name="modal" appear>
      <div v-if="modelValue" class="shared-budget-modal" 
           aria-modal="true" role="dialog" 
           tabindex="-1">
        <!-- Modal Backdrop -->
        <div 
          class="modal-backdrop"
          @click="$emit('update:modelValue', false)"
        ></div>
        
        <!-- Modal Container -->
        <div class="modal-container">
          <!-- Modal Header with optional party color styling -->
          <div class="modal-header" :style="partyHeaderStyle">
            <h2 class="modal-title">{{ budgetData.title || 'Shared Budget Details' }}</h2>
            <button 
              @click="$emit('update:modelValue', false)"
              class="close-button"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="modal-body">
            <!-- Detailed Card Preview -->
            <BudgetSentimentBadgeCard :budget-data="budgetData" />
                <div class="metric-card" :class="budgetData.surplus >= 0 ? 'positive' : 'negative'">
                  <div class="metric-icon">
                    <span class="material-icons">{{ budgetData.surplus >= 0 ? 'trending_up' : 'trending_down' }}</span>
                  </div>
                  <div class="metric-content">
                    <div class="metric-label">{{ budgetData.surplus >= 0 ? 'Surplus' : 'Deficit' }}</div>
                    <div class="metric-value">
                      {{ budgetData.surplus >= 0 ? '+' : '' }}${{ formatCurrency(budgetData.surplus) }}B
                    </div>
                  </div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-icon">
                    <span class="material-icons">payments</span>
                  </div>
                  <div class="metric-content">
                    <div class="metric-label">Revenue</div>
                    <div class="metric-value">${{ formatCurrency(budgetData.revenue) }}B</div>
                  </div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-icon">
                    <span class="material-icons">account_balance</span>
                  </div>
                  <div class="metric-content">
                    <div class="metric-label">Debt-to-GDP</div>
                    <div class="metric-value">{{ budgetData.debt.toFixed(1) }}%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Party Budget Description & Highlights (if available) -->
            <div v-if="budgetData.description || budgetData.highlights?.length" class="budget-highlights-section">
              <div v-if="budgetData.description" class="budget-description">
                <p>{{ budgetData.description }}</p>
              </div>
              
              <div v-if="budgetData.highlights?.length" class="budget-highlights">
                <h3 class="highlights-title">Budget Highlights</h3>
                <ul class="highlights-list">
                  <li v-for="(highlight, index) in budgetData.highlights" :key="index" class="highlight-item">
                    <span class="highlight-bullet">•</span>
                    <span class="highlight-text">{{ highlight }}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Sentiment Analysis Section -->
            <div class="sentiment-section">
              <h3 class="section-title">Budget Impact Analysis</h3>
              
              <!-- Positive Segments -->
              <div v-if="budgetData.positiveSegments.length > 0" class="sentiment-group">
                <div class="sentiment-header positive">
                  <span class="material-icons">trending_up</span>
                  <h4>Most Positive Impact</h4>
                </div>
                <div class="segments-grid">
                  <div v-for="segment in budgetData.positiveSegments" :key="segment.name" 
                       class="segment-card positive">
                    <div class="segment-score">+{{ formatSegmentScore(segment.score) }}</div>
                    <div class="segment-name">{{ segment.name }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Negative Segments -->
              <div v-if="budgetData.negativeSegments.length > 0" class="sentiment-group">
                <div class="sentiment-header negative">
                  <span class="material-icons">trending_down</span>
                  <h4>Most Negative Impact</h4>
                </div>
                <div class="segments-grid">
                  <div v-for="segment in budgetData.negativeSegments" :key="segment.name" 
                       class="segment-card negative">
                    <div class="segment-score">{{ formatSegmentScore(segment.score) }}</div>
                    <div class="segment-name">{{ segment.name }}</div>
                  </div>
                </div>
              </div>
              
              <div v-if="budgetData.positiveSegments.length === 0 && budgetData.negativeSegments.length === 0" 
                   class="no-data-message">
                No sentiment data available for this budget.
              </div>
            </div>
            
            <!-- Badges Section -->
            <div class="badges-section">
              <h3 class="section-title">Achievements Earned</h3>
              
              <div v-if="budgetData.badges.length > 0" class="badges-grid">
                <div v-for="badge in budgetData.badges" :key="badge.name" 
                     class="badge-card">
                  <div class="badge-icon">{{ badge.icon }}</div>
                  <div class="badge-content">
                    <div class="badge-name">{{ badge.name }}</div>
                    <div class="badge-description">{{ badge.explanation || 'Achievement earned through budget choices' }}</div>
                  </div>
                </div>
              </div>
              
              <div v-if="budgetData.badges.length === 0" class="no-data-message">
                No badges earned with this budget yet.
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div class="action-buttons">
              <button @click="applyBudget" class="apply-button">
                <span class="material-icons">play_arrow</span>
                Apply This Budget
              </button>
              <button @click="$emit('update:modelValue', false)" class="cancel-button">
                Create My Own Budget
              </button>
            </div>
          </div>
        </transition>
      </teleport>
</template>

<script setup>
import { computed, ref } from 'vue';
import { handleError } from '@/utils/errorHandler.js';
import BudgetSentimentBadgeCard from '@/domains/badges/components/BudgetSentimentBadgeCard.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  budgetData: {
    type: Object,
    default: () => ({
      surplus: 0,
      revenue: 0,
      debt: 0,
      badges: [],
      positiveSegments: [],
      negativeSegments: [],
      title: '',
      description: '',
      partyId: null,
      partyColor: '',
      highlights: [],
      sliders: {}
    })
  }
});

// Create a dynamic style for the header based on party color
const partyHeaderStyle = computed(() => {
  if (props.budgetData.partyColor) {
    return {
      background: `linear-gradient(135deg, ${props.budgetData.partyColor}, ${lightenColor(props.budgetData.partyColor, 20)})`,
      color: '#ffffff'
    };
  }
  return {};
});

// Helper function to lighten a color for the gradient
function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Format currency for display
function formatCurrency(value) {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.0';
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
  }

// Format segment score for display
function formatSegmentScore(score) {
  return Math.abs(score).toFixed(1);
}

const emit = defineEmits(['update:modelValue', 'apply-budget']);

// Removed unused budgetStore variable

const errorMessage = ref('');

// Apply the shared budget to the simulator
const applyBudget = () => {
  try {
    // Emit event to parent component to handle the budget application
    emit('apply-budget', props.budgetData);
    // Close the modal
    emit('update:modelValue', false);
  } catch (error) {
    handleError(error, (msg) => errorMessage.value = msg);
  }
};
</script>

<style scoped>
/* Modal Styles */
.shared-budget-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: transparent;
  border: none;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 4rem);
}

/* Section Styles */
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a202c;
}

/* Budget Summary Styles */
.budget-summary {
  margin-bottom: 2rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-card {
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.metric-card.positive {
  background-color: #f0fff4;
  border-left: 4px solid #48bb78;
}

.metric-card.negative {
  background-color: #fff5f5;
  border-left: 4px solid #f56565;
}

.metric-icon {
  margin-right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-card.positive .metric-icon {
  background-color: #c6f6d5;
  color: #38a169;
}

.metric-card.negative .metric-icon {
  background-color: #fed7d7;
  color: #e53e3e;
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}

.metric-card.positive .metric-value {
  color: #38a169;
}

.metric-card.negative .metric-value {
  color: #e53e3e;
}

/* Sentiment Section Styles */
.sentiment-section {
  margin-bottom: 2rem;
}

.sentiment-group {
  margin-bottom: 1.5rem;
}

.sentiment-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.sentiment-header.positive {
  color: #38a169;
}

.sentiment-header.negative {
  color: #e53e3e;
}

.sentiment-header .material-icons {
  margin-right: 0.5rem;
}

.sentiment-header h4 {
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
}

.segments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.segment-card {
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
}

.segment-card.positive {
  background-color: #f0fff4;
  border: 1px solid #c6f6d5;
}

.segment-card.negative {
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
}

.segment-score {
  font-weight: 600;
  margin-right: 0.75rem;
  min-width: 3rem;
  text-align: center;
}

.segment-card.positive .segment-score {
  color: #38a169;
}

.segment-card.negative .segment-score {
  color: #e53e3e;
}

.segment-name {
  font-size: 0.875rem;
  color: #4a5568;
}

/* Badges Section Styles */
.badges-section {
  margin-bottom: 2rem;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.badge-card {
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.badge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.badge-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.badge-content {
  flex: 1;
}

.badge-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1a202c;
}

.badge-description {
  font-size: 0.875rem;
  color: #4a5568;
}

/* Action Buttons Styles */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.apply-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.apply-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.apply-button .material-icons {
  margin-right: 0.5rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #cbd5e0;
}

.no-data-message {
  text-align: center;
  padding: 1.5rem;
  color: #718096;
  font-style: italic;
  background-color: #f7fafc;
  border-radius: 8px;
}

/* Budget Highlights Styles */
.budget-highlights-section {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1.25rem;
  margin: 1.5rem 0;
  border-left: 4px solid #4f46e5;
}

.budget-description {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #4b5563;
  margin-bottom: 1rem;
}

.highlights-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.highlights-list {
  padding-left: 0.25rem;
  list-style-type: none;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.highlight-bullet {
  color: #4f46e5;
  font-size: 1.25rem;
  margin-right: 0.5rem;
  line-height: 1.2;
}

.highlight-text {
  font-size: 0.95rem;
  line-height: 1.4;
  color: #374151;
}

/* Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .modal-container {
    background-color: #1a202c;
  }
  
  .section-title {
    color: #e2e8f0;
  }
  
  .metric-card {
    background-color: #2d3748;
  }
  
  .metric-card.positive {
    background-color: rgba(56, 161, 105, 0.2);
  }
  
  .metric-card.negative {
    background-color: rgba(229, 62, 62, 0.2);
  }
  
  .metric-label {
    color: #a0aec0;
  }
  
  .metric-value {
    color: #e2e8f0;
  }
  
  .segment-card {
    background-color: #2d3748;
    border-color: #4a5568;
  }
  
  .segment-card.positive {
    background-color: rgba(56, 161, 105, 0.2);
    border-color: rgba(56, 161, 105, 0.4);
  }
  
  .segment-card.negative {
    background-color: rgba(229, 62, 62, 0.2);
    border-color: rgba(229, 62, 62, 0.4);
  }
  
  .segment-name {
    color: #a0aec0;
  }
  
  .badge-card {
    background-color: #2d3748;
  }
  
  .badge-name {
    color: #e2e8f0;
  }
  
  .badge-description {
    color: #a0aec0;
  }
  
  .cancel-button {
    background-color: #4a5568;
    color: #e2e8f0;
  }
  
  .cancel-button:hover {
    background-color: #2d3748;
  }
  
  .no-data-message {
    background-color: #2d3748;
    color: #a0aec0;
  }
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .metrics-grid,
  .segments-grid,
  .badges-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .apply-button,
  .cancel-button {
    width: 100%;
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
