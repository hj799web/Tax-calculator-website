<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="modal-backdrop"
        @click="closeModal"
      >
        <div
          class="modal-container"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="modal-header">
            <h2 class="modal-title">
              Achievement Badges
            </h2>
            <button
              class="close-button"
              aria-label="Close modal"
              @click="closeModal"
            >
              <span class="material-icons">close</span>
            </button>
          </div>
          
          <!-- Modal Content -->
          <div class="modal-content">
            <!-- Earned Badges Section -->
            <div
              v-if="earnedBadges.length > 0"
              class="badges-section"
            >
              <h3 class="section-title">
                Earned Badges
              </h3>
              <div class="badges-grid">
                <div 
                  v-for="badge in earnedBadges" 
                  :key="badge.title"
                  class="badge-card earned"
                >
                  <div class="badge-icon">
                    {{ badge.icon }}
                  </div>
                  <div class="badge-info">
                    <h4 class="badge-title">
                      {{ badge.title }}
                    </h4>
                    <p class="badge-explanation">
                      {{ badge.explanation }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Unearned Badges Section -->
            <div
              v-if="unearnedBadges.length > 0"
              class="badges-section"
            >
              <h3 class="section-title">
                Badges to Unlock
              </h3>
              <div class="badges-grid">
                <div 
                  v-for="badge in unearnedBadges" 
                  :key="badge.title"
                  class="badge-card unearned"
                >
                  <div class="badge-icon">
                    {{ badge.icon }}
                  </div>
                  <div class="badge-info">
                    <h4 class="badge-title">
                      {{ badge.title }}
                    </h4>
                    <p class="badge-explanation">
                      <span class="how-to-earn">How to earn: </span>
                      {{ getBadgeHint(badge) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- No Badges Message -->
            <div
              v-if="allBadges.length === 0"
              class="no-badges"
            >
              <p>No badges available. Start making budget decisions to earn badges!</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useBudgetSimulatorStore } from '@/stores/budgetSimulator';
import { badgeConfig } from '@/config/badgeConfig';

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['close']);

// Store
const budgetStore = useBudgetSimulatorStore();

// Computed properties
const earnedBadges = computed(() => {
  return budgetStore.badges || [];
});

const allBadges = computed(() => {
  return badgeConfig || [];
});

const unearnedBadges = computed(() => {
  const earnedTitles = earnedBadges.value.map(badge => badge.title);
  return allBadges.value.filter(badge => !earnedTitles.includes(badge.title));
});

// Methods
function closeModal() {
  emit('close');
}

function getBadgeHint(badge) {
  // Generate hints based on badge conditions
  // This is a simplified version - you may want to add more specific hints
  switch (badge.tier) {
    case 'fiscal':
      return 'Focus on balancing the budget and managing fiscal policies.';
    case 'economic':
      return 'Prioritize economic growth and investment.';
    case 'social':
      return 'Increase spending on social programs and services.';
    case 'environmental':
      return 'Invest in environmental protection and sustainability.';
    case 'diplomatic':
      return 'Focus on international relations and diplomatic initiatives.';
    case 'balanced':
      return 'Create a balanced approach across multiple policy areas.';
    default:
      return 'Make strategic budget decisions to unlock this badge.';
  }
}

// Close modal on escape key
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeyDown);
  } else {
    document.removeEventListener('keydown', handleKeyDown);
  }
});

function handleKeyDown(e) {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal();
  }
}
</script>

<style scoped>
/* Import Google Font */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

/* Modal Base Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-container {
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(to right, #4263eb, #3b82f6);
  color: white;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
}

.close-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.close-button:hover {
  transform: scale(1.1);
}

/* Modal Content */
.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
}

/* Badges Sections */
.badges-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

/* Badge Cards */
.badge-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.badge-card.earned {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border: 1px solid #e2e8f0;
  box-shadow: 4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff;
}

.badge-card.unearned {
  background: linear-gradient(145deg, #f8f9fa, #e9ecef);
  border: 1px solid #e9ecef;
  box-shadow: 2px 2px 5px #d1d1d1, -2px -2px 5px #ffffff;
  opacity: 0.7;
  filter: grayscale(80%);
}

.badge-card:hover {
  transform: translateY(-3px);
}

.badge-card.earned:hover {
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px #ffffff;
}

.badge-card.unearned:hover {
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.08), -4px -4px 8px #ffffff;
  opacity: 0.85;
  filter: grayscale(60%);
}

.badge-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
}

.badge-info {
  flex-grow: 1;
}

.badge-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #2d3748;
}

.badge-explanation {
  font-size: 0.9rem;
  color: #4a5568;
  margin: 0;
  line-height: 1.4;
}

.how-to-earn {
  font-weight: 500;
  color: #3182ce;
}

/* No Badges Message */
.no-badges {
  text-align: center;
  padding: 2rem;
  color: #718096;
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .badges-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-container {
    width: 95%;
    max-height: 90vh;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
  
  .badge-icon {
    font-size: 2rem;
  }
}
</style>
