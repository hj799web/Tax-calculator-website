<button
  :class="['year-button', { active: selectedTaxYear === '2025' }]"
  @click="selectYear('2025')"
>
  2024-2025
</button> 