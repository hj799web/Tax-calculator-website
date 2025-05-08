<template>
  <div 
    class="achievement-badge flex flex-col items-center justify-center p-3 rounded-lg relative"
    :data-tier="badge.tier"
    :class="[size === 'large' ? 'w-32 h-32' : 'w-24 h-24', { 'cursor-pointer': showTooltip }]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      class="badge-icon text-4xl mb-1"
      :class="{ 'text-5xl': size === 'large' }"
    >
      {{ badge.icon }}
    </div>
    <div
      class="badge-title text-center font-semibold text-sm"
      :class="{ 'text-base': size === 'large' }"
    >
      {{ badge.title }}
    </div>
    
    <!-- Tooltip with Transition -->
    <transition name="fade">
      <div 
        v-if="showTooltip && isHovered" 
        class="badge-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded py-2 px-3 shadow-lg z-10"
      >
        <!-- Removed duplicate badge title here -->
        <div>{{ badge.explanation }}</div>
        <div class="tooltip-arrow absolute top-full left-1/2 transform -translate-x-1/2 h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  badge: {
    type: Object,
    required: true,
    validator: (badge) => {
      return badge && badge.title && badge.icon && badge.explanation;
    }
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  showTooltip: {
    type: Boolean,
    default: true
  }
});

const isHovered = ref(false);
</script>

<style scoped>
/* Base appearance with 3D effect */
.achievement-badge {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border: 2px solid #e9ecef;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff;
  position: relative;
  overflow: hidden;
}

/* Add colorful glow effect behind badge */
.achievement-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
  z-index: 0;
  opacity: 0.7;
  transition: all 0.3s ease;
}

/* On hover, slightly raise and emphasize the 3D look */
.achievement-badge:hover {
  border-color: #ced4da;
  transform: translateY(-3px);
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.15), -6px -6px 12px #ffffff;
}

/* Make the glow effect more visible on hover */
.achievement-badge:hover::before {
  opacity: 0.9;
  background: radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%);
}

/* Badge icon styling */
.badge-icon {
  line-height: 1;
}

/* Badge tier colors with vibrant gradients */
[data-tier="fiscal"] {
  border-color: #4299e1;
  background: linear-gradient(145deg, #ffffff, #e6f0ff);
  box-shadow: 4px 4px 8px rgba(66, 153, 225, 0.2), -4px -4px 8px #ffffff;
}

[data-tier="fiscal"]::before {
  background: radial-gradient(circle at center, rgba(66, 153, 225, 0.2) 0%, rgba(255,255,255,0) 70%);
}

[data-tier="fiscal"]:hover::before {
  background: radial-gradient(circle at center, rgba(66, 153, 225, 0.4) 0%, rgba(66, 153, 225, 0.1) 70%);
}

[data-tier="economic"] {
  border-color: #48bb78;
  background: linear-gradient(145deg, #ffffff, #e6ffef);
  box-shadow: 4px 4px 8px rgba(72, 187, 120, 0.2), -4px -4px 8px #ffffff;
}

[data-tier="economic"]::before {
  background: radial-gradient(circle at center, rgba(72, 187, 120, 0.2) 0%, rgba(255,255,255,0) 70%);
}

[data-tier="economic"]:hover::before {
  background: radial-gradient(circle at center, rgba(72, 187, 120, 0.4) 0%, rgba(72, 187, 120, 0.1) 70%);
}

[data-tier="social"] {
  border-color: #ed8936;
  background: linear-gradient(145deg, #ffffff, #fff5eb);
  box-shadow: 4px 4px 8px rgba(237, 137, 54, 0.2), -4px -4px 8px #ffffff;
}

[data-tier="social"]::before {
  background: radial-gradient(circle at center, rgba(237, 137, 54, 0.2) 0%, rgba(255,255,255,0) 70%);
}

[data-tier="social"]:hover::before {
  background: radial-gradient(circle at center, rgba(237, 137, 54, 0.4) 0%, rgba(237, 137, 54, 0.1) 70%);
}

[data-tier="environmental"] {
  border-color: #38b2ac;
  background: linear-gradient(145deg, #ffffff, #e6fffd);
  box-shadow: 4px 4px 8px rgba(56, 178, 172, 0.2), -4px -4px 8px #ffffff;
}

[data-tier="environmental"]::before {
  background: radial-gradient(circle at center, rgba(56, 178, 172, 0.2) 0%, rgba(255,255,255,0) 70%);
}

[data-tier="environmental"]:hover::before {
  background: radial-gradient(circle at center, rgba(56, 178, 172, 0.4) 0%, rgba(56, 178, 172, 0.1) 70%);
}

[data-tier="diplomatic"] {
  border-color: #9f7aea;
  background: linear-gradient(145deg, #ffffff, #f5f0ff);
  box-shadow: 4px 4px 8px rgba(159, 122, 234, 0.2), -4px -4px 8px #ffffff;
}

[data-tier="diplomatic"]::before {
  background: radial-gradient(circle at center, rgba(159, 122, 234, 0.2) 0%, rgba(255,255,255,0) 70%);
}

[data-tier="diplomatic"]:hover::before {
  background: radial-gradient(circle at center, rgba(159, 122, 234, 0.4) 0%, rgba(159, 122, 234, 0.1) 70%);
}

[data-tier="balanced"] {
  border-color: #d3adf7;
  background: linear-gradient(145deg, #ffffff, #f9f0ff);
  box-shadow: 4px 4px 8px rgba(211, 173, 247, 0.2), -4px -4px 8px #ffffff;
}

[data-tier="balanced"]::before {
  background: radial-gradient(circle at center, rgba(211, 173, 247, 0.2) 0%, rgba(255,255,255,0) 70%);
}

[data-tier="balanced"]:hover::before {
  background: radial-gradient(circle at center, rgba(211, 173, 247, 0.4) 0%, rgba(211, 173, 247, 0.1) 70%);
}

/* Tooltip transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Optional: Enhance tooltip with slight 3D effect */
.badge-tooltip {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
