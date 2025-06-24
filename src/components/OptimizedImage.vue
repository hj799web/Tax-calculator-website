<template>
  <picture :class="pictureClass">
    <!-- AVIF for ultra-modern browsers (best compression) -->
    <source 
      v-if="avifSrc" 
      :srcset="avifSrc" 
      type="image/avif"
    />
    
    <!-- WebP for modern browsers (great compression) -->
    <source 
      v-if="webpSrc" 
      :srcset="webpSrc" 
      type="image/webp"
    />
    
    <!-- JPEG fallback for older browsers -->
    <img 
      :src="jpegSrc || src"
      :alt="alt"
      :class="imgClass"
      :loading="loading"
      :width="width"
      :height="height"
      @load="onLoad"
      @error="onError"
    />
  </picture>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  optimizedPath: {
    type: String,
    default: 'optimized'
  },
  loading: {
    type: String,
    default: 'lazy',
    validator: (value) => ['lazy', 'eager'].includes(value)
  },
  pictureClass: {
    type: String,
    default: ''
  },
  imgClass: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  }
})

const emit = defineEmits(['load', 'error'])

const isLoaded = ref(false)
const hasError = ref(false)

// Generate optimized image paths
const basePath = computed(() => {
  const pathParts = props.src.split('/')
  const fileName = pathParts.pop()
  const directory = pathParts.join('/')
  const fileNameWithoutExt = fileName.split('.')[0]
  
  return `${directory}/${props.optimizedPath}/${fileNameWithoutExt}`
})

const webpSrc = computed(() => {
  if (!props.src) return null
  return `${basePath.value}.webp`
})

const avifSrc = computed(() => {
  if (!props.src) return null
  // Only use AVIF for very large images to avoid unnecessary requests
  const isLargeImage = props.src.includes('calculator-bg') || props.src.includes('parliament')
  return isLargeImage ? `${basePath.value}.avif` : null
})

const jpegSrc = computed(() => {
  if (!props.src) return null
  const pathParts = props.src.split('/')
  const fileName = pathParts.pop()
  const directory = pathParts.join('/')
  
  return `${directory}/${props.optimizedPath}/${fileName}`
})

const onLoad = (event) => {
  isLoaded.value = true
  emit('load', event)
}

const onError = (event) => {
  hasError.value = true
  emit('error', event)
}
</script>

<style scoped>
picture {
  display: block;
}

img {
  max-width: 100%;
  height: auto;
}

/* Smooth loading transition */
img {
  transition: opacity 0.3s ease;
}

img[loading="lazy"] {
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style> 