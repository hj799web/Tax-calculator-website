<template>
  <section class="budget-categories-section">
    <h2 class="section-title">
      Budget Categories
    </h2>

    <!-- Allocation Filters -->
    <div class="allocation-filters">
      <label
        v-for="cat in allocationCategories"
        :key="cat.value"
        class="filter-label"
      >
        <input
          v-model="selectedAllocationCategories"
          type="checkbox"
          :value="cat.value"
        >
        {{ cat.label }}
      </label>
    </div>

    <!--
        Remove the 'sort by amount' button block from this section
        per your request. We also removed the "Currently Sorted By" to avoid confusion.
      -->

    <!-- Action Buttons: Expand All / Hide All -->
    <div class="budget-action-buttons">
      <button
        class="toggle-all-button"
        aria-label="Toggle all budget category details"
        @click="toggleAll"
      >
        {{ allExpanded ? 'Hide All' : 'Expand All' }}
      </button>
    </div>

    <!-- Budget Categories (Detailed) -->
    <div class="budget-categories">
      <div
        v-for="category in sortedBudgetData"
        :key="category.uniqueId"
        class="budget-category"
      >
        <h3>
          {{ category.category }} ({{ formatBudget(category.amount) }})
        </h3>
        <button
          class="toggle-description-button"
          :aria-label="'Toggle details for ' + category.category"
          @click="toggleDescription(category.id)"
        >
          {{ category.showDescription ? 'Hide Details' : 'Show Details' }}
        </button>
        <transition name="fade">
          <div
            v-if="visibleDescriptions.includes(category.id)"
            class="category-description"
          >
            <p>{{ category.description }}</p>
            <!-- Subsections (if any) -->
            <div
              v-if="category.subsections"
              class="subsections"
            >
              <div
                v-for="sub in category.subsections"
                :key="sub.id"
                class="subsection"
              >
                <h4>
                  {{ sub.name }} – {{ formatBudget(sub.amount) }}
                </h4>
                <p>{{ sub.description }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { allocationCategories } from '../constants.js'
import { storeToRefs } from 'pinia'
import { useCalculatorStore } from '../stores/calculator.js'
import { useConfigStore } from '../stores/config.js'
import { formatBudget } from '../utils.js'

const {
  sortedBudgetData
} = storeToRefs(useCalculatorStore())

const configStore = useConfigStore()

const {
  selectedAllocationCategories,
  allExpanded,
  visibleDescriptions
} = storeToRefs(configStore)

const {
  toggleAll,
  toggleDescription
} = configStore
</script>