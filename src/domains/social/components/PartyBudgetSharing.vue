<template>
  <div class="party-budget-sharing bg-white rounded-lg shadow p-4 mb-4">
    <h3 class="text-lg font-semibold mb-2">Canadian Party Budget Approaches (2025)</h3>
    <p class="text-sm text-gray-600 mb-4">Explore how different parties would shape Canada's finances</p>
    
    <div class="grid grid-cols-3 gap-3">
      <div 
        v-for="party in partyBudgets" 
        :key="party.id"
        class="party-card flex flex-col rounded-md overflow-hidden shadow-sm"
      >
        <!-- Party header with color branding -->
        <div 
          class="party-header py-2 px-3 text-white text-center"
          :style="{ backgroundColor: party.buttonColor }"
        >
          <h4 class="font-bold">{{ party.name.replace(' Budget 2025', '') }}</h4>
        </div>
        
        <!-- Action buttons -->
        <div class="p-2 flex justify-between items-center gap-2">
          <button 
            @click="applyBudget(party.id)"
            class="action-button apply-button flex-1 py-2 px-3 text-xs font-medium rounded"
            :class="{ 'active': activeParty === party.id }"
          >
            Apply
          </button>
          
          <button 
            @click="sharePartyBudget(party.id)"
            class="action-button share-button flex items-center justify-center py-2 px-2 text-xs rounded"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Copy Success Message -->
    <div v-if="copySuccess" class="mt-3 text-green-600 text-sm flex items-center">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      Link copied to clipboard!
    </div>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAvailablePartyBudgets, generatePartyBudgetUrl, applyPartyBudget } from '@/utils/partyBudgets';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import { handleError } from '@/utils/errorHandler.js';

// Get party budgets from the utility
const partyBudgets = getAvailablePartyBudgets();

// Get the budget store using Pinia
const budgetStore = useBudgetSimulatorStore();

// State tracking
const copySuccess = ref(false);
const activeParty = ref(null);
const errorMessage = ref('');

/**
 * Apply a party budget to the simulator, updating all sliders
 * @param {string} partyId - ID of the party budget to apply
 */
function applyBudget(partyId) {
  if (!partyId || !partyBudgets.find(p => p.id === partyId)) {
    handleError(new Error('Invalid party ID'), (msg) => {
      errorMessage.value = msg;
    });
    return;
  }
  
  try {
    const result = applyPartyBudget(partyId, budgetStore);
    
    if (result) {
      activeParty.value = partyId;
      // Show success message
      const partyName = partyBudgets.find(p => p.id === partyId)?.name || partyId;
      console.log(`Successfully applied ${partyName}`);
    }
  } catch (error) {
    handleError(error, (msg) => {
      errorMessage.value = msg;
    });
  }
}

/**
 * Share a party budget by copying link to clipboard or showing share sheet on mobile
 * @param {string} partyId - ID of the party budget to share
 */
function sharePartyBudget(partyId) {
  try {
    const url = generatePartyBudgetUrl(partyId);
    
    if (!url) {
      handleError(new Error('Failed to generate party budget URL'), (msg) => {
        errorMessage.value = msg;
      });
      return;
    }
    
    // If Web Share API is available (mobile devices)
    if (navigator.share) {
      navigator.share({
        title: `${partyId.charAt(0).toUpperCase() + partyId.slice(1)} Party Budget 2025`,
        text: 'Check out this budget simulation for the 2025 fiscal year',
        url: url
      }).catch(err => {
        handleError(err, (msg) => {
          errorMessage.value = msg;
        });
        copyToClipboard(url);
      });
    } else {
      // Otherwise use clipboard
      copyToClipboard(url);
    }
  } catch (error) {
    handleError(error, (msg) => {
      errorMessage.value = msg;
    });
  }
}

/**
 * Copy text to clipboard and show success message
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      copySuccess.value = true;
      setTimeout(() => {
        copySuccess.value = false;
      }, 3000);
    })
    .catch(err => {
      handleError(err, (msg) => {
        errorMessage.value = msg;
      });
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copySuccess.value = true;
        setTimeout(() => {
          copySuccess.value = false;
        }, 3000);
      } catch (fallbackError) {
        handleError(fallbackError, (msg) => {
          errorMessage.value = msg;
        });
      }
    });
}
</script>

<style scoped>
.party-budget-sharing {
  border-top: 3px solid #e5e7eb;
}

.party-card {
  transition: all 0.2s ease;
  background-color: white;
}

.party-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.party-header {
  font-size: 0.9rem;
}

.action-button {
  transition: all 0.2s ease;
}

.apply-button {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.apply-button:hover {
  background-color: #e5e7eb;
}

.apply-button.active {
  background-color: #10b981;
  color: white;
  border-color: #059669;
}

.share-button {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.share-button:hover {
  background-color: #e5e7eb;
}
</style>
