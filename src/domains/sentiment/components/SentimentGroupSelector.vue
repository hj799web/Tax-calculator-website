<template>
  <div class="sentiment-group-selector">
    <label>
      Province(s):
      <select :value="provinces[0] || ''" @change="updateProvinces($event)">
  <option value="">-- None --</option>
        <option v-for="province in provinceOptions" :key="province" :value="province">{{ province }}</option>
      </select>
    </label>
    <label>
      Sector(s):
      <select :value="sectors[0] || ''" @change="updateSectors($event)">
  <option value="">-- None --</option>
        <option v-for="sector in sectorOptions" :key="sector" :value="sector">{{ sector }}</option>
      </select>
    </label>
    <label>
      Demographic(s):
      <select :value="demographics[0] || ''" @change="updateDemographics($event)">
  <option value="">-- None --</option>
        <option v-for="demo in demographicOptions" :key="demo" :value="demo">{{ demo }}</option>
      </select>
    </label>
  </div>
</template>

<script setup>
import { sentimentConfig } from '@/domains/sentiment/config/sentimentConfig.js'

defineProps({
  provinces: {
    type: Array,
    default: () => []
  },
  sectors: {
    type: Array,
    default: () => []
  },
  demographics: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update'])

const provinceOptions = Object.keys(sentimentConfig.provinces)
const sectorOptions = Object.keys(sentimentConfig.sectors)
const demographicOptions = Object.keys(sentimentConfig.demographics)

function updateProvinces(event) {
  const selected = event.target.value ? [event.target.value] : [];
  emit('update', {
    provinces: selected,
    sectors: [], // Deselect sectors
    demographics: [] // Deselect demographics
  });
}

function updateSectors(event) {
  const selected = event.target.value ? [event.target.value] : [];
  emit('update', {
    provinces: [], // Deselect provinces
    sectors: selected,
    demographics: [] // Deselect demographics
  });
}

function updateDemographics(event) {
  const selected = event.target.value ? [event.target.value] : [];
  emit('update', {
    provinces: [], // Deselect provinces
    sectors: [], // Deselect sectors
    demographics: selected
  });
}
</script>

<style scoped>
.sentiment-group-selector {
  display: flex;
  gap: 1em;
  margin-bottom: 0.7em;
  flex-wrap: wrap;
}
label {
  font-weight: 600;
  font-size: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}
select {
  min-width: 120px;
  padding: 0.3em 0.5em;
  border-radius: 6px;
  border: 1px solid #c8c8c8;
}
</style>
