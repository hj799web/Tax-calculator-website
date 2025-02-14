<template> 
  <section class="budget-categories-section">
    <h2 class="section-title">
      Budget Categories
    </h2>
<!-- Introduction Text -->
<p class="intro-text">
      These budget categories are for the 2022–2023 fiscal year. Data is sourced from the Public Accounts of Canada offering a view of how federal funds are allocated across key sectors such as healthcare, defense, infrastructure, and more.
    </p>
    <!-- Category Selection Dropdown -->
    <div class="category-select">
      <select v-model.number="selectedCategory">
        <option :value="0">All Categories</option>
        <option
          v-for="cat in budgetCategories"
          :key="cat.id"
          :value="cat.id"
        >
          {{ cat.name }}
        </option>
      </select>
    </div>

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
        v-for="category in filteredBudgetCategories"
        :key="category.id"
        class="budget-category"
      >
        <h3>
          {{ category.name }} ({{ formatBudget(category.amount) }})
        </h3>
        <button
          class="toggle-description-button"
          :aria-label="'Toggle details for ' + category.name"
          @click="toggleDescription(category.id)"
        >
          {{ category.showDescription ? 'Hide Details' : 'Show Details' }}
        </button>
        <transition name="fade">
          <div
            v-if="category.showDescription"
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
import { ref, computed } from 'vue'
import { formatBudget } from '../utils.js'

// Define your constant data as a local reactive variable
const budgetCategories = ref([
  {
    id: 1,
    name: 'Healthcare',
    amount: 50000000000,
    description:
      'The federal government contributes to provincial and territorial healthcare systems through the Canada Health Transfer (CHT). This supports universal healthcare in Canada, funding hospitals, healthcare workers, and public health services like mental health programs and pandemic response measures. Healthcare represents around 12% of total federal spending.',
    showDescription: false,
  },
  {
    id: 2,
    name: 'Support for Seniors',
    amount: 63000000000,
    description:
      'A major component of the budget, driven by Canada’s aging population. This supports programs like Old Age Security (OAS) and the Guaranteed Income Supplement (GIS), which ensure basic income for seniors. These programs account for around 15% of total federal spending.',
    showDescription: false,
  },
  {
    id: 3,
    name: 'Children and Families',
    amount: 28000000000,
    description:
      'The Canada Child Benefit (CCB) offers income support to low- and middle-income families to help cover the costs of raising children. This benefit plays a crucial role in reducing child poverty and represents about 7% of federal spending.',
    showDescription: false,
  },
  {
    id: 4,
    name: 'Indigenous Services and Reconciliation',
    amount: 26000000000,
    description:
      'This allocation supports Indigenous services, including clean drinking water, housing, healthcare, and educational programs for Indigenous communities. It also funds reconciliation efforts, including land claim settlements and reparations for past injustices. Indigenous services represent around 6% of the total federal budget.',
    showDescription: false,
  },
  {
    id: 5,
    name: 'Employment Insurance and Other Benefits',
    amount: 30000000000,
    description:
      'Funding for Employment Insurance (EI), providing income support to temporarily unemployed workers, new parents, and seasonal employees. This category also includes retraining and skill development programs, making up around 7% of federal spending.',
    showDescription: false,
  },
  {
    id: 6,
    name: 'Defense and Public Safety',
    amount: 35000000000,
    description:
      "Covers spending on the Canadian Armed Forces, military procurement (e.g., ships, aircraft), and public safety programs like border security and cybersecurity. It reflects Canada's geopolitical concerns and military commitments, representing about 8% of the total budget.",
    showDescription: false,
  },
  {
    id: 7,
    name: 'Debt Servicing',
    amount: 44000000000,
    description:
      'Payments for the interest on Canada’s national debt, which totaled $1.173 trillion by the end of the fiscal year. The rising cost of debt servicing reflects increasing interest rates, making up around 11% of total spending.',
    showDescription: false,
  },
  {
    id: 8,
    name: 'Public Debt Charges',
    amount: 34900000000,
    description:
      'Interest payments on public debt ensure that federal borrowing from previous years is properly managed. This is a non-discretionary part of the budget and represents around 8% of total federal spending.',
    showDescription: false,
  },
  {
    id: 9,
    name: 'Loans, Investments, and Advances',
    amount: 100000000000,
    description:
      'This category can be broken down into various subsections, covering different sectors and financial assistance programs.',
    showDescription: false,
    subsections: [
      {
        id: '9.1',
        name: 'Student Loans',
        amount: 24000000000,
        description:
          'The Canada Student Financial Assistance Program provides student loans to make post-secondary education more accessible. The government helps students manage educational costs, and these loans often come with favorable repayment terms. While total loans exceed $24 billion, annual allocations reflect the government’s commitment to improving education access.',
      },
      {
        id: '9.2',
        name: 'Agriculture Loans',
        amount: 162000000,
        description:
          'Through programs like the Agri-Recovery Program, the government provides loans to farmers affected by disasters. This support helps stabilize the agricultural sector, especially in the wake of unforeseen events like natural disasters, droughts, or market disruptions.',
      },
      {
        id: '9.3',
        name: 'International Development and Loans',
        amount: 53000000000,
        description:
          'Canada contributes significantly to international development through loans and grants to various global organizations and developing countries. This includes:\n• Asian Infrastructure Investment Bank (AIIB): Canada’s subscription to AIIB amounts to $995.4 million USD, with $199.1 million USD in paid-in capital.\n• European Bank for Reconstruction and Development (EBRD): Canada has subscribed to 1.02 billion EUR in the EBRD, with about 21% paid in.\n• World Bank and International Development Association (IDA): Canada has subscribed to $8.5 billion USD in the World Bank and has committed $14.7 billion CAD to the International Development Association (IDA), supporting development projects in low-income countries.\nThis funding supports global development, infrastructure projects, and poverty reduction in developing nations.',
      },
      {
        id: '9.4',
        name: 'Business and Innovation Loans',
        amount: 600000000,
        description:
          'The government provides financial backing to innovation and infrastructure projects through loans and investments in Canadian businesses. For instance, funding through the Universal Broadband Fund and investments in companies like Telesat support technological advancements and economic growth.',
      },
      {
        id: '9.5',
        name: 'Defense Sector Loans and Investments',
        amount: 473249317,
        description:
          "Loans and financial advances in the defense sector support the procurement of military equipment and technology. This investment is crucial for maintaining and upgrading Canada's defense capabilities in line with modern standards and commitments.",
      },
      {
        id: '9.6',
        name: 'Economic Development Loans – Miscellaneous',
        amount: 3688695017,
        description:
          'These loans and advances support various economic development projects across Canada, including regional development programs, small business loans, and investments in innovation. Specific examples include funding for Natural Products Canada and Pratt & Whitney Canada Corp, contributing to industrial growth.',
      },
    ],
  },
  {
    id: 10,
    name: 'Government Operations',
    amount: 100000000000,
    description:
      'This category includes the operational spending necessary to maintain the day-to-day functions of the federal government. It can be broken down into several specific subsections.',
    showDescription: false,
    subsections: [
      {
        id: '10.1',
        name: 'Transportation Infrastructure',
        amount: 15000000000,
        description:
          'This covers investments in national transportation infrastructure, including roadways, bridges, ports, and rail systems. It supports trade routes, safe transportation, and infrastructure expansion, ensuring efficient mobility for goods and people.',
      },
      {
        id: '10.2',
        name: 'Environmental Programs',
        amount: 8000000000,
        description:
          'Funds dedicated to climate change initiatives, conservation efforts, and environmental protection. This includes clean energy programs, nature conservation, and efforts to reduce greenhouse gas emissions in line with international commitments.',
      },
      {
        id: '10.3',
        name: 'Public Safety and Emergency Preparedness',
        amount: 9000000000,
        description:
          'This includes funding for national security agencies like the RCMP and Canada Border Services Agency (CBSA). It ensures Canada’s ability to respond to emergencies, disasters, and public safety threats.',
      },
      {
        id: '10.4',
        name: 'Government Buildings and Properties',
        amount: 7000000000,
        description:
          'The maintenance, repair, and construction of government buildings, federal offices, military bases, and parliamentary buildings fall under this category. These properties support essential government services and public sector functions.',
      },
      {
        id: '10.5',
        name: 'Research and Innovation',
        amount: 10000000000,
        description:
          'Investments in research and development across various sectors, including healthcare, aerospace, and technology. Funding goes to programs like the Innovation Superclusters and partnerships with universities, contributing to scientific and technological advances.',
      },
      {
        id: '10.6',
        name: 'Digital Government and IT Infrastructure',
        amount: 5000000000,
        description:
          'This investment modernizes federal government digital services and IT infrastructure. It enhances cybersecurity, improves digital public services (e.g., tax filing, immigration services), and strengthens inter-departmental communications.',
      },
      {
        id: '10.7',
        name: 'Federal Employee Salaries and Benefits',
        amount: 35000000000,
        description:
          'This category funds the salaries, pensions, and benefits of over 300,000 federal employees, including civil servants and military personnel, ensuring the government operates smoothly across departments and agencies.',
      },
      {
        id: '10.8',
        name: 'Legal and Justice System',
        amount: 5000000000,
        description:
          'Supports the functioning of the national legal and justice system, including federal courts, legal aid, and justice reform programs. The Department of Justice Canada ensures access to justice for all Canadians.',
      },
      {
        id: '10.9',
        name: 'Indigenous Services Operational Expenses',
        amount: 4000000000,
        description:
          'Operational costs for Indigenous Services Canada, which oversees the administration of programs such as healthcare, education, and infrastructure for Indigenous communities.',
      },
      {
        id: '10.10',
        name: 'Cultural and Heritage Programs',
        amount: 2000000000,
        description:
          'Funding for national cultural institutions like the Canada Council for the Arts, Canadian Broadcasting Corporation (CBC), and National Film Board. This category supports Canada’s arts, culture, and heritage preservation efforts.',
      },
      {
        id: '10.11',
        name: 'Scientific Research and Development (R&D)',
        amount: 5000000000,
        description:
          'Funding for scientific research, including agriculture, biotechnology, healthcare, and environmental sustainability. The government supports research through agencies like the National Research Council (NRC).',
      },
      {
        id: '10.12',
        name: 'Diplomatic and International Representation',
        amount: 5000000000,
        description:
          'This covers the operational costs of Global Affairs Canada, including embassies, consulates, and diplomatic missions. It supports Canada’s global diplomatic presence and international relations.',
      },
    ],
  },
])

// Reactive state for selected category (0 means "All Categories")
const selectedCategory = ref(0)

// Computed property to filter budget categories based on the selected category
const filteredBudgetCategories = computed(() => {
  if (selectedCategory.value === 0) {
    return budgetCategories.value
  }
  return budgetCategories.value.filter(category => category.id === selectedCategory.value)
})

// Local state for "Expand All" functionality
const allExpanded = ref(false)

// Toggle a single category's details
function toggleDescription(id) {
  const category = budgetCategories.value.find(cat => cat.id === id)
  if (category) {
    category.showDescription = !category.showDescription
  }
}

// Toggle all categories' details
function toggleAll() {
  allExpanded.value = !allExpanded.value
  budgetCategories.value.forEach(cat => {
    cat.showDescription = allExpanded.value
  })
}
</script>

<style scoped>
.budget-categories-section {
  margin: 40px auto;
  padding: 20px;
  background: #fff;
}
.section-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}
.category-select {
  margin-bottom: 20px;
  text-align: center;
}
.category-select select {
  font-size: 16px;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.budget-action-buttons {
  text-align: center;
  margin-bottom: 20px;
}
.toggle-all-button {
  padding: 8px 16px;
  background-color: #153bb8;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.budget-categories {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.budget-category {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
}
.toggle-description-button {
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #076b25;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.category-description {
  margin-top: 15px;
  padding-left: 20px;
  border-left: 3px solid #bdc3c7;
}
.subsection {
  margin-top: 10px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>




