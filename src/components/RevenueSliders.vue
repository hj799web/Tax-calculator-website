<template>
  <div class="revenue-sliders">
    <div class="revenue-controls">
      <div class="overflow-y-auto pr-2 max-h-[60vh]">
        <!-- Income Taxes Group -->
        <div class="mb-4">
          <div class="group-header" @click="toggleGroupExpansion('incomeTaxes')">
            <h3 class="text-sm font-medium text-gray-700">Income Taxes</h3>
            <div class="group-total">${{ formatCurrency(incomeTaxTotal, 1) }}B</div>
            <div class="toggle-button">
              {{ expandedGroups.incomeTaxes ? 'Collapse' : 'Expand' }}
              <span class="icon ml-1" :class="{ 'rotated': expandedGroups.incomeTaxes }">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </div>
          </div>
          
          <div class="group-content" :class="{ 'expanded': expandedGroups.incomeTaxes }">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Personal Income Tax -->
              <div class="revenue-tile" :style="{ '--tile-color': budgetStore.revenueSources.personalIncomeTax?.color || '#4299E1' }">
                <div class="tile-header">
                  <div class="tile-title">Personal Income Tax</div>
                  <div class="tile-amount">
                    <div class="total-amount">${{ formatCurrency(budgetStore.revenueSources.personalIncomeTax?.adjustedAmount || budgetStore.revenueSources.personalIncomeTax?.amount, 1) }}B</div>
                    <div class="base-amount">Base: ${{ formatCurrency(budgetStore.revenueSources.personalIncomeTax?.base * budgetStore.revenueSources.personalIncomeTax?.rateByYear[budgetStore.currentYear], 1) }}B</div>
                    <div class="additional-revenue" v-if="getAdditionalRevenue('personalIncomeTax') !== 0">
                      {{ getAdditionalRevenue('personalIncomeTax') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('personalIncomeTax'), 1) }}B
                    </div>
                    <div class="tax-expenditure-impact" v-if="budgetStore.revenueSources.personalIncomeTax?.expenditureImpact !== 0">
                      <span class="impact-label">Tax Expenditure Impact:</span>
                      <span class="impact-value" :class="{'positive': budgetStore.revenueSources.personalIncomeTax?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.personalIncomeTax?.expenditureImpact < 0}">
                        {{ budgetStore.revenueSources.personalIncomeTax?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.personalIncomeTax?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">{{ budgetStore.revenueSources.personalIncomeTax?.note }}</div>
                <div class="tax-expenditure-note" v-if="budgetStore.revenueSources.personalIncomeTax?.expenditureImpact !== 0">
                  This revenue figure includes the impact of personal tax credit and deferral adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('personalIncomeTax', 'min') }}%</span>
                    <span class="current-rate">Current: {{ revenueRates.personalIncomeTax }}%</span>
                    <span>{{ getLabel('personalIncomeTax', 'max') }}%</span>
                  </div>
                  <input 
                    type="range" 
                    :min="getLabel('personalIncomeTax', 'min')" 
                    :max="getLabel('personalIncomeTax', 'max')" 
                    :step="0.1" 
                    v-model="revenueRates.personalIncomeTax" 
                    @input="updateRevenueRate('personalIncomeTax')"
                    class="slider"
                  >
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="revenueRates.personalIncomeTax" 
                        @change="updateRevenueRate('personalIncomeTax')"
                        class="percentage-input"
                        :min="getLabel('personalIncomeTax', 'min')"
                        :max="getLabel('personalIncomeTax', 'max')"
                        step="0.1"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="amountInputs.personalIncomeTax" 
                        @change="updateAmountInput('personalIncomeTax')"
                        class="amount-input"
                        step="0.1"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Corporate Income Tax -->
              <div class="revenue-tile" :style="{ '--tile-color': budgetStore.revenueSources.corporateIncomeTax?.color || '#48BB78' }">
                <div class="tile-header">
                  <div class="tile-title">Corporate Income Tax</div>
                  <div class="tile-amount">
                    <div class="total-amount">${{ formatCurrency(budgetStore.revenueSources.corporateIncomeTax?.adjustedAmount || budgetStore.revenueSources.corporateIncomeTax?.amount, 1) }}B</div>
                    <div class="base-amount">Base: ${{ formatCurrency(budgetStore.revenueSources.corporateIncomeTax?.base * budgetStore.revenueSources.corporateIncomeTax?.rateByYear[budgetStore.currentYear], 1) }}B</div>
                    <div class="additional-revenue" v-if="getAdditionalRevenue('corporateIncomeTax') !== 0">
                      {{ getAdditionalRevenue('corporateIncomeTax') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('corporateIncomeTax'), 1) }}B
                    </div>
                    <div class="tax-expenditure-impact" v-if="budgetStore.revenueSources.corporateIncomeTax?.expenditureImpact !== 0">
                      <span class="impact-label">Tax Expenditure Impact:</span>
                      <span class="impact-value" :class="{'positive': budgetStore.revenueSources.corporateIncomeTax?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.corporateIncomeTax?.expenditureImpact < 0}">
                        {{ budgetStore.revenueSources.corporateIncomeTax?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.corporateIncomeTax?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">{{ budgetStore.revenueSources.corporateIncomeTax?.note }}</div>
                <div class="tax-expenditure-note" v-if="budgetStore.revenueSources.corporateIncomeTax?.expenditureImpact !== 0">
                  This revenue figure includes the impact of corporate tax expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('corporateIncomeTax', 'min') }}%</span>
                    <span class="current-rate">Current: {{ revenueRates.corporateIncomeTax }}%</span>
                    <span>{{ getLabel('corporateIncomeTax', 'max') }}%</span>
                  </div>
                  <input 
                    type="range" 
                    :min="getLabel('corporateIncomeTax', 'min')" 
                    :max="getLabel('corporateIncomeTax', 'max')" 
                    :step="0.1" 
                    v-model="revenueRates.corporateIncomeTax" 
                    @input="updateRevenueRate('corporateIncomeTax')"
                    class="slider"
                  >
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="revenueRates.corporateIncomeTax" 
                        @change="updateRevenueRate('corporateIncomeTax')"
                        class="percentage-input"
                        :min="getLabel('corporateIncomeTax', 'min')"
                        :max="getLabel('corporateIncomeTax', 'max')"
                        step="0.1"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="amountInputs.corporateIncomeTax" 
                        @change="updateAmountInput('corporateIncomeTax')"
                        class="amount-input"
                        step="0.1"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Consumption Taxes Group -->
        <div class="mb-4">
          <div class="group-header" @click="toggleGroupExpansion('consumptionTaxes')">
            <h3 class="text-sm font-medium text-gray-700">Consumption Taxes</h3>
            <div class="group-total">${{ formatCurrency(consumptionTaxTotal, 1) }}B</div>
            <div class="toggle-button">
              {{ expandedGroups.consumptionTaxes ? 'Collapse' : 'Expand' }}
              <span class="icon ml-1" :class="{ 'rotated': expandedGroups.consumptionTaxes }">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </div>
          </div>
          
          <div class="group-content" :class="{ 'expanded': expandedGroups.consumptionTaxes }">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- GST/HST -->
              <div class="revenue-tile" :style="{ '--tile-color': budgetStore.revenueSources.gst?.color || '#ED8936' }">
                <div class="tile-header">
                  <div class="tile-title">GST/HST</div>
                  <div class="tile-amount">
                    <div class="total-amount">${{ formatCurrency(budgetStore.revenueSources.gst?.adjustedAmount || budgetStore.revenueSources.gst?.amount, 1) }}B</div>
                    <div class="base-amount">Base: ${{ formatCurrency(budgetStore.revenueSources.gst?.base * budgetStore.revenueSources.gst?.rateByYear[budgetStore.currentYear], 1) }}B</div>
                    <div class="additional-revenue" v-if="getAdditionalRevenue('gst') !== 0">
                      {{ getAdditionalRevenue('gst') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('gst'), 1) }}B
                    </div>
                    <div class="tax-expenditure-impact" v-if="budgetStore.revenueSources.gst?.expenditureImpact !== 0">
                      <span class="impact-label">Tax Expenditure Impact:</span>
                      <span class="impact-value" :class="{'positive': budgetStore.revenueSources.gst?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.gst?.expenditureImpact < 0}">
                        {{ budgetStore.revenueSources.gst?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.gst?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">{{ budgetStore.revenueSources.gst?.note }}</div>
                <div class="tax-expenditure-note" v-if="budgetStore.revenueSources.gst?.expenditureImpact !== 0">
                  This revenue figure includes the impact of GST/HST expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('gst', 'min') }}%</span>
                    <span class="current-rate">Current: {{ revenueRates.gst }}%</span>
                    <span>{{ getLabel('gst', 'max') }}%</span>
                  </div>
                  <input 
                    type="range" 
                    :min="getLabel('gst', 'min')" 
                    :max="getLabel('gst', 'max')" 
                    :step="0.1" 
                    v-model="revenueRates.gst" 
                    @input="updateRevenueRate('gst')"
                    class="slider"
                  >
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="revenueRates.gst" 
                        @change="updateRevenueRate('gst')"
                        class="percentage-input"
                        :min="getLabel('gst', 'min')"
                        :max="getLabel('gst', 'max')"
                        step="0.1"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="amountInputs.gst" 
                        @change="updateAmountInput('gst')"
                        class="amount-input"
                        step="0.1"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Customs Duties -->
              <div class="revenue-tile" :style="{ '--tile-color': budgetStore.revenueSources.customsDuties?.color || '#F56565' }">
                <div class="tile-header">
                  <div class="tile-title">Customs Duties</div>
                  <div class="tile-amount">
                    <div class="total-amount">${{ formatCurrency(budgetStore.revenueSources.customsDuties?.adjustedAmount || budgetStore.revenueSources.customsDuties?.amount, 1) }}B</div>
                    <div class="base-amount">Base: ${{ formatCurrency(budgetStore.revenueSources.customsDuties?.base * budgetStore.revenueSources.customsDuties?.rateByYear[budgetStore.currentYear], 1) }}B</div>
                    <div class="additional-revenue" v-if="getAdditionalRevenue('customsDuties') !== 0">
                      {{ getAdditionalRevenue('customsDuties') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('customsDuties'), 1) }}B
                    </div>
                    <div class="tax-expenditure-impact" v-if="budgetStore.revenueSources.customsDuties?.expenditureImpact !== 0">
                      <span class="impact-label">Tax Expenditure Impact:</span>
                      <span class="impact-value" :class="{'positive': budgetStore.revenueSources.customsDuties?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.customsDuties?.expenditureImpact < 0}">
                        {{ budgetStore.revenueSources.customsDuties?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.customsDuties?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">{{ budgetStore.revenueSources.customsDuties?.note }}</div>
                <div class="tax-expenditure-note" v-if="budgetStore.revenueSources.customsDuties?.expenditureImpact !== 0">
                  This revenue figure includes the impact of customs duties expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('customsDuties', 'min') }}%</span>
                    <span class="current-rate">Current: {{ revenueRates.customsDuties }}%</span>
                    <span>{{ getLabel('customsDuties', 'max') }}%</span>
                  </div>
                  <input 
                    type="range" 
                    :min="getLabel('customsDuties', 'min')" 
                    :max="getLabel('customsDuties', 'max')" 
                    :step="0.1" 
                    v-model="revenueRates.customsDuties" 
                    @input="updateRevenueRate('customsDuties')"
                    class="slider"
                  >
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="revenueRates.customsDuties" 
                        @change="updateRevenueRate('customsDuties')"
                        class="percentage-input"
                        :min="getLabel('customsDuties', 'min')"
                        :max="getLabel('customsDuties', 'max')"
                        step="0.1"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="amountInputs.customsDuties" 
                        @change="updateAmountInput('customsDuties')"
                        class="amount-input"
                        step="0.1"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <!-- Carbon Pricing -->
              <div class="revenue-tile" :style="{ '--tile-color': budgetStore.revenueSources.carbonPricing?.color || '#38B2AC' }">
                <div class="tile-header">
                  <div class="tile-title">Carbon Pricing</div>
                  <div class="tile-amount">
                    <div class="total-amount">${{ formatCurrency(budgetStore.revenueSources.carbonPricing?.adjustedAmount || budgetStore.revenueSources.carbonPricing?.amount, 1) }}B</div>
                    <div class="base-amount">Base: ${{ formatCurrency(budgetStore.revenueSources.carbonPricing?.base * budgetStore.revenueSources.carbonPricing?.rateByYear[budgetStore.currentYear], 1) }}B</div>
                    <div class="additional-revenue" v-if="getAdditionalRevenue('carbonPricing') !== 0">
                      {{ getAdditionalRevenue('carbonPricing') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('carbonPricing'), 1) }}B
                    </div>
                    <div class="tax-expenditure-impact" v-if="budgetStore.revenueSources.carbonPricing?.expenditureImpact !== 0">
                      <span class="impact-label">Tax Expenditure Impact:</span>
                      <span class="impact-value" :class="{'positive': budgetStore.revenueSources.carbonPricing?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.carbonPricing?.expenditureImpact < 0}">
                        {{ budgetStore.revenueSources.carbonPricing?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.carbonPricing?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">{{ budgetStore.revenueSources.carbonPricing?.note }}</div>
                <div class="tax-expenditure-note" v-if="budgetStore.revenueSources.carbonPricing?.expenditureImpact !== 0">
                  This revenue figure includes the impact of carbon pricing expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('carbonPricing', 'min') }}%</span>
                    <span class="current-rate">Current: {{ revenueRates.carbonPricing }}%</span>
                    <span>{{ getLabel('carbonPricing', 'max') }}%</span>
                  </div>
                  <input 
                    type="range" 
                    :min="getLabel('carbonPricing', 'min')" 
                    :max="getLabel('carbonPricing', 'max')" 
                    :step="0.1" 
                    v-model="revenueRates.carbonPricing" 
                    @input="updateRevenueRate('carbonPricing')"
                    class="slider"
                  >
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="revenueRates.carbonPricing" 
                        @change="updateRevenueRate('carbonPricing')"
                        class="percentage-input"
                        :min="getLabel('carbonPricing', 'min')"
                        :max="getLabel('carbonPricing', 'max')"
                        step="0.1"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="amountInputs.carbonPricing" 
                        @change="updateAmountInput('carbonPricing')"
                        class="amount-input"
                        step="0.1"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Excise Taxes -->
              <div class="revenue-tile" :style="{ '--tile-color': budgetStore.revenueSources.exciseTaxes?.color || '#9F7AEA' }">
                <div class="tile-header">
                  <div class="tile-title">Excise Taxes</div>
                  <div class="tile-amount">
                    <div class="total-amount">${{ formatCurrency(budgetStore.revenueSources.exciseTaxes?.adjustedAmount || budgetStore.revenueSources.exciseTaxes?.amount, 1) }}B</div>
                    <div class="base-amount">Base: ${{ formatCurrency(budgetStore.revenueSources.exciseTaxes?.base * budgetStore.revenueSources.exciseTaxes?.rateByYear[budgetStore.currentYear], 1) }}B</div>
                    <div class="additional-revenue" v-if="getAdditionalRevenue('exciseTaxes') !== 0">
                      {{ getAdditionalRevenue('exciseTaxes') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('exciseTaxes'), 1) }}B
                    </div>
                    <div class="tax-expenditure-impact" v-if="budgetStore.revenueSources.exciseTaxes?.expenditureImpact !== 0">
                      <span class="impact-label">Tax Expenditure Impact:</span>
                      <span class="impact-value" :class="{'positive': budgetStore.revenueSources.exciseTaxes?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.exciseTaxes?.expenditureImpact < 0}">
                        {{ budgetStore.revenueSources.exciseTaxes?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.exciseTaxes?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">{{ budgetStore.revenueSources.exciseTaxes?.note }}</div>
                <div class="tax-expenditure-note" v-if="budgetStore.revenueSources.exciseTaxes?.expenditureImpact !== 0">
                  This revenue figure includes the impact of excise taxes expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('exciseTaxes', 'min') }}%</span>
                    <span class="current-rate">Current: {{ revenueRates.exciseTaxes }}%</span>
                    <span>{{ getLabel('exciseTaxes', 'max') }}%</span>
                  </div>
                  <input 
                    type="range" 
                    :min="getLabel('exciseTaxes', 'min')" 
                    :max="getLabel('exciseTaxes', 'max')" 
                    :step="0.1" 
                    v-model="revenueRates.exciseTaxes" 
                    @input="updateRevenueRate('exciseTaxes')"
                    class="slider"
                  >
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="revenueRates.exciseTaxes" 
                        @change="updateRevenueRate('exciseTaxes')"
                        class="percentage-input"
                        :min="getLabel('exciseTaxes', 'min')"
                        :max="getLabel('exciseTaxes', 'max')"
                        step="0.1"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="amountInputs.exciseTaxes" 
                        @change="updateAmountInput('exciseTaxes')"
                        class="amount-input"
                        step="0.1"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Revenue Sources Group -->
        <div class="mb-4">
          <div class="group-header" @click="toggleGroupExpansion('otherRevenues')">
            <h3 class="text-sm font-medium text-gray-700">Other Revenue Sources</h3>
            <div class="group-total">${{ formatCurrency(otherRevenueTotal, 1) }}B</div>
            <div class="toggle-button">
              {{ expandedGroups.otherRevenues ? 'Collapse' : 'Expand' }}
              <span class="icon ml-1" :class="{ 'rotated': expandedGroups.otherRevenues }">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </div>
          </div>
          
          <div class="group-content" :class="{ 'expanded': expandedGroups.otherRevenues }">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Employment Insurance Premiums -->
              <div class="revenue-tile" :style="{ '--tile-color': budgetStore.revenueSources.eiPremiums?.color || '#667EEA' }">
                <div class="tile-header">
                  <div class="tile-title">EI Premiums</div>
                  <div class="tile-amount">
                    <div class="total-amount">${{ formatCurrency(budgetStore.revenueSources.eiPremiums?.adjustedAmount || budgetStore.revenueSources.eiPremiums?.amount, 1) }}B</div>
                    <div class="base-amount">Base: ${{ formatCurrency(budgetStore.revenueSources.eiPremiums?.base * budgetStore.revenueSources.eiPremiums?.rateByYear[budgetStore.currentYear], 1) }}B</div>
                    <div class="additional-revenue" v-if="getAdditionalRevenue('eiPremiums') !== 0">
                      {{ getAdditionalRevenue('eiPremiums') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('eiPremiums'), 1) }}B
                    </div>
                    <div class="tax-expenditure-impact" v-if="budgetStore.revenueSources.eiPremiums?.expenditureImpact !== 0">
                      <span class="impact-label">Tax Expenditure Impact:</span>
                      <span class="impact-value" :class="{'positive': budgetStore.revenueSources.eiPremiums?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.eiPremiums?.expenditureImpact < 0}">
                        {{ budgetStore.revenueSources.eiPremiums?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.eiPremiums?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">{{ budgetStore.revenueSources.eiPremiums?.note }}</div>
                <div class="tax-expenditure-note" v-if="budgetStore.revenueSources.eiPremiums?.expenditureImpact !== 0">
                  This revenue figure includes the impact of employment insurance premiums expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('eiPremiums', 'min') }}%</span>
                    <span class="current-rate">Current: {{ revenueRates.eiPremiums }}%</span>
                    <span>{{ getLabel('eiPremiums', 'max') }}%</span>
                  </div>
                  <input 
                    type="range" 
                    :min="getLabel('eiPremiums', 'min')" 
                    :max="getLabel('eiPremiums', 'max')" 
                    :step="0.1" 
                    v-model="revenueRates.eiPremiums" 
                    @input="updateRevenueRate('eiPremiums')"
                    class="slider"
                  >
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="revenueRates.eiPremiums" 
                        @change="updateRevenueRate('eiPremiums')"
                        class="percentage-input"
                        :min="getLabel('eiPremiums', 'min')"
                        :max="getLabel('eiPremiums', 'max')"
                        step="0.1"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="amountInputs.eiPremiums" 
                        @change="updateAmountInput('eiPremiums')"
                        class="amount-input"
                        step="0.1"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Crown Corporation Profits -->
              <div class="revenue-tile" :style="{ '--tile-color': budgetStore.revenueSources.crownProfits?.color || '#F687B3' }">
                <div class="tile-header">
                  <div class="tile-title">Crown Corp Profits</div>
                  <div class="tile-amount">
                    <div class="total-amount">${{ formatCurrency(budgetStore.revenueSources.crownProfits?.adjustedAmount || budgetStore.revenueSources.crownProfits?.amount, 1) }}B</div>
                    <div class="base-amount">Base: ${{ formatCurrency(budgetStore.revenueSources.crownProfits?.base * budgetStore.revenueSources.crownProfits?.rateByYear[budgetStore.currentYear], 1) }}B</div>
                    <div class="additional-revenue" v-if="getAdditionalRevenue('crownProfits') !== 0">
                      {{ getAdditionalRevenue('crownProfits') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('crownProfits'), 1) }}B
                    </div>
                    <div class="tax-expenditure-impact" v-if="budgetStore.revenueSources.crownProfits?.expenditureImpact !== 0">
                      <span class="impact-label">Tax Expenditure Impact:</span>
                      <span class="impact-value" :class="{'positive': budgetStore.revenueSources.crownProfits?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.crownProfits?.expenditureImpact < 0}">
                        {{ budgetStore.revenueSources.crownProfits?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.crownProfits?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">{{ budgetStore.revenueSources.crownProfits?.note }}</div>
                <div class="tax-expenditure-note" v-if="budgetStore.revenueSources.crownProfits?.expenditureImpact !== 0">
                  This revenue figure includes the impact of crown corporation profits expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('crownProfits', 'min') }}%</span>
                    <span class="current-rate">Current: {{ revenueRates.crownProfits }}%</span>
                    <span>{{ getLabel('crownProfits', 'max') }}%</span>
                  </div>
                  <input 
                    type="range" 
                    :min="getLabel('crownProfits', 'min')" 
                    :max="getLabel('crownProfits', 'max')" 
                    :step="0.1" 
                    v-model="revenueRates.crownProfits" 
                    @input="updateRevenueRate('crownProfits')"
                    class="slider"
                  >
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="revenueRates.crownProfits" 
                        @change="updateRevenueRate('crownProfits')"
                        class="percentage-input"
                        :min="getLabel('crownProfits', 'min')"
                        :max="getLabel('crownProfits', 'max')"
                        step="0.1"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="amountInputs.crownProfits" 
                        @change="updateAmountInput('crownProfits')"
                        class="amount-input"
                        step="0.1"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <!-- Resource Royalties -->
              <div class="revenue-tile" :style="{ '--tile-color': budgetStore.revenueSources.resourceRoyalties?.color || '#B794F4' }">
                <div class="tile-header">
                  <div class="tile-title">Resource Royalties</div>
                  <div class="tile-amount">
                    <div class="total-amount">${{ formatCurrency(budgetStore.revenueSources.resourceRoyalties?.adjustedAmount || budgetStore.revenueSources.resourceRoyalties?.amount, 1) }}B</div>
                    <div class="base-amount">Base: ${{ formatCurrency(budgetStore.revenueSources.resourceRoyalties?.base * budgetStore.revenueSources.resourceRoyalties?.rateByYear[budgetStore.currentYear], 1) }}B</div>
                    <div class="additional-revenue" v-if="getAdditionalRevenue('resourceRoyalties') !== 0">
                      {{ getAdditionalRevenue('resourceRoyalties') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('resourceRoyalties'), 1) }}B
                    </div>
                    <div class="tax-expenditure-impact" v-if="budgetStore.revenueSources.resourceRoyalties?.expenditureImpact !== 0">
                      <span class="impact-label">Tax Expenditure Impact:</span>
                      <span class="impact-value" :class="{'positive': budgetStore.revenueSources.resourceRoyalties?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.resourceRoyalties?.expenditureImpact < 0}">
                        {{ budgetStore.revenueSources.resourceRoyalties?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.resourceRoyalties?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">{{ budgetStore.revenueSources.resourceRoyalties?.note }}</div>
                <div class="tax-expenditure-note" v-if="budgetStore.revenueSources.resourceRoyalties?.expenditureImpact !== 0">
                  This revenue figure includes the impact of resource royalties expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('resourceRoyalties', 'min') }}%</span>
                    <span class="current-rate">Current: {{ revenueRates.resourceRoyalties }}%</span>
                    <span>{{ getLabel('resourceRoyalties', 'max') }}%</span>
                  </div>
                  <input 
                    type="range" 
                    :min="getLabel('resourceRoyalties', 'min')" 
                    :max="getLabel('resourceRoyalties', 'max')" 
                    :step="0.1" 
                    v-model="revenueRates.resourceRoyalties" 
                    @input="updateRevenueRate('resourceRoyalties')"
                    class="slider"
                  >
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="revenueRates.resourceRoyalties" 
                        @change="updateRevenueRate('resourceRoyalties')"
                        class="percentage-input"
                        :min="getLabel('resourceRoyalties', 'min')"
                        :max="getLabel('resourceRoyalties', 'max')"
                        step="0.1"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="amountInputs.resourceRoyalties" 
                        @change="updateAmountInput('resourceRoyalties')"
                        class="amount-input"
                        step="0.1"
                      >
                      <span class="input-suffix">B</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Non-Tax Revenue -->
              <div class="revenue-tile" :style="{ '--tile-color': budgetStore.revenueSources.nonTaxRevenue?.color || '#FC8181' }">
                <div class="tile-header">
                  <div class="tile-title">Non-Tax Revenue</div>
                  <div class="tile-amount">
                    <div class="total-amount">${{ formatCurrency(budgetStore.revenueSources.nonTaxRevenue?.adjustedAmount || budgetStore.revenueSources.nonTaxRevenue?.amount, 1) }}B</div>
                    <div class="base-amount">Base: ${{ formatCurrency(budgetStore.revenueSources.nonTaxRevenue?.base * budgetStore.revenueSources.nonTaxRevenue?.rateByYear[budgetStore.currentYear], 1) }}B</div>
                    <div class="additional-revenue" v-if="getAdditionalRevenue('nonTaxRevenue') !== 0">
                      {{ getAdditionalRevenue('nonTaxRevenue') > 0 ? '+' : '' }}${{ formatCurrency(getAdditionalRevenue('nonTaxRevenue'), 1) }}B
                    </div>
                    <div class="tax-expenditure-impact" v-if="budgetStore.revenueSources.nonTaxRevenue?.expenditureImpact !== 0">
                      <span class="impact-label">Tax Expenditure Impact:</span>
                      <span class="impact-value" :class="{'positive': budgetStore.revenueSources.nonTaxRevenue?.expenditureImpact > 0, 'negative': budgetStore.revenueSources.nonTaxRevenue?.expenditureImpact < 0}">
                        {{ budgetStore.revenueSources.nonTaxRevenue?.expenditureImpact > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.revenueSources.nonTaxRevenue?.expenditureImpact, 1) }}B
                      </span>
                    </div>
                  </div>
                </div>
                <div class="tile-note">{{ budgetStore.revenueSources.nonTaxRevenue?.note }}</div>
                <div class="tax-expenditure-note" v-if="budgetStore.revenueSources.nonTaxRevenue?.expenditureImpact !== 0">
                  This revenue figure includes the impact of non-tax revenue expenditure adjustments.
                </div>
                <div class="slider-container">
                  <div class="slider-labels">
                    <span>{{ getLabel('nonTaxRevenue', 'min') }}%</span>
                    <span class="current-rate">Current: {{ revenueRates.nonTaxRevenue }}%</span>
                    <span>{{ getLabel('nonTaxRevenue', 'max') }}%</span>
                  </div>
                  <input 
                    type="range" 
                    :min="getLabel('nonTaxRevenue', 'min')" 
                    :max="getLabel('nonTaxRevenue', 'max')" 
                    :step="0.1" 
                    v-model="revenueRates.nonTaxRevenue" 
                    @input="updateRevenueRate('nonTaxRevenue')"
                    class="slider"
                  >
                  <div class="input-controls">
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="revenueRates.nonTaxRevenue" 
                        @change="updateRevenueRate('nonTaxRevenue')"
                        class="percentage-input"
                        :min="getLabel('nonTaxRevenue', 'min')"
                        :max="getLabel('nonTaxRevenue', 'max')"
                        step="0.1"
                      >
                      <span class="input-suffix">%</span>
                    </div>
                    <div class="input-group">
                      <input 
                        type="number" 
                        v-model.number="amountInputs.nonTaxRevenue" 
                        @change="updateAmountInput('nonTaxRevenue')"
                        class="amount-input"
                        step="0.1"
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
        <div class="summary-title">Total Revenue</div>
        <div class="summary-amount">${{ formatCurrency(budgetStore.totalRevenue, 1) }}B</div>
        <div class="additional-revenue-total" v-if="budgetStore.additionalRevenue !== 0">
          {{ budgetStore.additionalRevenue > 0 ? '+' : '' }}${{ formatCurrency(budgetStore.additionalRevenue, 1) }}B
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useBudgetSimulatorStore } from '../stores/budgetSimulator.js';

// Initialize the budget simulator store
const budgetStore = useBudgetSimulatorStore();

// Local reactive state
const expandedGroups = ref({
  incomeTaxes: true,
  consumptionTaxes: true,
  otherRevenues: true
});

// Local reactive object storing each revenue category's effective rate.
// This is kept in sync with the store but allows for smoother UI updates.
const revenueRates = ref({});

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

// Computed properties for revenue totals
const additionalRevenue = computed(() => {
  return budgetStore.additionalRevenue;
});

const totalRevenue = computed(() => {
  return budgetStore.totalRevenue;
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

// Toggle expansion state of a revenue group.
function toggleGroupExpansion(groupName) {
  expandedGroups.value[groupName] = !expandedGroups.value[groupName];
}

// Initialize local slider values from the store.
function initializeLocalValues() {
  revenueRates.value = {
    personalIncomeTax: budgetStore.revenueSources.personalIncomeTax?.rate || 21,
    corporateIncomeTax: budgetStore.revenueSources.corporateIncomeTax?.rate || 15,
    gst: budgetStore.revenueSources.gst?.rate || 5,
    exciseTaxes: budgetStore.revenueSources.exciseTaxes?.rate || 2.5,
    carbonPricing: budgetStore.revenueSources.carbonPricing?.rate || 1,
    eiPremiums: budgetStore.revenueSources.eiPremiums?.rate || 1.35,
    customsDuties: budgetStore.revenueSources.customsDuties?.rate || 1,
    crownProfits: budgetStore.revenueSources.crownProfits?.rate || 2.5,
    nonTaxRevenue: budgetStore.revenueSources.nonTaxRevenue?.rate || 3,
    resourceRoyalties: budgetStore.revenueSources.resourceRoyalties?.rate || 1
  };
  
  // Initialize amount inputs
  updateAmountInputs();
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

// Watch for changes in the store's revenue sources and reinitialize if necessary.
watch(() => budgetStore.revenueSources, () => {
  initializeLocalValues();
}, { deep: true });

// Watch for changes in revenue rates to update amount inputs
watch(() => revenueRates.value, () => {
  updateAmountInputs();
}, { deep: true });

onMounted(() => {
  initializeLocalValues();
});
</script>

<style scoped>
.revenue-sliders {
  padding: 20px;
}

.revenue-tile {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--tile-color, #4299E1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.revenue-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.tile-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: #2d3748;
}

.tile-amount {
  text-align: right;
}

.total-amount {
  font-weight: 700;
  font-size: 1rem;
  color: #2d3748;
}

.base-amount {
  font-size: 0.75rem;
  color: #718096;
  margin-top: 2px;
}

.additional-revenue {
  font-size: 0.8rem;
  font-weight: 500;
  color: #4299E1;
  margin-top: 2px;
}

.tile-note {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 10px;
  min-height: 2.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.slider-container {
  margin-top: 5px;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #718096;
  margin-bottom: 2px;
}

input[type="range"] {
  width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  margin: 5px 0;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--tile-color, #4299E1);
  cursor: pointer;
  transition: all 0.2s ease;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--tile-color, #4299E1);
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.input-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  gap: 8px;
}

.input-group {
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
}

.percentage-input, .amount-input {
  width: 100%;
  padding: 4px 24px 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #2d3748;
  background-color: white;
  transition: border-color 0.2s ease;
  -webkit-appearance: textfield; /* For WebKit browsers */
  -moz-appearance: textfield; /* For Mozilla browsers */
  appearance: textfield; /* Standard property for compatibility */
}

.percentage-input::-webkit-inner-spin-button, 
.percentage-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button,
.amount-input::-webkit-outer-spin-button { 
  -webkit-appearance: none;
  margin: 0;
}

.percentage-input:focus, .amount-input:focus {
  border-color: var(--tile-color, #4299E1);
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
}

.input-suffix {
  position: absolute;
  right: 8px;
  color: #718096;
  font-size: 0.85rem;
  pointer-events: none;
}

.group-header {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.group-header:hover {
  background-color: #f7fafc;
}

.group-header h3 {
  flex: 1;
}

.group-total {
  font-weight: 600;
  color: #2d3748;
  margin-right: 10px;
}

.toggle-button {
  font-size: 0.75rem;
  color: #4a5568;
  display: flex;
  align-items: center;
}

.icon {
  transition: transform 0.3s ease;
}

.icon.rotated {
  transform: rotate(180deg);
}

.group-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
}

.group-content.expanded {
  max-height: 2000px;
}

.revenue-summary {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.summary-card {
  background-color: white;
  border-radius: 10px;
  padding: 15px 20px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.summary-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #2d3748;
}

.summary-amount {
  font-weight: 700;
  font-size: 1.2rem;
  color: #2d3748;
}

.additional-revenue-total {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4299E1;
  margin-top: 0.25rem;
  text-align: center;
}

.tax-expenditure-impact {
  font-size: 0.7rem;
  margin-top: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.impact-label {
  color: #4a5568;
}

.impact-value {
  font-weight: 500;
}

.impact-value.positive {
  color: #48bb78;
}

.impact-value.negative {
  color: #f56565;
}

.tax-expenditure-note {
  font-size: 0.7rem;
  color: #4a5568;
  font-style: italic;
  margin-top: 0.25rem;
  padding-top: 0.25rem;
  border-top: 1px dashed #e2e8f0;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .revenue-tile,
  .revenue-tile:hover,
  input[type="range"]::-webkit-slider-thumb,
  input[type="range"]::-moz-range-thumb,
  .group-content,
  .icon {
    transition: none;
    transform: none;
  }
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus styles for better keyboard navigation */
input[type="range"]:focus {
  outline: 2px solid var(--tile-color, #4299E1);
  outline-offset: 2px;
}
</style>
