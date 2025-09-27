<template>
  <teleport to="body">
    <transition name="modal" appear>
      <div v-if="modelValue" class="social-share-modal" 
           aria-modal="true" role="dialog" 
           tabindex="-1">
        <!-- Premium Backdrop -->
        <div 
          class="modal-backdrop"
          @click="$emit('update:modelValue', false)"
        ></div>
        
        <!-- Modal Container -->
        <div 
          class="modal-container"
          :style="{
            width: isMobile ? '90vw' : '80vw',
            maxWidth: '80rem',
            maxHeight: '95vh'
          }"
        >
          <!-- Loading Indicator -->
          <div v-if="props.isLoading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <p class="loading-text">Preparing your budget visualization...</p>
          </div>
          <!-- Header -->
          <div class="sticky top-0 w-full bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
            <h2 class="text-xl font-semibold">{{ t('socialShare.title', 'Share Your Budget') }}</h2>
            <button 
              @click="$emit('update:modelValue', false)"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              :aria-label="t('socialShare.closeModal', 'Close modal')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- Body Content -->
          <div class="overflow-y-auto" style="max-height: calc(v-bind('modalMaxHeight') - 4rem); overflow-x: hidden;">
            <!-- Two Column Layout -->
            <div class="px-6 py-4 md:grid md:grid-cols-2 md:gap-6">
              <!-- Left Column: Budget Preview -->
              <div class="social-media-buttons">
                <h4 class="text-lg font-semibold mb-4">Share on Social Media</h4>
                <div class="flex flex-col gap-3 mb-6">
                  <!-- Link Preview with Detailed Card -->
                  <div class="link-preview-container" ref="socialCardRef">
                    <div class="link-preview">
                      <div class="link-preview-header">
                        <div class="link-preview-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                            <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                          </svg>
                        </div>
                        <div class="link-preview-title">Federal Canadian Budget Simulator</div>
                      </div>
                      
                      <!-- Budget Metrics -->
                      <div class="link-preview-content">
                        <div class="link-preview-metrics">
                          <div class="metric">
                            <div class="metric-label">Revenue</div>
                            <div class="metric-value">{{ formatCurrency(effectiveTotalRevenue) }}B</div>
                          </div>
                          
                          <div class="metric" :class="effectiveBudgetSurplus >= 0 ? 'positive' : 'negative'">
                            <div class="metric-label">{{ effectiveBudgetSurplus >= 0 ? 'Surplus' : 'Deficit' }}</div>
                            <div class="metric-value">{{ effectiveBudgetSurplus >= 0 ? '+' : '' }}{{ formatCurrency(effectiveBudgetSurplus) }}B</div>
                          </div>
                          
                          <div class="metric">
                            <div class="metric-label">Debt-to-GDP</div>
                            <div class="metric-value">{{ effectiveDebtToGdpRatio.toFixed(1) }}%</div>
                          </div>
                        </div>
                        
                        <!-- Compact Sentiment and Badge Preview -->
                        <div class="compact-preview">
                          <!-- Top Positive/Negative Segments -->
                          <div class="compact-segments">
                            <div v-if="mostPositiveSegments.length > 0" class="compact-segment positive">
                              <span class="material-icons">trending_up</span>
                              <span>{{ mostPositiveSegments[0]?.name }}</span>
                            </div>
                            <div v-if="mostNegativeSegments.length > 0" class="compact-segment negative">
                              <span class="material-icons">trending_down</span>
                              <span>{{ mostNegativeSegments[0]?.name }}</span>
                            </div>
                          </div>
                          
                          <!-- Top Badges -->
                          <div class="compact-badges">
                            <div v-for="badge in effectiveBadges.slice(0, 2)" :key="badge.name" class="compact-badge">
                              <span class="badge-icon">{{ badge.icon }}</span>
                              <span class="badge-name">{{ badge.name }}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="link-preview-url">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
                          </svg>
                          <span>{{ safeHostUrl }}/budget-simulator</span>
                        </div>
                      </div>
                      
                      <!-- Detailed Budget Sentiment and Badge Card -->
                      <div class="link-preview-detailed-card">
                        <h3 class="text-xl font-bold mb-3">Budget Impact Analysis</h3>
                        <BudgetSentimentBadgeCard :budget-data="previewBudgetData" />
                      </div>
                    </div>
                    
                    <div class="link-preview-description">
                      <p>This link will share your budget with the key metrics shown above. Recipients can click the link to see your full budget details.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Right Column: Share Options -->
              <div>
                <h4 class="text-lg font-semibold mb-4">Share Your Budget</h4>
                
                <!-- Social Share Buttons -->
                <div class="flex flex-col gap-3 mb-6">
                  <button 
                    @click="shareToSocialMedia('twitter')"
                    class="social-button twitter-button"
                    :class="{ 'shared': sharedPlatform === 'twitter' }"
                  >
                    <template v-if="sharedPlatform === 'twitter'">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      Shared on X
                    </template>
                    <template v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Share on X
                    </template>
                  </button>
                  
                  <button 
                    @click="shareToSocialMedia('facebook')"
                    class="flex items-center gap-3 px-5 py-3 rounded-lg text-white transition-all hover:scale-105 bg-[var(--color-facebook)] hover:bg-[var(--facebook-hover)]"
                    :aria-label="t('socialShare.shareOnFacebook', 'Share on Facebook')"
                    :title="t('socialShare.shareOnFacebookTitle', 'Share your budget on Facebook')"
                  >
                    <template v-if="sharedPlatform === 'facebook'">
                      <span class="material-icons animate-pop">check_circle</span>
                      Shared!
                    </template>
                    <template v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      {{ t('socialShare.shareOnFacebook', 'Share on Facebook') }}
                    </template>
                  </button>
                  
                  <button 
                    @click="shareToSocialMedia('linkedin')"
                    class="flex items-center gap-3 px-5 py-3 rounded-lg text-white transition-all hover:scale-105 bg-[var(--color-linkedin)] hover:bg-[var(--linkedin-hover)]"
                    :aria-label="t('socialShare.shareOnLinkedIn', 'Share on LinkedIn')"
                    :title="t('socialShare.shareOnLinkedInTitle', 'Share your budget on LinkedIn')"
                  >
                    <template v-if="sharedPlatform === 'linkedin'">
                      <span class="material-icons animate-pop">check_circle</span>
                      Shared!
                    </template>
                    <template v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      {{ t('socialShare.shareOnLinkedIn', 'Share on LinkedIn') }}
                    </template>
                  </button>
                  
                  <button 
                    @click="shareToSocialMedia('instagram')"
                    class="flex items-center gap-3 px-5 py-3 rounded-lg text-white transition-all hover:scale-105 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600"
                    :aria-label="t('socialShare.shareOnInstagram', 'Share on Instagram')"
                    :title="t('socialShare.shareOnInstagramTitle', 'Share your budget on Instagram')"
                  >
                    <template v-if="sharedPlatform === 'instagram'">
                      <span class="material-icons animate-pop">check_circle</span>
                      Shared!
                    </template>
                    <template v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                      {{ t('socialShare.shareOnInstagram', 'Share on Instagram') }}
                    </template>
                  </button>
                </div>
                
                <!-- Download & Copy Buttons -->
                <div class="flex flex-col sm:flex-row gap-3">
                  <button 
                    @click="downloadImage"
                    class="flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white transition-all hover:scale-105 bg-emerald-600 hover:bg-emerald-700"
                    :aria-label="t('socialShare.downloadBudgetImage', 'Download budget image')"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    {{ t('socialShare.downloadBudgetImage', 'Download Image') }}
                  </button>
                  
                  <button 
                    @click="copyLink"
                    class="flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white transition-all hover:scale-105 bg-blue-600 hover:bg-blue-700"
                    :aria-label="t('socialShare.copyLinkToShare', 'Copy link to share')"
                  >
                    <template v-if="linkCopied">
                      <span class="material-icons animate-pop">check_circle</span>
                      {{ t('socialShare.copied', 'Copied!') }}
                    </template>
                    <template v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
                      </svg>
                      {{ t('socialShare.copyLinkToShare', 'Copy Link') }}
                    </template>
                  </button>
                  
                  <button 
                    @click="copyImage"
                    class="flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white transition-all hover:scale-105 bg-purple-600 hover:bg-purple-700"
                    :aria-label="t('socialShare.copyImageToClipboard', 'Copy image to clipboard')"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    {{ t('socialShare.copyImageToClipboard', 'Copy to Clipboard') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import html2canvas from 'html2canvas';
import BudgetSentimentBadgeCard from '@/domains/badges/components/BudgetSentimentBadgeCard.vue';
import { useBudgetSimulatorStore } from '@/domains/budget';
import { handleError } from '@/utils/errorHandler.js';
import { useI18n } from '@/i18n';

const { t } = useI18n();

// Build previewBudgetData from current store/computed values
const previewBudgetData = computed(() => ({
  sentiment: budgetStore.sentimentAnalysis?.overall || 3,
  surplus: effectiveBudgetSurplus.value,
  revenue: effectiveTotalRevenue.value,
  debt: effectiveDebtToGdpRatio.value,
  badges: props.earnedBadges || effectiveBadges.value.slice(0, 3),
  positiveSegments: props.sentimentScores ? getSentimentSegments(props.sentimentScores, true) : mostPositiveSegments.value,
  negativeSegments: props.sentimentScores ? getSentimentSegments(props.sentimentScores, false) : mostNegativeSegments.value,
  fiscalChaos: props.fiscalChaos || false
}));

// Helper function to extract sentiment segments from sentiment scores
function getSentimentSegments(sentimentScores, isPositive) {
  if (!sentimentScores) return [];
  
  // Collect all segments from different categories
  const allSegments = [];
  
  // Process provinces
  if (sentimentScores.provinces) {
    Object.entries(sentimentScores.provinces).forEach(([name, score]) => {
      allSegments.push({ name, score, category: 'provinces' });
    });
  }
  
  // Process demographics
  if (sentimentScores.demographics) {
    Object.entries(sentimentScores.demographics).forEach(([name, score]) => {
      // Format demographic names for better display
      const formattedName = name.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      allSegments.push({ name: formattedName, score, category: 'demographics' });
    });
  }
  
  // Process sectors
  if (sentimentScores.sectors) {
    Object.entries(sentimentScores.sectors).forEach(([name, score]) => {
      // Format sector names for better display
      const formattedName = name.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      allSegments.push({ name: formattedName, score, category: 'sectors' });
    });
  }
  
  // Sort and filter segments based on score
  return allSegments
    .sort((a, b) => isPositive ? b.score - a.score : a.score - b.score)
    .slice(0, 5)
    .filter(segment => isPositive ? segment.score > 3 : segment.score < 3);
}

// Access the budget store for current data
const budgetStore = useBudgetSimulatorStore();

// Setup reactive variables

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  budgetSurplus: { type: Number, default: 0 },
  debtToGdpRatio: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  totalSpending: { type: Number, default: 0 },
  badges: { type: Array, default: () => [] },
  shareUrl: { type: String, default: window.location.href },
  shareTitle: { type: String, default: 'Check out my budget!' },
  // Add missing props that were causing warnings
  sentimentScores: { type: Object, default: () => ({}) },
  earnedBadges: { type: Array, default: () => [] },
  fiscalChaos: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false }
});

// References and state
const socialCardRef = ref(null);
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);
const isMobile = computed(() => windowWidth.value < 768);
const sharedPlatform = ref(null);
const linkCopied = ref(false);
const modalMaxHeight = ref(window.innerHeight);
// eslint-disable-next-line no-unused-vars
const cardSize = ref({ width: 0, height: 0 });

// Ensure chart renders properly before html2canvas capture
const isGenerating = ref(false);
// eslint-disable-next-line no-unused-vars
const chartRendered = ref(false);

// Track which card type to display (regular or story)
// eslint-disable-next-line no-unused-vars
const cardType = ref('regular');

// Create computed versions of the props that fallback to store data if props are zero
const effectiveBudgetSurplus = computed(() => {
  return props.budgetSurplus || budgetStore.surplus || 0;
});

const effectiveDebtToGdpRatio = computed(() => {
  return props.debtToGdpRatio || (budgetStore.fiscalIndicators?.debtToGdpRatio) || 0;
});

const effectiveTotalRevenue = computed(() => {
  return props.totalRevenue || budgetStore.totalRevenue || 0;
});

// eslint-disable-next-line no-unused-vars
const effectiveTotalSpending = computed(() => {
  return props.totalSpending || budgetStore.totalSpending || 0;
});

const effectiveBadges = computed(() => {
  return props.badges || [];
});

// Utility functions for sentiment data validation
/**
 * Validates and normalizes segment data to ensure it has the correct structure
 * @param {Array} segments - Array of segment objects from sentiment analysis
 * @returns {Array} - Normalized array of segments with valid properties
 */
function validateSegments(segments) {
  if (!Array.isArray(segments)) return [];
  
  return segments.map(seg => ({
    name: typeof seg?.name === 'string' ? seg.name : 'Unknown',
    score: typeof seg?.score === 'number' && !isNaN(seg.score) ? seg.score : 0
  }));
}

// Safe access to window.location.host
const safeHostUrl = computed(() => {
  return typeof window !== 'undefined' ? window.location.host : 'budgetsimulator.ca';
});

// Get sentiment data from the store and normalize it
// eslint-disable-next-line no-unused-vars
const mostPositiveSegments = computed(() => {
  return validateSegments(budgetStore.sentimentAnalysis?.mostPositiveSegments || []).slice(0, 3);
});

// eslint-disable-next-line no-unused-vars
const mostNegativeSegments = computed(() => {
  return validateSegments(budgetStore.sentimentAnalysis?.mostNegativeSegments || []).slice(0, 3);
});

// Format currency for display
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-CA', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
};

// Handle window resize
const handleResize = () => {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
  modalMaxHeight.value = window.innerHeight;
};

// Add and remove event listeners
onMounted(() => {
  window.addEventListener('resize', handleResize);
  
  
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  
  
});



// Simplified Instagram sharing with link-based approach
const handleInstagramShare = () => {
  // Create a shareable URL with budget parameters
  const shareUrl = new URL('/budget-simulator', window.location.origin);
  
  // Add high-level budget parameters to the URL
  shareUrl.searchParams.set('surplus', Number(effectiveBudgetSurplus.value ?? 0).toFixed(1));
  shareUrl.searchParams.set('debt', Number(effectiveDebtToGdpRatio.value ?? 0).toFixed(1));
  shareUrl.searchParams.set('revenue', Number(effectiveTotalRevenue.value ?? 0).toFixed(1));
  
  // Add all revenue slider positions
  Object.entries(budgetStore.revenueSources).forEach(([key, source]) => {
    shareUrl.searchParams.set(`r_${key}`, Number(source.rate ?? 0).toFixed(2));
  });
  
  // Add all spending category slider positions
  Object.entries(budgetStore.spendingCategories).forEach(([key, category]) => {
    shareUrl.searchParams.set(`s_${key}`, Number(category.factor ?? 0).toFixed(2));
  });
  
  // Add badge information if available
  if (effectiveBadges.value.length > 0) {
    // Include up to 3 badge names
    const badgeNames = effectiveBadges.value.slice(0, 3).map(badge => badge.name).join(',');
    shareUrl.searchParams.set('badges', badgeNames);
  }
  
  // Add sentiment data if available
  if (mostPositiveSegments.value.length > 0) {
    const positiveData = mostPositiveSegments.value.map(seg => 
      `${encodeURIComponent(seg.name)}:${seg.score.toFixed(1)}`
    ).join(',');
    shareUrl.searchParams.set('pos', positiveData);
  }
  
  if (mostNegativeSegments.value.length > 0) {
    const negativeData = mostNegativeSegments.value.map(seg => 
      `${encodeURIComponent(seg.name)}:${seg.score.toFixed(1)}`
    ).join(',');
    shareUrl.searchParams.set('neg', negativeData);
  }
  
  // Create share text with key budget information
  const shareText = `Check out my Canadian federal budget with ${formatCurrency(effectiveTotalRevenue.value)}B in revenue and a ${effectiveBudgetSurplus.value >= 0 ? 'surplus' : 'deficit'} of ${formatCurrency(Math.abs(effectiveBudgetSurplus.value))}B!`;
  
  // Try to use Web Share API first for mobile devices
  if (navigator.share) {
    navigator.share({
      title: 'My Canadian Budget',
      text: shareText,
      url: shareUrl.toString()
    }).then(() => {
      // Success feedback
      sharedPlatform.value = 'instagram';
      setTimeout(() => sharedPlatform.value = null, 2000);
    }).catch(error => {
      handleError(error, (msg) => errorMessage.value = msg);
      // Fallback to opening Instagram
      openInstagramWithUrl(shareUrl.toString(), shareText);
    });
  } else {
    // Fallback for devices without Web Share API
    openInstagramWithUrl(shareUrl.toString(), shareText);
  }
};

// Helper function to open Instagram with URL
const openInstagramWithUrl = (url, text) => {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  // Try to open Instagram app
  
  if (isIOS || isAndroid) {
    // Try to open Instagram app
    window.location.href = `instagram://app`;
    
    // Set a timeout to check if Instagram opened
    setTimeout(() => {
      if (document.hidden) {
        // Instagram opened successfully
        console.log('Instagram opened successfully');
      } else {
        // Instagram didn't open, copy to clipboard and show instructions
        navigator.clipboard.writeText(`${text} ${url}`).then(() => {
          alert('Text and link copied to clipboard. Open Instagram and paste in your post or story.');
        }).catch(() => {
          // If clipboard fails, just show the URL
          alert(`Share this link on Instagram: ${url}`);
        });
      }
    }, 2000);
  } else {
    // Desktop fallback - copy to clipboard
    navigator.clipboard.writeText(`${text} ${url}`).then(() => {
      alert('Text and link copied to clipboard. Open Instagram on your mobile device and paste in your post or story.');
    }).catch(() => {
      // If clipboard fails, just show the URL
      alert(`Share this link on Instagram: ${url}`);
    });
  }
};

// Unified social media sharing function with confirmation feedback
const shareToSocialMedia = (platform) => {
  const budgetStatus = effectiveBudgetSurplus.value > 0 ? 
    `Surplus: $${formatCurrency(effectiveBudgetSurplus.value)}B` : 
    `Deficit: $${formatCurrency(Math.abs(effectiveBudgetSurplus.value))}B`;
  
  const title = `Check out my Canadian federal budget (${budgetStatus})`;
  const description = `I created this budget with the Canadian Tax Calculator. ${budgetStatus} with my custom revenue and spending choices.`;
  const url = props.shareUrl || window.location.href;
  
  const urls = {
    twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(description)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(url)}`
  };
  
  if (platform === 'instagram') {
    // For Instagram, we need a different approach since they don't support direct web sharing
    handleInstagramShare();
  } else {
    window.open(urls[platform], '_blank', 'width=600,height=400');
  }
  
  sharedPlatform.value = platform;
  setTimeout(() => sharedPlatform.value = null, 2000);
};

// Copy link to clipboard function
const copyLink = async () => {
  try {
    const url = props.shareUrl || window.location.href;
    await navigator.clipboard.writeText(url);
    linkCopied.value = true;
    setTimeout(() => linkCopied.value = false, 2000);
  } catch (err) {
    handleError(err, (msg) => errorMessage.value = msg);
    // Fallback for browsers that don't support clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = props.shareUrl || window.location.href;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      linkCopied.value = true;
      setTimeout(() => linkCopied.value = false, 2000);
    } catch (err) {
      console.error('Fallback: Failed to copy link:', err);
    }
    document.body.removeChild(textArea);
  }
};

// Calculate percentage with safety check
// eslint-disable-next-line no-unused-vars
const getPercentage = (amount, total) => {
  if (!total || total === 0) return 0;
  return (amount / total) * 100;
};

// Get random color for categories without colors
// eslint-disable-next-line no-unused-vars
const getRandomColor = (seed) => {
  const colors = [
    '#4299E1', // blue
    '#48BB78', // green
    '#F6AD55', // orange
    '#9F7AEA', // purple
    '#F56565', // red
    '#38B2AC', // teal
    '#ED8936', // orange-dark
    '#667EEA', // indigo
    '#D53F8C', // pink
    '#718096'  // gray
  ];
  
  return colors[seed % colors.length];
};

// Image generation and download
const generateImage = async () => {
  if (!socialCardRef.value) return null;
  
  try {
    isGenerating.value = true;
    
    const canvas = await html2canvas(socialCardRef.value, {
      scale: 2, 
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    return canvas;
  } catch (error) {
    handleError(error, (msg) => errorMessage.value = msg);
    return null;
  } finally {
    isGenerating.value = false;
  }
};

const downloadImage = async () => {
  const canvas = await generateImage();
  if (!canvas) return;
  
  const link = document.createElement('a');
  link.download = 'my-budget.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};

const copyImage = async () => {
  try {
    const canvas = await generateImage();
    if (!canvas) {
      console.error('Failed to generate image');
      return;
    }
    
    canvas.toBlob(async (blob) => {
      try {
        const clipboardData = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([clipboardData]);
        alert('Image copied to clipboard!'); 
      } catch (error) {
        handleError(error, (msg) => errorMessage.value = msg);
        alert('Failed to copy image to clipboard. Your browser may not support this feature.');
      }
    }, 'image/png');
  } catch (error) {
    handleError(error, (msg) => errorMessage.value = msg);
    alert('Failed to copy image to clipboard. Your browser may not support this feature.');
  }
};

// Computed property for revenue chart data
// eslint-disable-next-line no-unused-vars
const revenueChartData = computed(() => {
  const sources = getFilteredSources(budgetStore.revenueSources);
  return sources.map(source => ({
    name: source.name,
    value: parseFloat(source.adjustedAmount.toFixed(1))
  }));
});

// Computed property for spending chart data
// eslint-disable-next-line no-unused-vars
const spendingChartData = computed(() => {
  const categories = getFilteredCategories();
  return categories.map(category => ({
    name: category.name,
    value: parseFloat(category.amount.toFixed(1))
  }));
});

// Get filtered categories function
function getFilteredCategories() {
  if (!budgetStore.spendingCategories) {
    return getFallbackCategories();
  }
  
  try {
    // Filter out group categories and very small allocations
    const filtered = Object.entries(budgetStore.spendingCategories)
      .filter(([, cat]) => !cat.isGroup && cat.amount > 0)
      .map(([id, cat]) => ({
        id,
        name: cat.name || id,
        amount: cat.amount,
        color: cat.color
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // Take top 6 categories for visibility
    
    if (filtered.length === 0) {
      return getFallbackCategories();
    }
    
    return filtered;
  } catch (error) {
    console.error("Error filtering spending categories:", error);
    return getFallbackCategories();
  }
}

// Provide fallback categories when data is missing
function getFallbackCategories() {
  return [
    { id: 'healthcare', name: 'Healthcare', amount: 25, color: '#4299E1' },
    { id: 'education', name: 'Education', amount: 20, color: '#48BB78' },
    { id: 'defense', name: 'Defense', amount: 15, color: '#F56565' },
    { id: 'infrastructure', name: 'Infrastructure', amount: 10, color: '#ED8936' },
    { id: 'socialServices', name: 'Social Services', amount: 18, color: '#9F7AEA' }
  ];
}

// Get filtered sources (only sources with significant amounts)
function getFilteredSources(sources) {
  if (!sources || Object.keys(sources).length === 0) {
    return getFallbackSources();
  }
  
  try {
    // Filter and sort revenue sources by amount
    const filtered = Object.entries(sources)
      .filter(([, source]) => source.adjustedAmount > 0)
      .map(([id, source]) => ({
        id,
        name: source.name || id,
        adjustedAmount: source.adjustedAmount,
        color: source.color
      }))
      .sort((a, b) => b.adjustedAmount - a.adjustedAmount)
      .slice(0, 6); // Take top 6 sources for visibility
    
    if (filtered.length === 0) {
      return getFallbackSources();
    }
    
    return filtered;
  } catch (error) {
    console.error("Error filtering revenue sources:", error);
    return getFallbackSources();
  }
}

// Provide fallback revenue sources when data is missing
function getFallbackSources() {
  return [
    { id: 'fallbackPIT', name: 'Personal Income Tax', adjustedAmount: 210, color: '#4299E1' },
    { id: 'fallbackCIT', name: 'Corporate Income Tax', adjustedAmount: 80, color: '#48BB78' },
    { id: 'fallbackGST', name: 'GST', adjustedAmount: 60, color: '#F56565' },
    { id: 'fallbackCustoms', name: 'Customs & Duties', adjustedAmount: 30, color: '#ED8936' },
    { id: 'fallbackOther', name: 'Other Revenue', adjustedAmount: 40, color: '#9F7AEA' }
  ];
}

const errorMessage = ref('');
</script>

<style scoped>
:root {
  --z-modal-backdrop: 9000;
  --z-modal-content: 9500;
  --z-debug-info: 10000;
}

.social-share-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  --color-twitter: #000000;
  --twitter-hover: #333333;
  --color-facebook: #4267B2;
  --facebook-hover: #365899;
  --color-linkedin: #0077b5;
  --linkedin-hover: #00669c;
  --color-instagram-start: #833ab4;
  --color-instagram-middle: #fd1d1d;
  --color-instagram-end: #fcb045;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary, #2563eb);
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-primary, #2563eb);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Desktop (scale + fade + subtle rise) */
@media (min-width: 768px) {
  .modal-enter-active, .modal-leave-active {
    transition: opacity 240ms ease-out, transform 240ms ease-out;
  }
  .modal-enter-from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  .modal-enter-to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  .modal-leave-to {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
}

/* Mobile (slide-up only) */
@media (max-width: 767px) {
  .modal-enter-active, .modal-leave-active {
    transition: transform 260ms ease-out, opacity 180ms ease-out;
  }
  .modal-enter-from {
    opacity: 0;
    transform: translateY(40px);
  }
  .modal-enter-to {
    opacity: 1;
    transform: translateY(0);
  }
  .modal-leave-to {
    opacity: 0;
    transform: translateY(25px);
  }
}

@keyframes pop {
  0%   { transform: scale(0.8); opacity: 0; }
  50%  { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
}
.animate-pop {
  animation: pop 300ms ease-out;
}

/* Link preview styles */
.link-preview-container {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.link-preview {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: white;
  transition: all 0.2s ease;
}

.link-preview:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.link-preview-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: linear-gradient(to right, #2563eb, #3b82f6);
  color: white;
}

.link-preview-icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.link-preview-title {
  font-size: 18px;
  font-weight: 600;
}

.link-preview-content {
  padding: 16px;
}

.link-preview-metrics {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.metric {
  flex: 1;
  min-width: 100px;
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.metric-value.positive {
  color: #059669;
}

.metric-value.negative {
  color: #dc2626;
}

.link-preview-badges {
  margin-bottom: 16px;
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
}

.badges-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.badges-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge-pill {
  display: flex;
  align-items: center;
  background-color: #e0f2fe;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 14px;
}

.badge-icon {
  margin-right: 6px;
}

.link-preview-url {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f3f4f6;
  border-radius: 6px;
  font-size: 14px;
  color: #4b5563;
}

.link-preview-url svg {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: #6b7280;
}

.link-preview-description {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  max-width: 600px;
  margin: 0 auto;
}

/* Dark mode support */
.dark .social-card-container {
  background-color: #1f2937;
  border: 1px solid #4b5563;
}

/* Modal backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal-backdrop);
}

/* Modal container */
.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: var(--z-modal-content);
  background-color: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: auto;
  display: flex;
  flex-direction: column;
  max-height: 95vh;
  height: auto;
}

.dark .modal-container {
  background-color: #1f2937;
  border-color: #4b5563;
}

/* Social card wrapper */
.social-card-wrapper {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .social-card-wrapper {
  background-color: #374151;
}



.budget-charts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
  background-color: #f8fafc;
  border-radius: 8px;
  margin-bottom: 15px;
}

.revenue-chart,
.spending-chart {
  margin-bottom: 15px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #334155;
}

.chart-bar {
  display: flex;
  height: 24px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}

.chart-segment {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 10px;
  overflow: hidden;
  white-space: nowrap;
  min-width: 3px;
}

.segment-label {
  font-size: 10px;
  font-weight: 500;
  text-shadow: 0 0 2px rgba(0,0,0,0.5);
}

.chart-legend {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 8px;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 8px;
  margin-bottom: 4px;
}

.legend-color {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}

.legend-text {
  font-size: 10px;
  color: #475569;
}

.card-type-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.toggle-btn {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.toggle-btn:first-child {
  border-radius: 4px 0 0 4px;
}

.toggle-btn:last-child {
  border-radius: 0 4px 4px 0;
}

.toggle-btn.active {
  background: #4285f4;
  color: white;
  border-color: #4285f4;
}

.chart-fallback {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  background-color: #f9fafb;
  border-radius: 8px;
  color: #6b7280;
  text-align: center;
  padding: 1rem;
  font-size: 0.875rem;
}
/* Debug styles */
.debug-backdrop {
  border: 5px solid red !important;
}

.debug-card {
  border: 5px solid blue !important;
}

/* Social media icon size fix */
.modal-container svg {
  width: 18px;
  height: 18px;
}

.debug-container {
  border: 5px solid green !important;
}

.debug-info {
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
  max-width: 300px;
  overflow: auto;
}

/* Compact sentiment and badge preview styles */
.compact-preview {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.compact-segments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.compact-segment {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.compact-segment.positive {
  background-color: rgba(16, 185, 129, 0.1);
  color: #047857;
}

.compact-segment.negative {
  background-color: rgba(239, 68, 68, 0.1);
  color: #b91c1c;
}

.compact-segment .material-icons {
  font-size: 1rem;
}

.compact-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.compact-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--color-badge-bg);
  color: var(--color-badge-text);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
}

.badge-icon {
  font-size: 0.875rem;
}

.badge-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 6rem;
}

/* Detailed card styles */
.link-preview-detailed-card {
  margin-top: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-card-bg, #f9fafb);
  border-radius: 0.5rem;
}

.link-preview-detailed-card h3 {
  color: var(--color-heading, #111827);
  margin-bottom: 0.75rem;
}
</style>
