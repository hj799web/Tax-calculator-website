<template>
  <div class="revenue-sliders">
    <details class="revenue-explanation mb-4 bg-gray-50 rounded-lg">
      <summary class="p-3 cursor-pointer text-gray-800 font-medium">{{ i18nText('simulator.controls.revenue.summaryTitle', 'About these sliders') }}</summary>
      <div class="p-4 pt-2">
        <p class="text-sm text-gray-700 mb-2">{{ i18nText('simulator.controls.revenue.summaryBody', 'The Budget Simulator uses a simplified approach to tax calculations to help you understand the fiscal impact of tax changes. Instead of detailed tax brackets, it uses average effective rates:') }}</p>
        <ul class="text-sm text-gray-600 list-disc pl-5 mb-2">
          <li>{{ i18nText('simulator.controls.revenue.summaryItems.personal', 'Personal Income Tax: Base rate of 21% (2024) with $10 billion in revenue per percentage point') }}</li>
          <li>{{ i18nText('simulator.controls.revenue.summaryItems.corporate', 'Corporate Income Tax: Base rate of 15% (2024) with $5.33 billion in revenue per percentage point') }}</li>
          <li>{{ i18nText('simulator.controls.revenue.summaryItems.credits', 'Tax credits and expenditures can be adjusted separately to see their impact on revenue') }}</li>
        </ul>
        <p class="text-sm text-gray-700">{{ i18nText('simulator.controls.revenue.summaryFooter', 'This approach focuses on overall revenue impact rather than individual taxpayer scenarios.') }}</p>
      </div>
    </details>
    <div class="revenue-controls">
      <div class="overflow-y-auto pr-2 max-h-[60vh]">
        <!-- {{ i18nText('simulator.controls.revenue.groupTitle.incomeTaxes', 'Income Taxes') }} Group -->
        <div class="mb-4">
          <div
            class="group-header"
            @click="toggleGroupExpansion('incomeTaxes')"
          >
            <h3 class="text-sm font-medium text-gray-700">
              {{ i18nText('simulator.controls.revenue.groupTitle.incomeTaxes', 'Income Taxes') }}
            </h3>
            <div class="group-total">
              ${{ formatCurrency(incomeTaxTotal, 1) }}B
            </div>
            <div class="toggle-button">
              {{ expandedGroups.incomeTaxes ? i18nText('simulator.controls.common.collapse', 'Collapse') : i18nText('simulator.controls.common.expand', 'Expand') }}
              <span
                class="icon ml-1"
                :class="{ 'rotated': expandedGroups.incomeTaxes }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          </div>
          
          <div
            class="group-content"
            :class="{ 'expanded': expandedGroups.incomeTaxes }"
          >
            <div class="revenue-grid">
              <!-- {{ i18nText('simulator.controls.revenue.labels.personal', 'Personal Income Tax') }} -->
              <div
                class="revenue-tile"
                :style="{ '--tile-color': budgetStore.revenueSources.personalIncomeTax?.color || '#4299E1' }"
              >
                <div class="tile-header">
                  <div class="tile-title">
                    <span class="material-icons tile-icon">payments</span>
                    {{ getCategoryName('personalIncomeTax', 'revenue') }}
                    <CategoryInfo
                      :name="getCategoryName('personalIncomeTax', 'revenue')"
                      :description="budgetStore.revenueSources.personalIncomeTax?.description || ''"
                      :base-amount="budgetStore.revenueSources.personalIncomeTax?.base || 0"
                      :current-setting="revenueRates.personalIncomeTax"
                      @show-tooltip="showTooltip"
                      @hide-tooltip="hideTooltip"
                    />
                  </div>
                  <div class="tile-amount">
                    <div class="total-amount">
                      ${{ formatCurrency(budgetStore.revenueSources.personalIncomeTax?.adjustedAmount || budgetStore.revenueSources.personalIncomeTax?.amount, 1) }}B
                      <span
                      v-if="getAdditionalRevenue('personalIncomeTax') !== 0"
                      :class="{
                        'positive': getAdditionalRevenue('personalIncomeTax') > 0,
                        'negative': getAdditionalRevenue('personalIncomeTax') < 0
                      }"
                        style="font-size: 0.9em; margin-left: 4px;"
                      >
                        ({{ getAdditionalRevenue('personalIncomeTax') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('personalIncomeTax'), 1) }}B)
                      </span>
                    </div>
                    <div class="base-amount">
                      {{ i18nText('simulator.controls.common.base', 'Base:') }} ${{ formatCurrency(budgetStore.revenueSources.personalIncomeTax?.base * budgetStore.revenueSources.personalIncomeTax?.rateByYear[budgetStore.currentYear], 1) }}B
                    </div>
                    <div
                      v-if="budgetStore.revenueSources.personalIncomeTax?.expenditureImpact !== 0"
                      class="tax-expenditure-impact"
                    >
                      <span class="impact-label">{{ i18nText('simulator.controls.common.taxImpact', 'Tax Expenditure Impact:') }}</span>
                      <span
                        class="impact-value"
                        :class="{'positive': budgetStore.revenueSources.personalIncomeTax?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.personalIncomeTax?.expenditureImpact < 0}"
                      >
                        {{ budgetStore.revenueSources.personalIncomeTax?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.personalIncomeTax?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">
                  <span>
                    {{ i18nText('simulator.controls.revenue.notes.personalIncomeTax', 'Personal Income Tax represents the federal income tax collected from individuals and households, including employment income, investment income, and other taxable sources. This is the largest source of federal revenue and is represented as "personalIncomeTax" in all calculations.') }}
                  </span>
                </div>
                <div
                  v-if="budgetStore.revenueSources.personalIncomeTax?.expenditureImpact !== 0"
                  class="tax-expenditure-note"
                >
                  {{ i18nText('simulator.controls.revenue.personal.expenditureNote', 'This revenue figure includes the impact of personal tax credit and deferral adjustments.') }}
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('personalIncomeTax', 'min') }}%</span>
                    <span class="current-rate">{{ i18nText('simulator.controls.common.current', 'Current:') }} {{ revenueRates.personalIncomeTax }}%</span>
                    <span>{{ getLabel('personalIncomeTax', 'max') }}%</span>
                  </div>
                  <input 
                    v-model="localSliderValues.personalIncomeTax" 
                    type="range" 
                    :min="getLabel('personalIncomeTax', 'min')" 
                    :max="getLabel('personalIncomeTax', 'max')" 
                    :step="0.1" 
                    class="slider-input"
                    @input="onSliderInput('personalIncomeTax', localSliderValues.personalIncomeTax)" 
                    /> <!-- 🆕 PERFORMANCE NOTE: Debounced slider commit using localSliderValues -->
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        v-model.number="revenueRates.personalIncomeTax" 
                        type="number" 
                        class="percentage-input"
                        :min="getLabel('personalIncomeTax', 'min')"
                        :max="getLabel('personalIncomeTax', 'max')"
                        step="0.1"
                        @change="updateRevenueRate('personalIncomeTax')"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        v-model.number="amountInputs.personalIncomeTax" 
                        type="number" 
                        class="amount-input"
                        step="0.1"
                        @change="updateAmountInput('personalIncomeTax')"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- {{ i18nText('simulator.controls.revenue.labels.corporate', 'Corporate Income Tax') }} -->
              <div
                class="revenue-tile"
                :style="{ '--tile-color': budgetStore.revenueSources.corporateIncomeTax?.color || '#48BB78' }"
              >
                <div class="tile-header">
                  <div class="tile-title">
                    <span class="material-icons tile-icon">payments</span>
                    {{ getCategoryName('corporateIncomeTax', 'revenue') }}
                    <CategoryInfo
                      :name="getCategoryName('corporateIncomeTax', 'revenue')"
                      :description="budgetStore.revenueSources.corporateIncomeTax?.description || ''"
                      :base-amount="budgetStore.revenueSources.corporateIncomeTax?.base || 0"
                      :current-setting="revenueRates.corporateIncomeTax"
                      @show-tooltip="showTooltip"
                      @hide-tooltip="hideTooltip"
                    />
                  </div>
                  <div class="tile-amount">
                    <div class="total-amount">
                      ${{ formatCurrency(budgetStore.revenueSources.corporateIncomeTax?.adjustedAmount || budgetStore.revenueSources.corporateIncomeTax?.amount, 1) }}B
                      <span
                      v-if="getAdditionalRevenue('corporateIncomeTax') !== 0"
                      :class="{
                        'positive': getAdditionalRevenue('corporateIncomeTax') > 0,
                        'negative': getAdditionalRevenue('corporateIncomeTax') < 0
                      }"
                        style="font-size: 0.9em; margin-left: 4px;"
                      >
                        ({{ getAdditionalRevenue('corporateIncomeTax') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('corporateIncomeTax'), 1) }}B)
                      </span>
                    </div>
                    <div class="base-amount">
                      {{ i18nText('simulator.controls.common.base', 'Base:') }} ${{ formatCurrency(budgetStore.revenueSources.corporateIncomeTax?.base * budgetStore.revenueSources.corporateIncomeTax?.rateByYear[budgetStore.currentYear], 1) }}B
                    </div>
                    <div
                      v-if="budgetStore.revenueSources.corporateIncomeTax?.expenditureImpact !== 0"
                      class="tax-expenditure-impact"
                    >
                      <span class="impact-label">{{ i18nText('simulator.controls.common.taxImpact', 'Tax Expenditure Impact:') }}</span>
                      <span
                        class="impact-value"
                        :class="{'positive': budgetStore.revenueSources.corporateIncomeTax?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.corporateIncomeTax?.expenditureImpact < 0}"
                      >
                        {{ budgetStore.revenueSources.corporateIncomeTax?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.corporateIncomeTax?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">
                  <span>
                    {{ i18nText('simulator.controls.revenue.notes.corporateIncomeTax', 'Corporate Income Tax is a federal tax levied on the taxable income of corporations operating in Canada. It includes both the general corporate tax rate (15%) and the small business rate (9%), with various deductions and credits available.') }}
                  </span>
                </div>
                <div
                  v-if="budgetStore.revenueSources.corporateIncomeTax?.expenditureImpact !== 0"
                  class="tax-expenditure-note"
                >
                  {{ i18nText('simulator.controls.revenue.corporate.expenditureNote', 'This revenue figure includes the impact of corporate tax expenditure adjustments.') }}
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('corporateIncomeTax', 'min') }}%</span>
                    <span class="current-rate">{{ i18nText('simulator.controls.common.current', 'Current:') }} {{ revenueRates.corporateIncomeTax }}%</span>
                    <span>{{ getLabel('corporateIncomeTax', 'max') }}%</span>
                  </div>
                  <input 
                    v-model="localSliderValues.corporateIncomeTax" 
                    type="range" 
                    :min="getLabel('corporateIncomeTax', 'min')" 
                    :max="getLabel('corporateIncomeTax', 'max')" 
                    :step="0.1" 
                    class="slider-input"
                    @input="onSliderInput('corporateIncomeTax', localSliderValues.corporateIncomeTax)" 
                    /> <!-- 🆕 PERFORMANCE NOTE: Debounced slider commit using localSliderValues -->
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        v-model.number="revenueRates.corporateIncomeTax" 
                        type="number" 
                        class="percentage-input"
                        :min="getLabel('corporateIncomeTax', 'min')"
                        :max="getLabel('corporateIncomeTax', 'max')"
                        step="0.1"
                        @change="updateRevenueRate('corporateIncomeTax')"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        v-model.number="amountInputs.corporateIncomeTax" 
                        type="number" 
                        class="amount-input"
                        step="0.1"
                        @change="updateAmountInput('corporateIncomeTax')"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- {{ i18nText('simulator.controls.revenue.groupTitle.consumptionTaxes', 'Consumption Taxes') }} Group -->
        <div class="mb-4">
          <div
            class="group-header"
            @click="toggleGroupExpansion('consumptionTaxes')"
          >
            <h3 class="text-sm font-medium text-gray-700">
              {{ i18nText('simulator.controls.revenue.groupTitle.consumptionTaxes', 'Consumption Taxes') }}
            </h3>
            <div class="group-total">
              ${{ formatCurrency(consumptionTaxTotal, 1) }}B
            </div>
            <div class="toggle-button">
              {{ expandedGroups.consumptionTaxes ? i18nText('simulator.controls.common.collapse', 'Collapse') : i18nText('simulator.controls.common.expand', 'Expand') }}
              <span
                class="icon ml-1"
                :class="{ 'rotated': expandedGroups.consumptionTaxes }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          </div>
          
          <div
            class="group-content"
            :class="{ 'expanded': expandedGroups.consumptionTaxes }"
          >
            <div class="revenue-grid">
              <!-- GST/HST -->
              <div
                class="revenue-tile"
                :style="{ '--tile-color': budgetStore.revenueSources.gst?.color || '#ED8936' }"
              >
                <div class="tile-header">
                  <div class="tile-title">
                    <span class="material-icons tile-icon">payments</span>
                    {{ getCategoryName('gst', 'revenue') }}
                    <CategoryInfo
                      :name="getCategoryName('gst', 'revenue')"
                      :description="budgetStore.revenueSources.gst?.description || ''"
                      :base-amount="budgetStore.revenueSources.gst?.base || 0"
                      :current-setting="revenueRates.gst"
                      @show-tooltip="showTooltip"
                      @hide-tooltip="hideTooltip"
                    />
                  </div>
                  <div class="tile-amount">
                    <div class="total-amount">
                      ${{ formatCurrency(budgetStore.revenueSources.gst?.adjustedAmount || budgetStore.revenueSources.gst?.amount, 1) }}B
                      <span
                      v-if="getAdditionalRevenue('gst') !== 0"
                      :class="{
                        'positive': getAdditionalRevenue('gst') > 0,
                        'negative': getAdditionalRevenue('gst') < 0
                      }"
                        style="font-size: 0.9em; margin-left: 4px;"
                      >
                        ({{ getAdditionalRevenue('gst') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('gst'), 1) }}B)
                      </span>
                    </div>
                    <div class="base-amount">
                      {{ i18nText('simulator.controls.common.base', 'Base:') }} ${{ formatCurrency(budgetStore.revenueSources.gst?.base * budgetStore.revenueSources.gst?.rateByYear[budgetStore.currentYear], 1) }}B
                    </div>
                    <div
                      v-if="budgetStore.revenueSources.gst?.expenditureImpact !== 0"
                      class="tax-expenditure-impact"
                    >
                      <span class="impact-label">{{ i18nText('simulator.controls.common.taxImpact', 'Tax Expenditure Impact:') }}</span>
                      <span
                        class="impact-value"
                        :class="{'positive': budgetStore.revenueSources.gst?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.gst?.expenditureImpact < 0}"
                      >
                        {{ budgetStore.revenueSources.gst?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.gst?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">
                  <span>
                    The Goods and Services Tax (GST) and Harmonized Sales Tax (HST) is a 5% federal value-added tax applied to most goods and services in Canada. The HST combines the GST with provincial sales tax in participating provinces. This tax is a significant source of federal revenue.
                  </span>
                </div>
                <div
                  v-if="budgetStore.revenueSources.gst?.expenditureImpact !== 0"
                  class="tax-expenditure-note"
                >
                  This revenue figure includes the impact of GST/HST expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('gst', 'min') }}%</span>
                    <span class="current-rate">{{ i18nText('simulator.controls.common.current', 'Current:') }} {{ revenueRates.gst }}%</span>
                    <span>{{ getLabel('gst', 'max') }}%</span>
                  </div>
                  <input 
                    v-model="localSliderValues.gst" 
                    type="range" 
                    :min="getLabel('gst', 'min')" 
                    :max="getLabel('gst', 'max')" 
                    :step="0.1" 
                    class="slider-input"
                    @input="onSliderInput('gst', localSliderValues.gst)" 
                    /> <!-- 🆕 PERFORMANCE NOTE: Debounced slider commit using localSliderValues -->
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        v-model.number="revenueRates.gst" 
                        type="number" 
                        class="percentage-input"
                        :min="getLabel('gst', 'min')"
                        :max="getLabel('gst', 'max')"
                        step="0.1"
                        @change="updateRevenueRate('gst')"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        v-model.number="amountInputs.gst" 
                        type="number" 
                        class="amount-input"
                        step="0.1"
                        @change="updateAmountInput('gst')"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Customs Duties -->
              <div
                class="revenue-tile"
                :style="{ '--tile-color': budgetStore.revenueSources.customsDuties?.color || '#F56565' }"
              >
                <div class="tile-header">
                  <div class="tile-title">
                    <span class="material-icons tile-icon">payments</span>
                    {{ getCategoryName('customsAndImportDuties', 'revenue') }}
                    <CategoryInfo
                      :name="getCategoryName('customsAndImportDuties', 'revenue')"
                      :description="budgetStore.revenueSources.customsDuties?.description || ''"
                      :base-amount="budgetStore.revenueSources.customsDuties?.base || 0"
                      :current-setting="revenueRates.customsDuties"
                      @show-tooltip="showTooltip"
                      @hide-tooltip="hideTooltip"
                    />
                  </div>
                  <div class="tile-amount">
                    <div class="total-amount">
                      ${{ formatCurrency(budgetStore.revenueSources.customsDuties?.adjustedAmount || budgetStore.revenueSources.customsDuties?.amount, 1) }}B
                      <span
                      v-if="getAdditionalRevenue('customsDuties') !== 0"
                      :class="{
                        'positive': getAdditionalRevenue('customsDuties') > 0,
                        'negative': getAdditionalRevenue('customsDuties') < 0
                      }"
                        style="font-size: 0.9em; margin-left: 4px;"
                      >
                        ({{ getAdditionalRevenue('customsDuties') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('customsDuties'), 1) }}B)
                      </span>
                    </div>
                    <div class="base-amount">
                      {{ i18nText('simulator.controls.common.base', 'Base:') }} ${{ formatCurrency(budgetStore.revenueSources.customsDuties?.base * budgetStore.revenueSources.customsDuties?.rateByYear[budgetStore.currentYear], 1) }}B
                    </div>
                    <div
                      v-if="budgetStore.revenueSources.customsDuties?.expenditureImpact !== 0"
                      class="tax-expenditure-impact"
                    >
                      <span class="impact-label">{{ i18nText('simulator.controls.common.taxImpact', 'Tax Expenditure Impact:') }}</span>
                      <span
                        class="impact-value"
                        :class="{'positive': budgetStore.revenueSources.customsDuties?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.customsDuties?.expenditureImpact < 0}"
                      >
                        {{ budgetStore.revenueSources.customsDuties?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.customsDuties?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">
                  <span>
                    Customs Duties are federal taxes and charges imposed on goods imported into Canada. These include tariffs based on international trade agreements, anti-dumping duties, and countervailing duties. The rates vary by product category and country of origin.
                  </span>
                </div>
                <div
                  v-if="budgetStore.revenueSources.customsDuties?.expenditureImpact !== 0"
                  class="tax-expenditure-note"
                >
                  This revenue figure includes the impact of customs duties expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('customsDuties', 'min') }}%</span>
                    <span class="current-rate">{{ i18nText('simulator.controls.common.current', 'Current:') }} {{ revenueRates.customsDuties }}%</span>
                    <span>{{ getLabel('customsDuties', 'max') }}%</span>
                  </div>
                  <input 
                    v-model="localSliderValues.customsDuties" 
                    type="range" 
                    :min="getLabel('customsDuties', 'min')" 
                    :max="getLabel('customsDuties', 'max')" 
                    :step="0.1" 
                    class="slider-input"
                    @input="onSliderInput('customsDuties', localSliderValues.customsDuties)" 
                    /> <!-- 🆕 PERFORMANCE NOTE: Debounced slider commit using localSliderValues -->
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        v-model.number="revenueRates.customsDuties" 
                        type="number" 
                        class="percentage-input"
                        :min="getLabel('customsDuties', 'min')"
                        :max="getLabel('customsDuties', 'max')"
                        step="0.1"
                        @change="updateRevenueRate('customsDuties')"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        v-model.number="amountInputs.customsDuties" 
                        type="number" 
                        class="amount-input"
                        step="0.1"
                        @change="updateAmountInput('customsDuties')"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="revenue-grid mt-3">
              <!-- Carbon Pricing -->
              <div
                class="revenue-tile"
                :style="{ '--tile-color': budgetStore.revenueSources.carbonPricing?.color || '#38B2AC' }"
              >
                <div class="tile-header">
                  <div class="tile-title">
                    <span class="material-icons tile-icon">payments</span>
                    {{ getCategoryName('carbonPricing', 'revenue') }}
                    <CategoryInfo
                      :name="getCategoryName('carbonPricing', 'revenue')"
                      :description="budgetStore.revenueSources.carbonPricing?.description || ''"
                      :base-amount="budgetStore.revenueSources.carbonPricing?.base || 0"
                      :current-setting="revenueRates.carbonPricing"
                      @show-tooltip="showTooltip"
                      @hide-tooltip="hideTooltip"
                    />
                  </div>
                  <div class="tile-amount">
                    <div class="total-amount">
                      ${{ formatCurrency(budgetStore.revenueSources.carbonPricing?.adjustedAmount || budgetStore.revenueSources.carbonPricing?.amount, 1) }}B
                      <span
                      v-if="getAdditionalRevenue('carbonPricing') !== 0"
                      :class="{
                        'positive': getAdditionalRevenue('carbonPricing') > 0,
                        'negative': getAdditionalRevenue('carbonPricing') < 0
                      }"
                        style="font-size: 0.9em; margin-left: 4px;"
                      >
                        ({{ getAdditionalRevenue('carbonPricing') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('carbonPricing'), 1) }}B)
                      </span>
                    </div>
                    <div class="base-amount">
                      {{ i18nText('simulator.controls.common.base', 'Base:') }} ${{ formatCurrency(budgetStore.revenueSources.carbonPricing?.base * budgetStore.revenueSources.carbonPricing?.rateByYear[budgetStore.currentYear], 1) }}B
                    </div>
                    <div
                      v-if="budgetStore.revenueSources.carbonPricing?.expenditureImpact !== 0"
                      class="tax-expenditure-impact"
                    >
                      <span class="impact-label">{{ i18nText('simulator.controls.common.taxImpact', 'Tax Expenditure Impact:') }}</span>
                      <span
                        class="impact-value"
                        :class="{'positive': budgetStore.revenueSources.carbonPricing?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.carbonPricing?.expenditureImpact < 0}"
                      >
                        {{ budgetStore.revenueSources.carbonPricing?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.carbonPricing?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">
                  <span>
                    Carbon Pricing includes revenue from both carbon taxes and cap-and-trade systems, designed to reduce greenhouse gas emissions.
                  </span>
                </div>
                <div
                  v-if="budgetStore.revenueSources.carbonPricing?.expenditureImpact !== 0"
                  class="tax-expenditure-note"
                >
                  This revenue figure includes the impact of carbon pricing expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('carbonPricing', 'min') }}%</span>
                    <span class="current-rate">{{ i18nText('simulator.controls.common.current', 'Current:') }} {{ revenueRates.carbonPricing }}%</span>
                    <span>{{ getLabel('carbonPricing', 'max') }}%</span>
                  </div>
                  <input 
                    v-model="localSliderValues.carbonPricing" 
                    type="range" 
                    :min="getLabel('carbonPricing', 'min')" 
                    :max="getLabel('carbonPricing', 'max')" 
                    :step="0.1" 
                    class="slider-input"
                    @input="onSliderInput('carbonPricing', localSliderValues.carbonPricing)" 
                    /> <!-- 🆕 PERFORMANCE NOTE: Debounced slider commit using localSliderValues -->
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        v-model.number="revenueRates.carbonPricing" 
                        type="number" 
                        class="percentage-input"
                        :min="getLabel('carbonPricing', 'min')"
                        :max="getLabel('carbonPricing', 'max')"
                        step="0.1"
                        @change="updateRevenueRate('carbonPricing')"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        v-model.number="amountInputs.carbonPricing" 
                        type="number" 
                        class="amount-input"
                        step="0.1"
                        @change="updateAmountInput('carbonPricing')"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Excise Taxes -->
              <div
                class="revenue-tile"
                :style="{ '--tile-color': budgetStore.revenueSources.exciseTaxes?.color || '#9F7AEA' }"
              >
                <div class="tile-header">
                  <div class="tile-title">
                    <span class="material-icons tile-icon">payments</span>
                    {{ getCategoryName('exciseTaxes', 'revenue') }}
                    <CategoryInfo
                      :name="getCategoryName('exciseTaxes', 'revenue')"
                      :description="budgetStore.revenueSources.exciseTaxes?.description || ''"
                      :base-amount="budgetStore.revenueSources.exciseTaxes?.base || 0"
                      :current-setting="revenueRates.exciseTaxes"
                      @show-tooltip="showTooltip"
                      @hide-tooltip="hideTooltip"
                    />
                  </div>
                  <div class="tile-amount">
                    <div class="total-amount">
                      ${{ formatCurrency(budgetStore.revenueSources.exciseTaxes?.adjustedAmount || budgetStore.revenueSources.exciseTaxes?.amount, 1) }}B
                      <span
                      v-if="getAdditionalRevenue('exciseTaxes') !== 0"
                      :class="{
                        'positive': getAdditionalRevenue('exciseTaxes') > 0,
                        'negative': getAdditionalRevenue('exciseTaxes') < 0
                      }"
                        style="font-size: 0.9em; margin-left: 4px;"
                      >
                        ({{ getAdditionalRevenue('exciseTaxes') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('exciseTaxes'), 1) }}B)
                      </span>
                    </div>
                    <div class="base-amount">
                      {{ i18nText('simulator.controls.common.base', 'Base:') }} ${{ formatCurrency(budgetStore.revenueSources.exciseTaxes?.base * budgetStore.revenueSources.exciseTaxes?.rateByYear[budgetStore.currentYear], 1) }}B
                    </div>
                    <div
                      v-if="budgetStore.revenueSources.exciseTaxes?.expenditureImpact !== 0"
                      class="tax-expenditure-impact"
                    >
                      <span class="impact-label">{{ i18nText('simulator.controls.common.taxImpact', 'Tax Expenditure Impact:') }}</span>
                      <span
                        class="impact-value"
                        :class="{'positive': budgetStore.revenueSources.exciseTaxes?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.exciseTaxes?.expenditureImpact < 0}"
                      >
                        {{ budgetStore.revenueSources.exciseTaxes?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.exciseTaxes?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">
                  <span>
                    Excise Taxes include federal taxes on specific goods such as alcohol, tobacco, and fuel, designed to discourage consumption of these products.
                  </span>
                </div>
                <div
                  v-if="budgetStore.revenueSources.exciseTaxes?.expenditureImpact !== 0"
                  class="tax-expenditure-note"
                >
                  This revenue figure includes the impact of excise taxes expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('exciseTaxes', 'min') }}%</span>
                    <span class="current-rate">{{ i18nText('simulator.controls.common.current', 'Current:') }} {{ revenueRates.exciseTaxes }}%</span>
                    <span>{{ getLabel('exciseTaxes', 'max') }}%</span>
                  </div>
                  <input 
                    v-model="localSliderValues.exciseTaxes" 
                    type="range" 
                    :min="getLabel('exciseTaxes', 'min')" 
                    :max="getLabel('exciseTaxes', 'max')" 
                    :step="0.1" 
                    class="slider-input"
                    @input="onSliderInput('exciseTaxes', localSliderValues.exciseTaxes)" 
                    /> <!-- 🆕 PERFORMANCE NOTE: Debounced slider commit using localSliderValues -->
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        v-model.number="revenueRates.exciseTaxes" 
                        type="number" 
                        class="percentage-input"
                        :min="getLabel('exciseTaxes', 'min')"
                        :max="getLabel('exciseTaxes', 'max')"
                        step="0.1"
                        @change="updateRevenueRate('exciseTaxes')"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        v-model.number="amountInputs.exciseTaxes" 
                        type="number" 
                        class="amount-input"
                        step="0.1"
                        @change="updateAmountInput('exciseTaxes')"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- {{ i18nText('simulator.controls.revenue.groupTitle.otherRevenues', 'Other Revenue Sources') }} Group -->
        <div class="mb-4">
          <div
            class="group-header"
            @click="toggleGroupExpansion('otherRevenues')"
          >
            <h3 class="text-sm font-medium text-gray-700">
              {{ i18nText('simulator.controls.revenue.groupTitle.otherRevenues', 'Other Revenue Sources') }}
            </h3>
            <div class="group-total">
              ${{ formatCurrency(otherRevenueTotal, 1) }}B
            </div>
            <div class="toggle-button">
              {{ expandedGroups.otherRevenues ? i18nText('simulator.controls.common.collapse', 'Collapse') : i18nText('simulator.controls.common.expand', 'Expand') }}
              <span
                class="icon ml-1"
                :class="{ 'rotated': expandedGroups.otherRevenues }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          </div>
          
          <div
            class="group-content"
            :class="{ 'expanded': expandedGroups.otherRevenues }"
          >
            <div class="revenue-grid">
              <!-- Employment Insurance Premiums -->
              <div
                class="revenue-tile"
                :style="{ '--tile-color': budgetStore.revenueSources.eiPremiums?.color || '#667EEA' }"
              >
                <div class="tile-header">
                  <div class="tile-title">
                    <span class="material-icons tile-icon">payments</span>
                    {{ getCategoryName('employmentInsurancePremiums', 'revenue') }}
                    <CategoryInfo
                      :name="getCategoryName('employmentInsurancePremiums', 'revenue')"
                      :description="budgetStore.revenueSources.eiPremiums?.description || ''"
                      :base-amount="budgetStore.revenueSources.eiPremiums?.base || 0"
                      :current-setting="revenueRates.eiPremiums"
                      @show-tooltip="showTooltip"
                      @hide-tooltip="hideTooltip"
                    />
                  </div>
                  <div class="tile-amount">
                    <div class="total-amount">
                      ${{ formatCurrency(budgetStore.revenueSources.eiPremiums?.adjustedAmount || budgetStore.revenueSources.eiPremiums?.amount, 1) }}B
                      <span
                      v-if="getAdditionalRevenue('eiPremiums') !== 0"
                      :class="{
                        'positive': getAdditionalRevenue('eiPremiums') > 0,
                        'negative': getAdditionalRevenue('eiPremiums') < 0
                      }"
                        style="font-size: 0.9em; margin-left: 4px;"
                      >
                        ({{ getAdditionalRevenue('eiPremiums') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('eiPremiums'), 1) }}B)
                      </span>
                    </div>
                    <div class="base-amount">
                      {{ i18nText('simulator.controls.common.base', 'Base:') }} ${{ formatCurrency(budgetStore.revenueSources.eiPremiums?.base * budgetStore.revenueSources.eiPremiums?.rateByYear[budgetStore.currentYear], 1) }}B
                    </div>
                    <div
                      v-if="budgetStore.revenueSources.eiPremiums?.expenditureImpact !== 0"
                      class="tax-expenditure-impact"
                    >
                      <span class="impact-label">{{ i18nText('simulator.controls.common.taxImpact', 'Tax Expenditure Impact:') }}</span>
                      <span
                        class="impact-value"
                        :class="{'positive': budgetStore.revenueSources.eiPremiums?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.eiPremiums?.expenditureImpact < 0}"
                      >
                        {{ budgetStore.revenueSources.eiPremiums?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.eiPremiums?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">
                  <span>
                    Employment Insurance (EI) Premiums are mandatory payroll contributions collected from employees and employers to fund the EI program, which provides temporary financial assistance to unemployed workers.
                  </span>
                </div>
                <div
                  v-if="budgetStore.revenueSources.eiPremiums?.expenditureImpact !== 0"
                  class="tax-expenditure-note"
                >
                  This revenue figure includes the impact of employment insurance premiums expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('eiPremiums', 'min') }}%</span>
                    <span class="current-rate">{{ i18nText('simulator.controls.common.current', 'Current:') }} {{ revenueRates.eiPremiums }}%</span>
                    <span>{{ getLabel('eiPremiums', 'max') }}%</span>
                  </div>
                  <input 
                    v-model="localSliderValues.eiPremiums" 
                    type="range" 
                    :min="getLabel('eiPremiums', 'min')" 
                    :max="getLabel('eiPremiums', 'max')" 
                    :step="0.1" 
                    class="slider-input"
                    @input="onSliderInput('eiPremiums', localSliderValues.eiPremiums)" 
                    /> <!-- 🆕 PERFORMANCE NOTE: Debounced slider commit using localSliderValues -->
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        v-model.number="revenueRates.eiPremiums" 
                        type="number" 
                        class="percentage-input"
                        :min="getLabel('eiPremiums', 'min')"
                        :max="getLabel('eiPremiums', 'max')"
                        step="0.1"
                        @change="updateRevenueRate('eiPremiums')"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        v-model.number="amountInputs.eiPremiums" 
                        type="number" 
                        class="amount-input"
                        step="0.1"
                        @change="updateAmountInput('eiPremiums')"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Crown Corporation Profits -->
              <div
                class="revenue-tile"
                :style="{ '--tile-color': budgetStore.revenueSources.crownProfits?.color || '#F687B3' }"
              >
                <div class="tile-header">
                  <div class="tile-title">
                    <span class="material-icons tile-icon">payments</span>
                    {{ getCategoryName('crownCorporationProfits', 'revenue') }}
                    <CategoryInfo
                      :name="getCategoryName('crownCorporationProfits', 'revenue')"
                      :description="budgetStore.revenueSources.crownProfits?.description || ''"
                      :base-amount="budgetStore.revenueSources.crownProfits?.base || 0"
                      :current-setting="revenueRates.crownProfits"
                      @show-tooltip="showTooltip"
                      @hide-tooltip="hideTooltip"
                    />
                  </div>
                  <div class="tile-amount">
                    <div class="total-amount">
                      ${{ formatCurrency(budgetStore.revenueSources.crownProfits?.adjustedAmount || budgetStore.revenueSources.crownProfits?.amount, 1) }}B
                      <span
                        v-if="getAdditionalRevenue('crownProfits') !== 0"
                        :class="{
                          'positive': getAdditionalRevenue('crownProfits') > 0,
                          'negative': getAdditionalRevenue('crownProfits') < 0
                        }"
                        style="font-size: 0.9em; margin-left: 4px;"
                      >
                        ({{ getAdditionalRevenue('crownProfits') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('crownProfits'), 1) }}B)
                      </span>
                    </div>
                    <div class="base-amount">
                      {{ i18nText('simulator.controls.common.base', 'Base:') }} ${{ formatCurrency(budgetStore.revenueSources.crownProfits?.base * budgetStore.revenueSources.crownProfits?.rateByYear[budgetStore.currentYear], 1) }}B
                    </div>
                    <div
                      v-if="getAdditionalRevenue('crownProfits') !== 0"
                      class="additional-revenue"
                      :class="{
                        'positive': getAdditionalRevenue('crownProfits') > 0,
                        'negative': getAdditionalRevenue('crownProfits') < 0
                      }"
                    >
                      {{ getAdditionalRevenue('crownProfits') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('crownProfits'), 1) }}B
                    </div>
                    <div
                      v-if="budgetStore.revenueSources.crownProfits?.expenditureImpact !== 0"
                      class="tax-expenditure-impact"
                    >
                      <span class="impact-label">{{ i18nText('simulator.controls.common.taxImpact', 'Tax Expenditure Impact:') }}</span>
                      <span
                        class="impact-value"
                        :class="{'positive': budgetStore.revenueSources.crownProfits?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.crownProfits?.expenditureImpact < 0}"
                      >
                        {{ budgetStore.revenueSources.crownProfits?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.crownProfits?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">
                  <span>
                    Crown Corporation Profits are net profits from government-owned businesses, including enterprises like Canada Post, VIA Rail, and other federal Crown corporations.
                  </span>
                </div>
                <div
                  v-if="budgetStore.revenueSources.crownProfits?.expenditureImpact !== 0"
                  class="tax-expenditure-note"
                >
                  This revenue figure includes the impact of crown corporation profits expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('crownProfits', 'min') }}%</span>
                    <span class="current-rate">{{ i18nText('simulator.controls.common.current', 'Current:') }} {{ revenueRates.crownProfits }}%</span>
                    <span>{{ getLabel('crownProfits', 'max') }}%</span>
                  </div>
                  <input 
                    v-model="localSliderValues.crownProfits" 
                    type="range" 
                    :min="getLabel('crownProfits', 'min')" 
                    :max="getLabel('crownProfits', 'max')" 
                    :step="0.1" 
                    class="slider-input"
                    @input="onSliderInput('crownProfits', localSliderValues.crownProfits)" 
                    /> <!-- 🆕 PERFORMANCE NOTE: Debounced slider commit using localSliderValues -->
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        v-model.number="revenueRates.crownProfits" 
                        type="number" 
                        class="percentage-input"
                        :min="getLabel('crownProfits', 'min')"
                        :max="getLabel('crownProfits', 'max')"
                        step="0.1"
                        @change="updateRevenueRate('crownProfits')"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        v-model.number="amountInputs.crownProfits" 
                        type="number" 
                        class="amount-input"
                        step="0.1"
                        @change="updateAmountInput('crownProfits')"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="revenue-grid mt-3">
              <!-- Resource Royalties -->
              <div
                class="revenue-tile"
                :style="{ '--tile-color': budgetStore.revenueSources.resourceRoyalties?.color || '#B794F4' }"
              >
                <div class="tile-header">
                  <div class="tile-title">
                    <span class="material-icons tile-icon">payments</span>
                    {{ getCategoryName('resourceRoyalties', 'revenue') }}
                    <CategoryInfo
                      :name="getCategoryName('resourceRoyalties', 'revenue')"
                      :description="budgetStore.revenueSources.resourceRoyalties?.description || ''"
                      :base-amount="budgetStore.revenueSources.resourceRoyalties?.base || 0"
                      :current-setting="revenueRates.resourceRoyalties"
                      @show-tooltip="showTooltip"
                      @hide-tooltip="hideTooltip"
                    />
                  </div>
                  <div class="tile-amount">
                    <div class="total-amount">
                      ${{ formatCurrency(budgetStore.revenueSources.resourceRoyalties?.adjustedAmount || budgetStore.revenueSources.resourceRoyalties?.amount, 1) }}B
                      <span
                      v-if="getAdditionalRevenue('resourceRoyalties') !== 0"
                      :class="{
                        'positive': getAdditionalRevenue('resourceRoyalties') > 0,
                        'negative': getAdditionalRevenue('resourceRoyalties') < 0
                      }"
                        style="font-size: 0.9em; margin-left: 4px;"
                      >
                        ({{ getAdditionalRevenue('resourceRoyalties') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('resourceRoyalties'), 1) }}B)
                      </span>
                    </div>
                    <div class="base-amount">
                      {{ i18nText('simulator.controls.common.base', 'Base:') }} ${{ formatCurrency(budgetStore.revenueSources.resourceRoyalties?.base * budgetStore.revenueSources.resourceRoyalties?.rateByYear[budgetStore.currentYear], 1) }}B
                    </div>
                    <div
                      v-if="budgetStore.revenueSources.resourceRoyalties?.expenditureImpact !== 0"
                      class="tax-expenditure-impact"
                    >
                      <span class="impact-label">{{ i18nText('simulator.controls.common.taxImpact', 'Tax Expenditure Impact:') }}</span>
                      <span
                        class="impact-value"
                        :class="{'positive': budgetStore.revenueSources.resourceRoyalties?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.resourceRoyalties?.expenditureImpact < 0}"
                      >
                        {{ budgetStore.revenueSources.resourceRoyalties?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.resourceRoyalties?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">
                  <span>
                    Resource Royalties are payments received by the federal government for the extraction of natural resources such as oil, gas, and minerals from federal lands and offshore areas.
                  </span>
                </div>
                <div
                  v-if="budgetStore.revenueSources.resourceRoyalties?.expenditureImpact !== 0"
                  class="tax-expenditure-note"
                >
                  This revenue figure includes the impact of resource royalties expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('resourceRoyalties', 'min') }}%</span>
                    <span class="current-rate">{{ i18nText('simulator.controls.common.current', 'Current:') }} {{ revenueRates.resourceRoyalties }}%</span>
                    <span>{{ getLabel('resourceRoyalties', 'max') }}%</span>
                  </div>
                  <input 
                    v-model="localSliderValues.resourceRoyalties" 
                    type="range" 
                    :min="getLabel('resourceRoyalties', 'min')" 
                    :max="getLabel('resourceRoyalties', 'max')" 
                    :step="0.1" 
                    class="slider-input"
                    @input="onSliderInput('resourceRoyalties', localSliderValues.resourceRoyalties)" 
                    /> <!-- 🆕 PERFORMANCE NOTE: Debounced slider commit using localSliderValues -->
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        v-model.number="revenueRates.resourceRoyalties" 
                        type="number" 
                        class="percentage-input"
                        :min="getLabel('resourceRoyalties', 'min')"
                        :max="getLabel('resourceRoyalties', 'max')"
                        step="0.1"
                        @change="updateRevenueRate('resourceRoyalties')"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        v-model.number="amountInputs.resourceRoyalties" 
                        type="number" 
                        class="amount-input"
                        step="0.1"
                        @change="updateAmountInput('resourceRoyalties')"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Non-Tax Revenue -->
              <div
                class="revenue-tile"
                :style="{ '--tile-color': budgetStore.revenueSources.nonTaxRevenue?.color || '#FC8181' }"
              >
                <div class="tile-header">
                  <div class="tile-title">
                    <span class="material-icons tile-icon">payments</span>
                    Non-Tax Revenue
                    <CategoryInfo
                      :name="budgetStore.revenueSources.nonTaxRevenue?.name || 'Non-Tax Revenue'"
                      :description="budgetStore.revenueSources.nonTaxRevenue?.description || ''"
                      :base-amount="budgetStore.revenueSources.nonTaxRevenue?.base || 0"
                      :current-setting="revenueRates.nonTaxRevenue"
                      @show-tooltip="showTooltip"
                      @hide-tooltip="hideTooltip"
                    />
                  </div>
                  <div class="tile-amount">
                    <div class="total-amount">
                      ${{ formatCurrency(budgetStore.revenueSources.nonTaxRevenue?.adjustedAmount || budgetStore.revenueSources.nonTaxRevenue?.amount, 1) }}B
                      <span
                      v-if="getAdditionalRevenue('nonTaxRevenue') !== 0"
                      :class="{
                        'positive': getAdditionalRevenue('nonTaxRevenue') > 0,
                        'negative': getAdditionalRevenue('nonTaxRevenue') < 0
                      }"
                        style="font-size: 0.9em; margin-left: 4px;"
                      >
                        ({{ getAdditionalRevenue('nonTaxRevenue') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('nonTaxRevenue'), 1) }}B)
                      </span>
                    </div>
                    <div class="base-amount">
                      {{ i18nText('simulator.controls.common.base', 'Base:') }} ${{ formatCurrency(budgetStore.revenueSources.nonTaxRevenue?.base * budgetStore.revenueSources.nonTaxRevenue?.rateByYear[budgetStore.currentYear], 1) }}B
                    </div>
                    <div
                      v-if="budgetStore.revenueSources.nonTaxRevenue?.expenditureImpact !== 0"
                      class="tax-expenditure-impact"
                    >
                      <span class="impact-label">{{ i18nText('simulator.controls.common.taxImpact', 'Tax Expenditure Impact:') }}</span>
                      <span
                        class="impact-value"
                        :class="{'positive': budgetStore.revenueSources.nonTaxRevenue?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.nonTaxRevenue?.expenditureImpact < 0}"
                      >
                        {{ budgetStore.revenueSources.nonTaxRevenue?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.nonTaxRevenue?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">
                  <span>
                    Non-Tax Revenue includes government income from various sources such as fees, licenses, permits, fines, and returns on investments that are not classified as taxes.
                  </span>
                </div>
                <div
                  v-if="budgetStore.revenueSources.nonTaxRevenue?.expenditureImpact !== 0"
                  class="tax-expenditure-note"
                >
                  This revenue figure includes the impact of non-tax revenue expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('nonTaxRevenue', 'min') }}%</span>
                    <span class="current-rate">{{ i18nText('simulator.controls.common.current', 'Current:') }} {{ revenueRates.nonTaxRevenue }}%</span>
                    <span>{{ getLabel('nonTaxRevenue', 'max') }}%</span>
                  </div>
                  <input 
                    v-model="localSliderValues.nonTaxRevenue" 
                    type="range" 
                    :min="getLabel('nonTaxRevenue', 'min')" 
                    :max="getLabel('nonTaxRevenue', 'max')" 
                    :step="0.1" 
                    class="slider-input"
                    @input="onSliderInput('nonTaxRevenue', localSliderValues.nonTaxRevenue)" 
                    /> <!-- 🆕 PERFORMANCE NOTE: Debounced slider commit using localSliderValues -->
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        v-model.number="revenueRates.nonTaxRevenue" 
                        type="number" 
                        class="percentage-input"
                        :min="getLabel('nonTaxRevenue', 'min')"
                        :max="getLabel('nonTaxRevenue', 'max')"
                        step="0.1"
                        @change="updateRevenueRate('nonTaxRevenue')"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        v-model.number="amountInputs.nonTaxRevenue" 
                        type="number" 
                        class="amount-input"
                        step="0.1"
                        @change="updateAmountInput('nonTaxRevenue')"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Revenue Summary Section -->
    <div class="revenue-summary">
      <div class="summary-card">
        <div class="summary-title">
          Total Revenue
        </div>
        <div class="summary-amount">
          ${{ formatCurrency(budgetStore.totalRevenue, 1) }}B
        </div>
        <div
          v-if="budgetStore.additionalRevenue !== 0"
          class="additional-revenue-total"
        >
          {{ budgetStore.additionalRevenue > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.additionalRevenue, 1) }}B
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div 
      v-if="activeTooltip"
      class="tooltip-text"
      :style="{ 
        visibility: activeTooltip ? 'visible' : 'hidden',
        opacity: activeTooltip ? 1 : 0
      }"
    >
      {{ activeTooltip }}
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, watch, computed, shallowRef, nextTick } from 'vue';
import CategoryInfo from '@/domains/budget/components/BudgetCategoryInfo.vue';
import { useI18n, getCategoryName } from '@/i18n'
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { useBudgetSimulatorStore } from '../store/budgetSimulator';

const budgetStore = useBudgetSimulatorStore();
const { t } = useI18n();
const i18nText = (key, fallback = '') => {
  const value = t(key)
  return value == key ? fallback : value
};
const activeTooltip = ref('');

// Local reactive state
const expandedGroups = ref({
  incomeTaxes: true,
  consumptionTaxes: true,
  otherRevenues: true
});

// Use shallowRef for better performance with large objects
const revenueRates = shallowRef({});
const localSliderValues = shallowRef({});

// Local reactive object for amount inputs
const amountInputs = ref({
  personalIncomeTax: 0,
  corporateIncomeTax: 0,
  gst: 0,
  exciseTaxes: 0,
  carbonPricing: 0,
  eiPremiums: 0,
  customsDuties: 0,
  crownProfits: 0,
  nonTaxRevenue: 0,
  resourceRoyalties: 0
});

// Memoized computed properties
const totalRevenue = computed(() => {
  // Only depend on the specific values we need
  return budgetStore.totalRevenue;
});

const additionalRevenue = computed(() => {
  return budgetStore.additionalRevenue;
});

// Computed properties for category totals
const incomeTaxTotal = computed(() => {
  return budgetStore.incomeTaxTotal;
});

const consumptionTaxTotal = computed(() => {
  return budgetStore.consumptionTaxTotal;
});

const otherRevenueTotal = computed(() => {
  return budgetStore.otherRevenueTotal;
});

// eslint-disable-next-line no-unused-vars
const formattedAdditionalRevenue = computed(() => {
  const value = additionalRevenue.value;
  return `${value > 0 ? '+' : ''}$${value.toFixed(1)}B`;
});

// eslint-disable-next-line no-unused-vars
const formattedTotalRevenue = computed(() => {
  return `$${(totalRevenue.value).toFixed(1)}B`;
});

// Helper: Return min or max label for a given revenue source.
function getLabel(source, type) {
  const sourceData = budgetStore.revenueSources[source] || {};
  if (type === 'min') return sourceData.minRate || getDefaultMin(source);
  if (type === 'max') return sourceData.maxRate || getDefaultMax(source);
  return sourceData.rate || 0;
}

// Fallback defaults if min/max are not provided in the store.
function getDefaultMin(source) {
  switch(source) {
    case 'personalIncomeTax': return 0;
    case 'corporateIncomeTax': return 0;
    case 'gst': return 0;
    case 'exciseTaxes': return 0;
    case 'carbonPricing': return 0;
    case 'eiPremiums': return 0;
    case 'customsDuties': return 0;
    case 'crownProfits': return 0;
    case 'nonTaxRevenue': return 0;
    case 'resourceRoyalties': return 0;
    default: return 0;
  }
}

function getDefaultMax(source) {
  switch(source) {
    case 'personalIncomeTax': return 50;
    case 'corporateIncomeTax': return 40;
    case 'gst': return 15;
    case 'exciseTaxes': return 10;
    case 'carbonPricing': return 5;
    case 'eiPremiums': return 5;
    case 'customsDuties': return 5;
    case 'crownProfits': return 10;
    case 'nonTaxRevenue': return 10;
    case 'resourceRoyalties': return 5;
    default: return 100;
  }
}

function showTooltip(text) {
  activeTooltip.value = text;
}

function hideTooltip() {
  activeTooltip.value = '';
}

// Toggle expansion state of a revenue group.
function toggleGroupExpansion(groupName) {
  expandedGroups.value[groupName] = !expandedGroups.value[groupName];
}

// Initialize local slider values from the store.
function initializeLocalValues() {
  const sources = budgetStore.revenueSources;
  const newRates = {};
  const newSliderValues = {};
  
  Object.keys(sources).forEach(sourceId => {
    const source = sources[sourceId];
    if (source) {
      newRates[sourceId] = source.rate || 0;
      newSliderValues[sourceId] = source.rate || 0;
    }
  });
  
  // Batch update reactive refs
  revenueRates.value = newRates;
  localSliderValues.value = newSliderValues;
  
  // Update amount inputs
  updateAmountInputs();
}

// Debounced store updates
const debouncedStoreUpdate = debounce((sourceId, value) => {
  budgetStore.updateRevenueRate(sourceId, value);
}, 150);

// Throttled UI updates
const throttledUIUpdate = throttle((sourceId, value) => {
  localSliderValues.value[sourceId] = value;
}, 16); // ~60fps

// Optimized slider input handler
function onSliderInput(sourceId, value) {
  // Update UI immediately for responsiveness
  throttledUIUpdate(sourceId, value);
  
  // Debounce store update to prevent excessive calculations
  debouncedStoreUpdate(sourceId, value);
}

// Update revenue rate in the store.
function updateRevenueRate(sourceId) {
  budgetStore.updateRevenueRate(sourceId, revenueRates.value[sourceId]);
  // Update the corresponding amount input
  updateAmountInput(sourceId, true);
}

// Update amount inputs based on current rates
function updateAmountInputs() {
  Object.keys(revenueRates.value).forEach(sourceId => {
    updateAmountInput(sourceId, true);
  });
}

// Update amount input for a specific source
function updateAmountInput(sourceId, fromRate = false) {
  const source = budgetStore.revenueSources[sourceId];
  if (!source) return;
  
  if (fromRate) {
    // Calculate amount from rate
    amountInputs.value[sourceId] = parseFloat(formatCurrency(source.amount, 1));
  } else {
    // Calculate rate from amount
    const newRate = amountInputs.value[sourceId] / source.base;
    // Ensure rate is within bounds
    const minRate = getLabel(sourceId, 'min');
    const maxRate = getLabel(sourceId, 'max');
    revenueRates.value[sourceId] = Math.max(minRate, Math.min(maxRate, newRate));
    // Update the store
    budgetStore.updateRevenueRate(sourceId, revenueRates.value[sourceId]);
  }
}

// Function to calculate additional revenue for a source with proper precision
const getAdditionalRevenue = (sourceId) => {
  const source = budgetStore.revenueSources[sourceId];
  if (!source) return 0;
  
  const defaultRate = source.rateByYear[budgetStore.currentYear];
  const baselineAmount = source.base * defaultRate;
  // Use Math.round to avoid floating point precision issues
  return Math.round((source.amount - baselineAmount) * 100) / 100;
};

// Format currency with proper precision
const formatCurrency = (value, decimals = 1) => {
  return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals);
};

// Optimized watchers with proper dependencies
watch(
  () => budgetStore.stateVersion,
  () => {
    console.log('[REVENUE SLIDERS] State version changed, refreshing values');
    nextTick(() => {
      initializeLocalValues();
    });
  }
);

// Watch for changes in the store's revenue sources and reinitialize if necessary.
watch(() => budgetStore.revenueSources, () => {
  initializeLocalValues();
}, { deep: true });

// Watch for state version changes to detect batch updates (like preset applications)
watch(() => budgetStore.stateVersion, (newVersion, oldVersion) => {
  console.log(`[REVENUE SLIDERS] Detected state version change: ${oldVersion} → ${newVersion}, refreshing local values`);
  initializeLocalValues();
  
  // Special handling for carbon tax to ensure UI is in sync
  if (budgetStore.revenueSources.carbonPricing) {
    console.log(`[CARBON TAX] Ensuring UI is in sync with store value: ${budgetStore.revenueSources.carbonPricing.rate}%`);
    localSliderValues.value.carbonPricing = budgetStore.revenueSources.carbonPricing.rate;
  }
});

// Watch for budget resets specifically (using lastUpdate as a trigger)
watch(() => budgetStore.lastUpdate, () => {
  console.log('Budget update detected - reinitializing sliders');
  // Force a complete reinitialization of all slider values
  // This ensures sliders reflect the reset values in the store
  setTimeout(() => {
    initializeLocalValues();
  }, 50); // Small delay to ensure store has completed all updates
});

// Watch for changes in the revenue source update timestamp
watch(() => budgetStore.lastRevenueSourceUpdate, () => {
  console.log('Revenue source update detected - reinitializing sliders');
  // Force a complete reinitialization of all slider values
  setTimeout(() => {
    initializeLocalValues();
  }, 50); // Small delay to ensure store has completed all updates
});

// Watch for changes in auto-balance state
watch(() => budgetStore.autoBalanceActive, (newValue, oldValue) => {
  // When auto-balance is turned off (especially during reset), reinitialize sliders
  if (oldValue === true && newValue === false) {
    console.log('Auto-balance turned off - reinitializing sliders');
    setTimeout(() => {
      initializeLocalValues();
    }, 50);
  }
});

// Watch for changes in revenue rates to update amount inputs
watch(() => revenueRates.value, () => {
  updateAmountInputs();
}, { deep: true });

// Initialize on component mount
onMounted(() => {
    initializeLocalValues();
});
</script>

<style scoped>
.revenue-sliders {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
  backdrop-filter: blur(10px);
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
  contain: content;
}

.revenue-sliders:hover {
  transform: translateY(-5px) translateZ(0);
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
}

.slider-group:hover {
  transform: translateY(-2px) translateZ(0);
  box-shadow: 
    0 6px 8px rgba(0, 0, 0, 0.12),
    0 3px 6px rgba(0, 0, 0, 0.1);
}

.slider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.slider-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.slider-title .material-icons {
  color: #4299e1;
}

.slider-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.slider-container {
  padding: 0.5rem 1.25rem 0.5rem 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 0;
  align-items: center;
}
.slider {
  max-width: 280px;
  width: 100%;
  margin: 0 auto;
  display: block;
}

.slider-input {
  width: 100%;
  height: 0.5rem;
  -webkit-appearance: none;
  appearance: none;
  background: #e2e8f0;
  border-radius: 0.25rem;
  outline: none;
  transform: translateZ(0);
  will-change: transform;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  background: #4299e1;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.1) translateZ(0);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider-input::-moz-range-thumb {
  width: 1.25rem;
  height: 1.25rem;
  background: #4299e1;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
}

.slider-input::-moz-range-thumb:hover {
  transform: scale(1.1) translateZ(0);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider-labels {
  font-size: 0.675rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.36rem;
  color: #4a5568;
}
.current-rate {
  min-width: 170px;
  text-align: center;
  display: inline-block;
}
.slider-description {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.5;
  margin-top: 0.5rem;
}

/* Responsive Design */
@container (max-width: 768px) {
  .revenue-sliders {
    padding: 1rem;
  }
  
  .slider-group {
    padding: 1rem;
  }
  
  .slider-title {
    font-size: 1rem;
  }
  
  .slider-value {
    font-size: 1.125rem;
  }
}

@container (max-width: 480px) {
  .revenue-sliders {
    padding: 0.75rem;
  }
  
  .slider-group {
    padding: 0.75rem;
  }
  
  .slider-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .slider-value {
    text-align: left;
  }
  
  .slider-labels {
    font-size: 0.75rem;
  }
}

/* Touch Device Optimizations */
@media (hover: none) {
  .revenue-sliders:hover,
  .slider-group:hover {
    transform: none;
  }
  
  .revenue-sliders:active,
  .slider-group:active {
    transform: translateY(-2px) translateZ(0);
  }
  
  .slider-input::-webkit-slider-thumb:hover,
  .slider-input::-moz-range-thumb:hover {
    transform: none;
  }
  
  .slider-input::-webkit-slider-thumb:active,
  .slider-input::-moz-range-thumb:active {
    transform: scale(1.1) translateZ(0);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .revenue-sliders,
  .slider-group,
  .slider-input::-webkit-slider-thumb,
  .slider-input::-moz-range-thumb {
    transition: none;
    transform: none !important;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .revenue-sliders,
  .slider-group {
    border: 2px solid CanvasText;
  }
  
  .slider-title .material-icons {
    border: 2px solid CanvasText;
  }
  
  .slider-input {
    border: 2px solid CanvasText;
  }
  
  .slider-input::-webkit-slider-thumb,
  .slider-input::-moz-range-thumb {
    border: 2px solid CanvasText;
  }
}

/* Print Styles */
@media print {
  .revenue-sliders {
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .slider-group {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .slider-input {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

.group-content > .grid {
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 1.5rem;
}

.revenue-tile {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.10), 0 1.5px 4px rgba(0,0,0,0.08);
  border: 1.5px solid #e2e8f0;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 220px;
  transition: box-shadow 0.25s, transform 0.25s;
  will-change: transform, box-shadow;
  word-break: break-word;
}
.revenue-tile::before {
  content: '';
  display: block;
  height: 6px;
  width: 100%;
  background: var(--tile-color, #4299E1);
  position: absolute;
  top: 0;
  left: 0;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}
.revenue-tile:hover {
  box-shadow: 0 10px 24px rgba(66,99,235,0.13), 0 4px 12px rgba(0,0,0,0.13);
  transform: translateY(-4px) scale(1.025) translateZ(10px);
  border-color: var(--tile-color, #4299E1);
}
.tile-header {
  padding: 1rem 1.25rem 0.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}
.tile-title, .tile-amount, .tile-note, .tax-expenditure-note {
  word-break: break-word;
  white-space: normal;
}
.tile-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}
.tile-amount {
  font-size: 0.78rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}
.tile-note, .tax-expenditure-note {
  padding: 0.35rem 0.8rem 0 0.8rem;
  font-size: 0.69rem;
  color: #4a5568;
  opacity: 0.95;
}
.percentage-input, .amount-input {
  width: 60px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.25rem;
}
.input-group {
  max-width: 70px;
}
.input-controls {
  gap: 0.25rem;
  max-width: 150px;
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

.additional-revenue {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.additional-revenue.positive {
  color: #059669; /* green-600 */
}

.additional-revenue.negative {
  color: #DC2626; /* red-600 */
}

.tax-expenditure-impact {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.impact-value.positive {
  color: #059669; /* green-600 */
}

.impact-value.negative {
  color: #DC2626; /* red-600 */
}

.tooltip-text {
  visibility: hidden;
  width: 250px;
  background-color: #2d3748;
  color: #fff;
  text-align: left;
  border-radius: 6px;
  padding: 8px 12px;
  position: fixed;
  z-index: 1000;
  bottom: 20px;
  left: 20px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.85rem;
  pointer-events: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* ======================== */
/* Square card + compact UI */
/* ======================== */

/* Match spending grid density */
/* Dedicated grid like spending */
.revenue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

/* Match spending card chrome */
.revenue-tile {
  background: #fbfcfd;
  border: 1px solid #e6edf3;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  min-height: auto;
  position: relative;
}

/* Thin accent bar using tile color */
.revenue-tile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--tile-color, #4098d7);
}

.revenue-tile:hover {
  transform: translateY(-1px);
  box-shadow:
    0 8px 16px rgba(16, 24, 40, 0.08);
  border-color: var(--tile-color, #4098d7);
}

/* Header styling similar to spending headers */
.tile-header {
  background-color: #f8fafc;
  padding: 0.55rem 0.8rem; /* tighter */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tile-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 650;
  letter-spacing: 0.2px;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;
}
.tile-icon {
  font-size: 18px;
  color: #64748b;
}

.tile-amount {
  font-size: 0.83rem;
  color: #4a5568;
}

/* Compact slider row: labels full width, slider left, inputs right */
.slider-container {
  padding: 0.7rem; /* tighter */
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  align-items: center;
  gap: 0.75rem 0.75rem;
}

.slider-labels { grid-column: 1 / -1; }

/* Tighten inputs */
.input-controls {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  column-gap: 0.5rem;
  align-items: center;
}

.percentage-input, .amount-input {
  width: 56px;
  padding: 0.25rem 0.4rem;
  font-size: 0.75rem;
  border-radius: 0.25rem;
}

.input-group { max-width: 64px; }

/* Clamp long notes to 3 lines like spending */
.tile-note > span {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Make slider style override global gradient styles */
input.slider-input[type="range"] {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(180deg, #e9eef4, #e5ebf1);
  border-radius: 6px;
  outline: none;
}

input.slider-input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #4098d7;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.18), 0 0 0 2px #fff inset;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

input.slider-input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.06);
  box-shadow: 0 2px 6px rgba(0,0,0,0.18);
}

input.slider-input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #4098d7;
  border: none;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.18);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

input.slider-input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.06);
  box-shadow: 0 2px 6px rgba(0,0,0,0.18);
}

@media (max-width: 600px) {
  .slider-labels { margin-bottom: 0.25rem; }
  .slider-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
  .input-controls {
    grid-column: 1;
    justify-self: start;
    grid-auto-flow: column;
    column-gap: 0.5rem;
  }
}
</style>
