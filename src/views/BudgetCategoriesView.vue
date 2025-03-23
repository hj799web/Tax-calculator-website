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
    amount: 58200000000,
    description:
      "The federal government contributes to provincial and territorial healthcare systems through the Canada Health Transfer (CHT). This funding is used to support hospitals, healthcare workers, and ensure access to medical services. The 2022-2023 federal spending on healthcare was $58.2 billion, representing approximately 10% of total federal spending.",
    showDescription: false,
  },
  {
    id: 2,
    name: 'Support for Seniors',
    amount: 69100000000,
    description:
      "Programs like Old Age Security (OAS) and the Guaranteed Income Supplement (GIS) ensure basic income for seniors. This is a major component of the budget, driven by Canada's aging population. In 2022-2023, the federal government spent $69.1 billion on senior support programs.",
    showDescription: false,
  },
  {
    id: 3,
    name: 'Children and Families',
    amount: 26900000000,
    description:
      "The Canada Child Benefit (CCB) provides tax-free monthly payments to eligible families to help with the cost of raising children. This category also includes childcare initiatives and family support programs. Total spending in this area was $26.9 billion.",
    showDescription: false,
  },
  {
    id: 4,
    name: 'Indigenous Services',
    amount: 39800000000,
    description:
      "This allocation supports Indigenous services, including clean drinking water, housing, healthcare, and educational programs for Indigenous communities. It also funds reconciliation efforts, including land claim settlements. The federal government spent $39.8 billion in this area.",
    showDescription: false,
  },
  {
    id: 5,
    name: 'Employment Insurance and Benefits',
    amount: 35600000000,
    description:
      "Employment Insurance (EI) provides temporary financial assistance to unemployed Canadians while they look for work or upgrade their skills. This category also includes worker training and skill development programs. Total spending was $35.6 billion.",
    showDescription: false,
  },
  {
    id: 6,
    name: 'Defense',
    amount: 36400000000,
    description:
      "Covers spending on the Canadian Armed Forces, military procurement (ships, aircraft, vehicles), and defense operations. The 2022-2023 federal budget allocated $36.4 billion to national defense.",
    showDescription: false,
  },
  {
    id: 7,
    name: 'Public Safety and Emergency Preparedness',
    amount: 11600000000,
    description:
      "This category funds police services, border security, correctional services, and emergency preparedness. It includes agencies like the RCMP and Canada Border Services Agency. Total spending was $11.6 billion.",
    showDescription: false,
  },
  {
    id: 8,
    name: 'International Affairs and Development',
    amount: 9800000000,
    description:
      "Includes foreign aid, diplomatic missions, and contributions to international organizations. Canada's international development assistance and global engagement initiatives totaled $9.8 billion.",
    showDescription: false,
  },
  {
    id: 9,
    name: 'Public Debt Charges',
    amount: 42700000000,
    description:
      "Interest payments on the federal government's debt. As interest rates rose in 2022-2023, debt servicing costs increased to $42.7 billion.",
    showDescription: false,
  },
  {
    id: 10,
    name: 'Loans, Investments, and Advances',
    amount: 10000000000,
    description:
      "This category represents various financial assistance programs totaling $10 billion, supporting different sectors of the economy. The $10 billion listed under \"Loans, Investments, and Advances\" represents the actual expenditures and disbursements made during the 2022–2023 fiscal year, not the total value of all loan programs. While programs like student loans or international development commitments have large multi-year portfolios—such as $24 billion in outstanding student loans or $53 billion in total international development subscriptions—only the amounts spent or issued in that specific fiscal year are recorded in the annual budget. This distinction ensures the budget reflects yearly cash flows rather than long-term financial obligations.",
    showDescription: false,
    subsections: [
      {
        id: '10.1',
        name: 'Student Loans',
        amount: 24000000000,
        description:
          "The Canada Student Financial Assistance Program provides loans to enhance access to post-secondary education. While the total loan portfolio exceeds $24 billion, annual allocations reflect the government's commitment to supporting students."
      },
      {
        id: '10.2',
        name: 'Agriculture Loans',
        amount: 162000000,
        description:
          "The Agri-Recovery Program helps farmers affected by disasters. This support helps stabilize the agricultural sector, especially during unforeseen events like natural disasters."
      },
      {
        id: '10.3',
        name: 'International Development Loans',
        amount: 53000000000,
        description:
          "Canada contributes to global development through loans and grants to international organizations and developing countries, including commitments to the Asian Infrastructure Investment Bank (AIIB), European Bank for Reconstruction and Development (EBRD), and the World Bank."
      },
      {
        id: '10.4',
        name: 'Business and Innovation Loans',
        amount: 600000000,
        description:
          "The government provides financial backing to innovation and infrastructure projects, including funding for broadband development and investments in Canadian businesses."
      },
      {
        id: '10.5',
        name: 'Defense Sector Loans and Investments',
        amount: 473249317,
        description:
          "Loans and advances to the defense sector support the procurement of military equipment and technology, maintaining and upgrading Canada's defense capabilities."
      },
      {
        id: '10.6',
        name: 'Economic Development Loans',
        amount: 3688695017,
        description:
          "These loans support various economic development projects across Canada, including regional development programs and small business investments. For example, Canada Economic Development for Quebec Regions (CED) invested $481.6 million in 1,325 projects and contributed projects supporting regional economic growth."
      }
    ]
  },
  {
    id: 11,
    name: 'Other Government Operations',
    amount: 242000000000,
    description:
      "This category includes operational expenses necessary for the federal government's day-to-day functioning, totaling $242 billion.",
    showDescription: false,
    subsections: [
      {
        id: '11.1',
        name: 'Transportation Infrastructure',
        amount: 15000000000,
        description:
          "Investments in national transportation infrastructure, including roadways, bridges, ports, and rail systems. This supports trade routes and infrastructure expansion."
      },
      {
        id: '11.2',
        name: 'Public Safety and Emergency Preparedness',
        amount: 9000000000,
        description:
          "Funding for police services and emergency response enhances Canada's ability to respond to emergencies, disasters, and public safety threats."
      },
      {
        id: '11.3',
        name: 'Government Buildings and Properties',
        amount: 7000000000,
        description:
          "Maintenance and construction of government buildings supports essential services and public sector functions."
      },
      {
        id: '11.4',
        name: 'Federal Employee Salaries and Benefits',
        amount: 35000000000,
        description:
          "Funds the salaries, pensions, and benefits of federal employees, ensuring the government operates smoothly across departments."
      },
      {
        id: '11.5',
        name: 'Legal and Justice System',
        amount: 5000000000,
        description:
          "Supports the functioning of the national legal and justice system, ensuring access to justice for all Canadians."
      },
      {
        id: '11.6',
        name: 'Indigenous Services Operational Expenses',
        amount: 4000000000,
        description:
          "Covers operational costs for Indigenous Services Canada, overseeing programs for Indigenous communities."
      },
      {
        id: '11.7',
        name: 'Cultural and Heritage Programs',
        amount: 2000000000,
        description:
          "Funding for national cultural institutions supports Canada's arts, culture, and heritage preservation efforts."
      },
      {
        id: '11.8',
        name: 'Diplomatic and International Representation',
        amount: 5000000000,
        description:
          "Covers operational costs of Global Affairs Canada, including embassies, consulates, and diplomatic missions, supporting Canada's global diplomatic presence and international relations."
      },
      {
        id: '11.9',
        name: 'International Financial Commitments',
        amount: 5000000000,
        description:
          "Supports Canada's international obligations, including contributions to international institutions. These funds help support global development, financial stability, and multilateral cooperation."
      },
      {
        id: '11.10',
        name: 'Environment and Climate Change',
        amount: 8400000000,
        description:
          "Funds environmental protection, conservation efforts, and climate action initiatives. This includes programs to reduce greenhouse gas emissions and protect biodiversity."
      },
      {
        id: '11.11',
        name: 'Agriculture and Agri-Food',
        amount: 3100000000,
        description:
          "Supports farmers, agricultural research, food safety, and market development. This includes programs like the Agricultural Policy Framework and various risk management tools."
      },
      {
        id: '11.12',
        name: 'Science, Innovation and Technology',
        amount: 15400000000,
        description:
          "Funds scientific research, innovation programs, and technology development across Canada. This includes support for universities, research institutions, and commercial innovation."
      },
      {
        id: '11.13',
        name: 'Economic Development Programs',
        amount: 18600000000,
        description:
          "Supports regional economic growth initiatives, innovation efforts, and business development. This includes programs to enhance productivity and competitiveness."
      },
      {
        id: '11.14',
        name: 'Infrastructure Investments',
        amount: 23100000000,
        description:
          "Supports investments in public infrastructure, including roads, bridges, public transit, green infrastructure, and community facilities."
      },
      {
        id: '11.15',
        name: 'Immigration, Refugees and Citizenship',
        amount: 5400000000,
        description:
          "Supports Canada's immigration system, refugee resettlement programs, and citizenship services."
      },
      {
        id: '11.16',
        name: 'General Public Services',
        amount: 40000000000,
        description:
          "This encompasses expenditures related to the overall administration of the government, including legislative bodies, executive offices, financial and fiscal affairs, external affairs, and foreign economic aid. According to Statistics Canada, spending on general public services was a significant portion of government expenditures in 2022–2023."
      },
      {
        id: '11.17',
        name: 'Social Protection Programs',
        amount: 30000000000,
        description:
          "This includes programs such as social exclusion initiatives, disability payments, and unemployment benefits. Notably, in 2023, there was a significant increase in spending on social protection, making it the highest spending category by function, accounting for 26.4% of total spending."
      },
      {
        id: '11.18',
        name: 'Economic Affairs',
        amount: 12000000000,
        description:
          "This covers expenditures related to general economic, commercial, and labor affairs, including subsidies and support to specific industries, trade, and labor market programs. In 2022–2023, spending on economic affairs experienced a notable decrease, reflecting changes in government priorities."
      }
    ]
  }
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
