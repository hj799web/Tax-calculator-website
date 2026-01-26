<template> 
  <section class="budget-categories-section">
    <h2 class="section-title">
      {{ translate('budgetCategories.title', 'Budget Categories') }}
    </h2>
    <!-- Category Selection Dropdown -->
    <div class="category-select">
      <select v-model.number="selectedCategory">
        <option :value="0">
          {{ translate('budgetCategories.select.all', 'All Categories') }}
        </option>
        <option
          v-for="cat in currentBudgetCategories"
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
        :aria-label="t('budgetCategories.actions.toggleAll.ariaLabel', 'Toggle all budget category details')"
        @click="toggleAll"
      >
        {{ allExpanded ? translate('budgetCategories.actions.toggleAll.collapse', 'Hide All') : translate('budgetCategories.actions.toggleAll.expand', 'Expand All') }}
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
          {{ category.name }} ({{ formatCurrency(category.amount) }})
        </h3>
        <button
          class="toggle-description-button"
          :aria-label="translate('budgetCategories.aria.toggleCategory', 'Toggle details for {name}', { name: category.name })"
          @click="toggleDescription(category.id)"
        >
          {{ category.showDescription ? translate('budgetCategories.actions.toggleDetails.hide', 'Hide Details') : translate('budgetCategories.actions.toggleDetails.show', 'Show Details') }}
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
                  {{ sub.name }} – {{ formatCurrency(sub.amount) }}
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
import { ref, computed, watch } from 'vue'
import { formatCurrency } from '@/domains/calculator/utils/chartUtils.js'
import { useYearStore } from '@/domains/calculator/store/year.js'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const translate = (key, fallback = '', params) => {
  const value = t(key, params)
  return value === key ? fallback : value
}

// Get the year store
const yearStore = useYearStore()

// Define your budget data for 2022-2023
const budgetCategories20222023 = ref([
  {
    id: 1,
    name: translate('budgetCategories.y2022.healthcare.name', 'Healthcare'),
    amount: 58200000000,
    description: translate('budgetCategories.y2022.healthcare.description', "The federal government contributes to provincial and territorial healthcare systems through the Canada Health Transfer (CHT). This funding is used to support hospitals, healthcare workers, and ensure access to medical services. The 2022-2023 federal spending on healthcare was $58.2 billion, representing approximately 10% of total federal spending."),
    showDescription: false,
  },
  {
    id: 2,
    name: translate('budgetCategories.y2022.supportForSeniors.name', 'Support for Seniors'),
    amount: 69100000000,
    description: translate('budgetCategories.y2022.supportForSeniors.description', "Programs like Old Age Security (OAS) and the Guaranteed Income Supplement (GIS) ensure basic income for seniors. This is a major component of the budget, driven by Canada's aging population. In 2022-2023, the federal government spent $69.1 billion on senior support programs."),
    showDescription: false,
  },
  {
    id: 3,
    name: translate('budgetCategories.y2022.childrenAndFamilies.name', 'Children and Families'),
    amount: 26900000000,
    description: translate('budgetCategories.y2022.childrenAndFamilies.description', "The Canada Child Benefit (CCB) provides tax-free monthly payments to eligible families to help with the cost of raising children. This category also includes childcare initiatives and family support programs. Total spending in this area was $26.9 billion."),
    showDescription: false,
  },
  {
    id: 4,
    name: translate('budgetCategories.y2022.indigenousServices.name', 'Indigenous Services'),
    amount: 39800000000,
    description: translate('budgetCategories.y2022.indigenousServices.description', "This allocation supports Indigenous services, including clean drinking water, housing, healthcare, and educational programs for Indigenous communities. It also funds reconciliation efforts, including land claim settlements. The federal government spent $39.8 billion in this area."),
    showDescription: false,
  },
  {
    id: 5,
    name: translate('budgetCategories.y2022.employmentInsuranceAndBenefits.name', 'Employment Insurance and Benefits'),
    amount: 35600000000,
    description: translate('budgetCategories.y2022.employmentInsuranceAndBenefits.description', "Employment Insurance (EI) provides temporary financial assistance to unemployed Canadians while they look for work or upgrade their skills. This category also includes worker training and skill development programs. Total spending was $35.6 billion."),
    showDescription: false,
  },
  {
    id: 6,
    name: translate('budgetCategories.y2022.defense.name', 'Defense'),
    amount: 36400000000,
    description: translate('budgetCategories.y2022.defense.description', "Covers spending on the Canadian Armed Forces, military procurement (ships, aircraft, vehicles), and defense operations. The 2022-2023 federal budget allocated $36.4 billion to national defense."),
    showDescription: false,
  },
  {
    id: 7,
    name: translate('budgetCategories.y2022.publicSafetyAndEmergencyPreparedness.name', 'Public Safety and Emergency Preparedness'),
    amount: 11600000000,
    description: translate('budgetCategories.y2022.publicSafetyAndEmergencyPreparedness.description', "This category funds police services, border security, correctional services, and emergency preparedness. It includes agencies like the RCMP and Canada Border Services Agency. Total spending was $11.6 billion."),
    showDescription: false,
  },
  {
    id: 8,
    name: translate('budgetCategories.y2022.internationalAffairsAndDevelopment.name', 'International Affairs and Development'),
    amount: 9800000000,
    description: translate('budgetCategories.y2022.internationalAffairsAndDevelopment.description', "Includes foreign aid, diplomatic missions, and contributions to international organizations. Canada's international development assistance and global engagement initiatives totaled $9.8 billion."),
    showDescription: false,
  },
  {
    id: 9,
    name: translate('budgetCategories.y2022.publicDebtCharges.name', 'Public Debt Charges'),
    amount: 42700000000,
    description: translate('budgetCategories.y2022.publicDebtCharges.description', "Interest payments on the federal government's debt. As interest rates rose in 2022-2023, debt servicing costs increased to $42.7 billion."),
    showDescription: false,
  },
  {
    id: 10,
    name: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.name', 'Loans, Investments, and Advances'),
    amount: 10000000000,
    description: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.description', "This category represents various financial assistance programs totaling $10 billion, supporting different sectors of the economy. The $10 billion listed under \"Loans, Investments, and Advances\" represents the actual expenditures and disbursements made during the 2022–2023 fiscal year, not the total value of all loan programs. While programs like student loans or international development commitments have large multi-year portfolios—such as $24 billion in outstanding student loans or $53 billion in total international development subscriptions—only the amounts spent or issued in that specific fiscal year are recorded in the annual budget. This distinction ensures the budget reflects yearly cash flows rather than long-term financial obligations."),
    showDescription: false,
    subsections: [
      {
        id: '10.1',
        name: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.subsections.studentLoans.name', 'Student Loans'),
        amount: 24000000000,
        description: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.subsections.studentLoans.description', "The Canada Student Financial Assistance Program provides loans to enhance access to post-secondary education. While the total loan portfolio exceeds $24 billion, annual allocations reflect the government's commitment to supporting students.")
      },
      {
        id: '10.2',
        name: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.subsections.agricultureLoans.name', 'Agriculture Loans'),
        amount: 162000000,
        description: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.subsections.agricultureLoans.description', "The Agri-Recovery Program helps farmers affected by disasters. This support helps stabilize the agricultural sector, especially during unforeseen events like natural disasters.")
      },
      {
        id: '10.3',
        name: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.subsections.internationalDevelopmentLoans.name', 'International Development Loans'),
        amount: 53000000000,
        description: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.subsections.internationalDevelopmentLoans.description', "Canada contributes to global development through loans and grants to international organizations and developing countries, including commitments to the Asian Infrastructure Investment Bank (AIIB), European Bank for Reconstruction and Development (EBRD), and the World Bank.")
      },
      {
        id: '10.4',
        name: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.subsections.businessAndInnovationLoans.name', 'Business and Innovation Loans'),
        amount: 600000000,
        description: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.subsections.businessAndInnovationLoans.description', "The government provides financial backing to innovation and infrastructure projects, including funding for broadband development and investments in Canadian businesses.")
      },
      {
        id: '10.5',
        name: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.subsections.defenseSectorLoansAndInvestments.name', 'Defense Sector Loans and Investments'),
        amount: 473249317,
        description: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.subsections.defenseSectorLoansAndInvestments.description', "Loans and advances to the defense sector support the procurement of military equipment and technology, maintaining and upgrading Canada's defense capabilities.")
      },
      {
        id: '10.6',
        name: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.subsections.economicDevelopmentLoans.name', 'Economic Development Loans'),
        amount: 3688695017,
        description: translate('budgetCategories.y2022.loansInvestmentsAndAdvances.subsections.economicDevelopmentLoans.description', "These loans support various economic development projects across Canada, including regional development programs and small business investments. For example, Canada Economic Development for Quebec Regions (CED) invested $481.6 million in 1,325 projects and contributed projects supporting regional economic growth.")
      }
    ]
  },
  {
    id: 11,
    name: translate('budgetCategories.y2022.otherGovernmentOperations.name', 'Other Government Operations'),
    amount: 242000000000,
    description: translate('budgetCategories.y2022.otherGovernmentOperations.description', "This category includes operational expenses necessary for the federal government's day-to-day functioning, totaling $242 billion."),
    showDescription: false,
    subsections: [
      {
        id: '11.1',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.transportationInfrastructure.name', 'Transportation Infrastructure'),
        amount: 15000000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.transportationInfrastructure.description', "Investments in national transportation infrastructure, including roadways, bridges, ports, and rail systems. This supports trade routes and infrastructure expansion.")
      },
      {
        id: '11.2',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.publicSafetyAndEmergencyPreparedness.name', 'Public Safety and Emergency Preparedness'),
        amount: 9000000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.publicSafetyAndEmergencyPreparedness.description', "Funding for police services and emergency response enhances Canada's ability to respond to emergencies, disasters, and public safety threats.")
      },
      {
        id: '11.3',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.governmentBuildingsAndProperties.name', 'Government Buildings and Properties'),
        amount: 7000000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.governmentBuildingsAndProperties.description', "Maintenance and construction of government buildings supports essential services and public sector functions.")
      },
      {
        id: '11.4',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.federalEmployeeSalariesAndBenefits.name', 'Federal Employee Salaries and Benefits'),
        amount: 35000000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.federalEmployeeSalariesAndBenefits.description', "Funds the salaries, pensions, and benefits of federal employees, ensuring the government operates smoothly across departments.")
      },
      {
        id: '11.5',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.legalAndJusticeSystem.name', 'Legal and Justice System'),
        amount: 5000000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.legalAndJusticeSystem.description', "Supports the functioning of the national legal and justice system, ensuring access to justice for all Canadians.")
      },
      {
        id: '11.6',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.indigenousServicesOperationalExpenses.name', 'Indigenous Services Operational Expenses'),
        amount: 4000000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.indigenousServicesOperationalExpenses.description', "Covers operational costs for Indigenous Services Canada, overseeing programs for Indigenous communities.")
      },
      {
        id: '11.7',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.culturalAndHeritagePrograms.name', 'Cultural and Heritage Programs'),
        amount: 2000000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.culturalAndHeritagePrograms.description', "Funding for national cultural institutions supports Canada's arts, culture, and heritage preservation efforts.")
      },
      {
        id: '11.8',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.diplomaticAndInternationalRepresentation.name', 'Diplomatic and International Representation'),
        amount: 5000000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.diplomaticAndInternationalRepresentation.description', "Covers operational costs of Global Affairs Canada, including embassies, consulates, and diplomatic missions, supporting Canada's global diplomatic presence and international relations.")
      },
      {
        id: '11.9',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.internationalFinancialCommitments.name', 'International Financial Commitments'),
        amount: 5000000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.internationalFinancialCommitments.description', "Supports Canada's international obligations, including contributions to international institutions. These funds help support global development, financial stability, and multilateral cooperation.")
      },
      {
        id: '11.10',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.environmentAndClimateChange.name', 'Environment and Climate Change'),
        amount: 8400000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.environmentAndClimateChange.description', "Funds environmental protection, conservation efforts, and climate action initiatives. This includes programs to reduce greenhouse gas emissions and protect biodiversity.")
      },
      {
        id: '11.11',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.agricultureAndAgriFood.name', 'Agriculture and Agri-Food'),
        amount: 3100000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.agricultureAndAgriFood.description', "Supports farmers, agricultural research, food safety, and market development. This includes programs like the Agricultural Policy Framework and various risk management tools.")
      },
      {
        id: '11.12',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.scienceInnovationAndTechnology.name', 'Science, Innovation and Technology'),
        amount: 15400000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.scienceInnovationAndTechnology.description', "Funds scientific research, innovation programs, and technology development across Canada. This includes support for universities, research institutions, and commercial innovation.")
      },
      {
        id: '11.13',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.economicDevelopmentPrograms.name', 'Economic Development Programs'),
        amount: 18600000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.economicDevelopmentPrograms.description', "Supports regional economic growth initiatives, innovation efforts, and business development. This includes programs to enhance productivity and competitiveness.")
      },
      {
        id: '11.14',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.infrastructureInvestments.name', 'Infrastructure Investments'),
        amount: 23100000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.infrastructureInvestments.description', "Supports investments in public infrastructure, including roads, bridges, public transit, green infrastructure, and community facilities.")
      },
      {
        id: '11.15',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.immigrationRefugeesAndCitizenship.name', 'Immigration, Refugees and Citizenship'),
        amount: 5400000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.immigrationRefugeesAndCitizenship.description', "Supports Canada's immigration system, refugee resettlement programs, and citizenship services.")
      },
      {
        id: '11.16',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.generalPublicServices.name', 'General Public Services'),
        amount: 40000000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.generalPublicServices.description', "This encompasses expenditures related to the overall administration of the government, including legislative bodies, executive offices, financial and fiscal affairs, external affairs, and foreign economic aid. According to Statistics Canada, spending on general public services was a significant portion of government expenditures in 2022–2023.")
      },
      {
        id: '11.17',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.socialProtectionPrograms.name', 'Social Protection Programs'),
        amount: 30000000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.socialProtectionPrograms.description', "This includes programs such as social exclusion initiatives, disability payments, and unemployment benefits. Notably, in 2023, there was a significant increase in spending on social protection, making it the highest spending category by function, accounting for 26.4% of total spending.")
      },
      {
        id: '11.18',
        name: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.economicAffairs.name', 'Economic Affairs'),
        amount: 12000000000,
        description: translate('budgetCategories.y2022.otherGovernmentOperations.subsections.economicAffairs.description', "This covers expenditures related to general economic, commercial, and labor affairs, including subsidies and support to specific industries, trade, and labor market programs. In 2022–2023, spending on economic affairs experienced a notable decrease, reflecting changes in government priorities.")
      }
    ]
  }
])

// Define your budget data for 2024
const budgetCategories2024 = ref([
  {
    id: 1,
    name: translate('budgetCategories.y2024.healthcareCanadaHealthTransfer.name', 'Healthcare (Canada Health Transfer)'),
    amount: 50400000000, // $50.4 billion
    description: translate('budgetCategories.y2024.healthcareCanadaHealthTransfer.description', "The federal government supports provincial and territorial healthcare systems through the Canada Health Transfer (CHT). This funding assists in delivering universal healthcare, including hospitals, healthcare professionals, and public health initiatives. Healthcare expenditures represent approximately 10% of total federal spending."),
    showDescription: false,
  },
  {
    id: 2,
    name: translate('budgetCategories.y2024.supportForSeniors.name', 'Support for Seniors'),
    amount: 76000000000, // $76.0 billion
    description: translate('budgetCategories.y2024.supportForSeniors.description', "This allocation funds programs like Old Age Security (OAS) and the Guaranteed Income Supplement (GIS), providing basic income support to seniors. Driven by Canada's aging population, these programs account for around 14% of total federal spending."),
    showDescription: false,
  },
  {
    id: 3,
    name: translate('budgetCategories.y2024.childrenAndFamilies.name', 'Children and Families'),
    amount: 26300000000, // $26.3 billion
    description: translate('budgetCategories.y2024.childrenAndFamilies.description', "The Canada Child Benefit (CCB) offers income support to low- and middle-income families to assist with child-rearing costs. This initiative plays a crucial role in reducing child poverty and constitutes about 6% of federal spending."),
    showDescription: false,
  },
  {
    id: 4,
    name: translate('budgetCategories.y2024.indigenousServicesAndReconciliation.name', 'Indigenous Services and Reconciliation'),
    amount: 35500000000, // $35.5 billion
    description: translate('budgetCategories.y2024.indigenousServicesAndReconciliation.description', "This funding supports Indigenous communities through initiatives in healthcare, education, infrastructure, and reconciliation efforts, including land claim settlements. Indigenous services represent around 7% of the total federal budget."),
    showDescription: false,
  },
  {
    id: 5,
    name: translate('budgetCategories.y2024.employmentInsuranceAndOtherBenefits.name', 'Employment Insurance and Other Benefits'),
    amount: 23100000000, // $23.1 billion
    description: translate('budgetCategories.y2024.employmentInsuranceAndOtherBenefits.description', "Funding for Employment Insurance (EI) provides income support to temporarily unemployed workers, new parents, and seasonal employees. This category also includes retraining and skill development programs, making up around 5% of federal spending."),
    showDescription: false,
  },
  {
    id: 6,
    name: translate('budgetCategories.y2024.defenseAndPublicSafety.name', 'Defense and Public Safety'),
    amount: 32600000000, // $32.6 billion
    description: translate('budgetCategories.y2024.defenseAndPublicSafety.description', "Expenditures cover the Canadian Armed Forces, military procurement (e.g., ships, aircraft), and public safety programs like border security and cybersecurity. This reflects Canada's defense commitments and represents about 6% of the total budget."),
    showDescription: false,
  },
  {
    id: 7,
    name: translate('budgetCategories.y2024.debtServicingPublicDebtCharges.name', 'Debt Servicing (Public Debt Charges)'),
    amount: 47300000000, // $47.3 billion
    description: translate('budgetCategories.y2024.debtServicingPublicDebtCharges.description', "Payments for interest on Canada's national debt, which totaled $1.173 trillion by the end of the fiscal year. Rising interest rates have increased debt servicing costs, accounting for around 9% of total spending."),
    showDescription: false,
  },
  {
    id: 8,
    name: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.name', 'Loans, Investments, and Advances'),
    amount: 10000000000, // $10 billion
    description: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.description', "This category encompasses various financial assistance programs to support different sectors of the economy."),
    showDescription: false,
    subsections: [
      {
        id: '8.1',
        name: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.subsections.studentLoans.name', 'Student Loans'),
        amount: 24000000000, // Total portfolio
        description: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.subsections.studentLoans.description', "The Canada Student Financial Assistance Program provides loans to enhance access to post-secondary education. While the total loan portfolio exceeds $24 billion, annual allocations reflect the government's commitment to supporting students.")
      },
      {
        id: '8.2',
        name: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.subsections.agricultureLoans.name', 'Agriculture Loans'),
        amount: 162000000,
        description: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.subsections.agricultureLoans.description', "Programs like AgriRecovery offer loans to farmers affected by unforeseen events, stabilizing the agricultural sector.")
      },
      {
        id: '8.3',
        name: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.subsections.internationalDevelopmentAndLoans.name', 'International Development and Loans'),
        amount: 53000000000, // Total portfolio
        description: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.subsections.internationalDevelopmentAndLoans.description', "Canada contributes to global development through loans and grants to international organizations and developing countries, including commitments to the Asian Infrastructure Investment Bank (AIIB), European Bank for Reconstruction and Development (EBRD), and the World Bank.")
      },
      {
        id: '8.4',
        name: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.subsections.businessAndInnovationLoans.name', 'Business and Innovation Loans'),
        amount: 600000000,
        description: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.subsections.businessAndInnovationLoans.description', "Financial backing is provided to innovation and infrastructure projects, supporting technological advancements and economic growth.")
      },
      {
        id: '8.5',
        name: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.subsections.defenseSectorLoansAndInvestments.name', 'Defense Sector Loans and Investments'),
        amount: 1450000000,
        description: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.subsections.defenseSectorLoansAndInvestments.description', "In the 2022–2023 fiscal year, the Department of National Defence had $1.57 billion in lapsed funding, with $1.45 billion (92%) available for future defense spending. These funds support the procurement of military equipment and technology, maintaining and enhancing Canada's defense capabilities.")
      },
      {
        id: '8.6',
        name: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.subsections.economicDevelopmentLoans.name', 'Economic Development Loans'),
        amount: 491600000,
        description: translate('budgetCategories.y2024.loansInvestmentsAndAdvances.subsections.economicDevelopmentLoans.description', "These loans support various economic development projects across Canada, including regional development programs and small business loans. For instance, the Canada Economic Development for Quebec Regions (CED) invested $491.6 million in 1,325 grant and contribution projects, potentially generating total investments of $5.8 billion.")
      }
    ]
  },
  {
    id: 9,
    name: translate('budgetCategories.y2024.otherGovernmentOperations.name', 'Other Government Operations'),
    amount: 140000000000, // $140 billion
    description: translate('budgetCategories.y2024.otherGovernmentOperations.description', "This category encompasses operational spending necessary for the federal government's day-to-day functions."),
    showDescription: false,
    subsections: [
      {
        id: '9.1',
        name: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.transportationInfrastructure.name', 'Transportation Infrastructure'),
        amount: 15000000000,
        description: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.transportationInfrastructure.description', "Investments in national transportation infrastructure, including roadways, bridges, ports, and rail systems, ensure efficient mobility for goods and people.")
      },
      {
        id: '9.2',
        name: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.environmentalPrograms.name', 'Environmental Programs'),
        amount: 8000000000,
        description: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.environmentalPrograms.description', "Funds dedicated to climate change initiatives, conservation efforts, and environmental protection, aligning with international commitments.")
      },
      {
        id: '9.3',
        name: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.publicSafetyAndEmergencyPreparedness.name', 'Public Safety and Emergency Preparedness'),
        amount: 9000000000,
        description: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.publicSafetyAndEmergencyPreparedness.description', "Funding for national security agencies ensures Canada's ability to respond to emergencies and public safety threats.")
      },
      {
        id: '9.4',
        name: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.governmentBuildingsAndProperties.name', 'Government Buildings and Properties'),
        amount: 7000000000,
        description: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.governmentBuildingsAndProperties.description', "Maintenance and construction of government buildings support essential services and public sector functions.")
      },
      {
        id: '9.5',
        name: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.researchAndInnovation.name', 'Research and Innovation'),
        amount: 10000000000,
        description: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.researchAndInnovation.description', "Investments in research and development across various sectors contribute to scientific and technological advances.")
      },
      {
        id: '9.6',
        name: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.digitalGovernmentAndItInfrastructure.name', 'Digital Government and IT Infrastructure'),
        amount: 5000000000,
        description: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.digitalGovernmentAndItInfrastructure.description', "Investments modernize federal digital services and IT infrastructure, enhancing cybersecurity and public services.")
      },
      {
        id: '9.7',
        name: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.federalEmployeeSalariesAndBenefits.name', 'Federal Employee Salaries and Benefits'),
        amount: 35000000000,
        description: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.federalEmployeeSalariesAndBenefits.description', "Funds the salaries, pensions, and benefits of federal employees, ensuring smooth government operations.")
      },
      {
        id: '9.8',
        name: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.legalAndJusticeSystem.name', 'Legal and Justice System'),
        amount: 5000000000,
        description: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.legalAndJusticeSystem.description', "Supports the functioning of the national legal and justice system, ensuring access to justice for all Canadians.")
      },
      {
        id: '9.9',
        name: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.indigenousServicesOperationalExpenses.name', 'Indigenous Services Operational Expenses'),
        amount: 4000000000,
        description: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.indigenousServicesOperationalExpenses.description', "Covers operational costs for Indigenous Services Canada, overseeing programs for Indigenous communities.")
      },
      {
        id: '9.10',
        name: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.culturalAndHeritagePrograms.name', 'Cultural and Heritage Programs'),
        amount: 2000000000,
        description: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.culturalAndHeritagePrograms.description', "Funding for national cultural institutions supports Canada's arts, culture, and heritage preservation efforts.")
      },
      {
        id: '9.11',
        name: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.scientificResearchAndDevelopmentRD.name', 'Scientific Research and Development (R&D)'),
        amount: 5000000000,
        description: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.scientificResearchAndDevelopmentRD.description', "Funding for scientific research, including agriculture, biotechnology, healthcare, and environmental sustainability, supports innovation and knowledge advancement.")
      },
      {
        id: '9.12',
        name: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.diplomaticAndInternationalRepresentation.name', 'Diplomatic and International Representation'),
        amount: 5000000000,
        description: translate('budgetCategories.y2024.otherGovernmentOperations.subsections.diplomaticAndInternationalRepresentation.description', "Covers operational costs of Global Affairs Canada, including embassies, consulates, and diplomatic missions, supporting Canada's global diplomatic presence and international relations.")
      }
    ]
  }
])

// Reactive state for selected category (0 means "All Categories")
const selectedCategory = ref(0)

// Computed property to get the current budget categories based on the selected year
const currentBudgetCategories = computed(() => {
  if (yearStore.budgetYear === '2022-2023') {
    return budgetCategories20222023.value
  }
  // Default to latest projections for 2023-2024 and beyond
  return budgetCategories2024.value
})

// Computed property to filter categories based on selection
const filteredBudgetCategories = computed(() => {
  if (selectedCategory.value === 0) {
    return currentBudgetCategories.value
  }
  return currentBudgetCategories.value.filter(cat => cat.id === selectedCategory.value)
})

// Computed property to check if all categories are expanded
const allExpanded = computed(() => {
  return currentBudgetCategories.value.every(cat => cat.showDescription)
})

// Watch for changes in the selected year and reset the selected category
watch(() => yearStore.selectedTaxYear, () => {
  selectedCategory.value = 0
})

// Toggle a single category's details
function toggleDescription(id) {
  const category = currentBudgetCategories.value.find(cat => cat.id === id)
  if (category) {
    category.showDescription = !category.showDescription
  }
}

// Toggle all categories' details
function toggleAll() {
  const newState = !allExpanded.value
  currentBudgetCategories.value.forEach(cat => {
    cat.showDescription = newState
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
  font-size: clamp(1.1rem, 1.2vw + 0.9rem, 1.5rem);
  margin-bottom: 20px;
}
.category-select {
  margin-bottom: 20px;
  text-align: center;
}
.category-select select {
  font-size: clamp(0.95rem, 0.4vw + 0.9rem, 1rem);
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
  font-size: clamp(0.9rem, 0.5vw + 0.85rem, 1rem);
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
  font-size: clamp(0.9rem, 0.5vw + 0.85rem, 1rem);
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

/* Mobile refinements */
@media (max-width: 768px) {
  .budget-categories-section { padding: 16px; }
  .budget-category { padding: 12px; }
  .category-select select { width: 100%; }
}

@media (max-width: 480px) {
  .budget-categories-section { padding: 12px; }
  .budget-category { padding: 10px; }
  .category-description { padding-left: 12px; }
}
</style>
