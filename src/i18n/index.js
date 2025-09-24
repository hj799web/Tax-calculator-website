/* eslint-disable */
// Lightweight i18n utility without external dependency
import { ref } from 'vue'
import en from './en.json'
import fr from './fr.json'

const overrides = 
{
  'en': {
    'how': {
      'footer': {
        'updated': 'This documentation was last updated: May 2025',
        'contact': 'For questions or feedback, please contact:',
        'back': 'Back to Calculator'
      },
      'sections': {
        'taxProcess': {
          'steps': {
            'apply': {
              'items': {
                'rrsp': 'RRSP deductions',
                'bpa': 'Basic personal amounts',
                'dependents': 'Dependent credits',
                'childCredits': 'Child credits',
                'dividendCredits': 'Dividend tax credits'
              }
            },
            'federal': {
              'items': {
                'determineTaxable': 'Determine taxable income',
                'applyRates': 'Apply federal tax rates by bracket',
                'subtractCredits': 'Subtract applicable federal credits'
              }
            },
            'provincial': {
              'items': {
                'applyRates': 'Apply provincial or territorial tax rates',
                'subtractCredits': 'Subtract applicable provincial credits'
              }
            },
            'payroll': {
              'items': {
                'cppqpp': 'CPP or QPP: 5.7% (11.4% self employed) up to the maximum',
                'ei': 'EI: 1.63% of employment income up to the maximum'
              }
            },
            'net': {
              'items': {
                'subtractTotal': 'Subtract total tax (federal + provincial + CPP or QPP + EI) from gross income'
              }
            }
          }
        },
        'income': {
          'body': 'Different income types follow different Canadian tax rules.',
          'employment': {
            'items': {
              'taxed': 'Taxed at regular rates',
              'cppEi': 'Subject to CPP or QPP and EI premiums'
            }
          },
          'self': {
            'items': {
              'taxed': 'Taxed at regular rates',
              'bothCpp': 'Subject to both employer and employee portions of CPP or QPP',
              'noEi': 'Not subject to EI premiums unless opted in'
            }
          },
          'gains': {
            'items': {
              'halfTaxable': '50% of capital gains are taxable',
              'dateTreatment': 'Different treatment before and after June 25 2024'
            }
          },
          'dividends': {
            'items': {
              'eligible': 'Eligible dividends are grossed up by 38% with a 15.02% federal credit',
              'ineligible': 'Ineligible dividends are grossed up by 15% with a 9% federal credit'
            }
          },
          'rrsp': {
            'items': {
              'reduces': 'RRSP contributions reduce taxable income'
            }
          }
        },
        'spendingViz': {
          'body': 'See how federal spending allocates every tax dollar.',
          'federal': {
            'body': 'Federal spending includes:',
            'items': {
              'health': 'Healthcare',
              'seniors': 'Support for seniors',
              'families': 'Children and families',
              'indigenous': 'Indigenous services',
              'ei': 'Employment Insurance and benefits',
              'defense': 'Defense and public safety',
              'debtService': 'Debt servicing',
              'publicDebt': 'Public debt charges',
              'operations': 'Government operations',
              'other': 'Other categories'
            }
          },
          'visualization': {
            'body': 'Switch between data views:',
            'items': {
              'y2023': '2022-2023 historical (Public Accounts)',
              'y2024': '2023-2024 proposed (Budget 2024)',
              'y2026': '2025-2026 projected estimates'
            }
          },
          'personal': {
            'body': 'Personal tax allocation shows the share of your contribution.'
          }
        },
        'benefits': {
          'accuracy': {
            'items': {
              'upToDate': 'Up-to-date tax brackets nationwide',
              'incomeTypes': 'Handles multiple income types',
              'credits': 'Includes core deductions and credits'
            }
          },
          'planning': {
            'items': {
              'rate': 'Surface your effective tax rate',
              'periods': 'Support for annual to hourly inputs',
              'rrsp': 'Visualise RRSP contribution impact'
            }
          },
          'transparency': {
            'items': {
              'allocation': 'Show where tax dollars go',
              'priorities': 'Highlight spending priorities',
              'connection': 'Connect taxes to public services'
            }
          },
          'education': {
            'items': {
              'literacy': 'Improve financial literacy',
              'demystify': 'Demystify the tax system',
              'decisions': 'Support informed decisions'
            }
          },
          'accessibility': {
            'items': {
              'free': 'Free to use',
              'noReg': 'No registration required',
              'mobile': 'Mobile friendly',
              'export': 'Exportable PDF results'
            }
          }
        },
        'tech': {
          'items': {
            'frontend': 'Frontend framework: Vue.js',
            'state': 'State management: Pinia',
            'viz': 'Visualisation: Chart.js',
            'styling': 'Responsive CSS styling',
            'validation': 'Form validation utilities',
            'export': 'PDF export support',
            'realtime': 'Real-time calculation engine',
            'controls': 'Custom interactive controls',
            'tooltips': 'Contextual tooltips',
            'autobalance': 'Auto balance algorithms'
          }
        },
        'data': {
          'body': 'Based on trusted Canadian fiscal data.',
          'items': {
            'rates': 'Tax rates and brackets: CRA and provincial agencies',
            'publicAccounts': 'Budget allocation: Public Accounts of Canada',
            'budget2024': 'Budget 2024 documentation'
          },
          'note': 'Educational only; consult a professional for advice.'
        },
        'simulator': {
          'body': 'Explore fiscal trade-offs with the Budget Simulator.',
          'features': {
            'items': {
              'controls': 'Interactive spending controls',
              'realtime': 'Real-time deficit or surplus updates',
              'viz': 'Visual budget impact charts',
              'autobalance': 'Auto-balance revenue option',
              'tooltips': 'Detailed tooltips per control'
            }
          },
          'mainCats': {
            'items': {
              'social': 'Social programs',
              'economic': 'Economic development',
              'security': 'Defense and security',
              'environment': 'Environmental protection',
              'international': 'International affairs'
            }
          },
          'howTo': {
            'items': {
              'adjust': 'Adjust sliders for each category',
              'monitor': 'Watch totals update instantly',
              'autobalance': 'Use auto balance to steady budgets',
              'details': 'Open info icons for context',
              'export': 'Export or share your plan'
            }
          },
          'results': {
            'items': {
              'totalRevenue': 'Total revenue: sum of all sources',
              'totalSpending': 'Total spending: combined outlays',
              'surplusDeficit': 'Surplus or deficit indicator',
              'debtToGdp': 'Debt-to-GDP ratio signal',
              'categoryImpacts': 'Category impacts: change per program'
            }
          },
          'tips': {
            'items': {
              'startSmall': 'Start with small adjustments',
              'autoBalance': 'Use auto balance for discipline',
              'watchDeficit': 'Watch deficit warnings',
              'interconnected': 'Remember categories interact',
              'reviewTooltips': 'Review tooltips for deeper context'
            }
          },
          'taxCalc': {
            'title': 'Understanding tax calculations',
            'body': 'Simplified effective rates show overall revenue change rather than exact filings.'
          },
          'personal': {
            'title': 'Personal income tax',
            'items': {
              'method': 'Average effective rates replace brackets',
              'baseRate': 'Base rate 21% (2024)',
              'baseAmount': 'Revenue change: $10B per point',
              'totalRevenue': 'Total revenue: $210B',
              'range': 'Slider range 0% to 50%',
              'credits': 'Credits and deferrals adjustable'
            }
          },
          'corporate': {
            'title': 'Corporate income tax',
            'items': {
              'method': 'Simplified rate structure',
              'baseRate': 'Base rate 15% (2024)',
              'baseAmount': 'Revenue change: $5.33B per point',
              'totalRevenue': 'Total revenue: $80B',
              'range': 'Slider range 0% to 40%',
              'expenditures': 'Corporate tax expenditures adjustable'
            }
          },
          'taxExpenditures': {
            'title': 'Tax expenditures and credits',
            'personal': {
              'title': 'Personal tax credits',
              'items': {
                'baseAmount': 'Base amount $120B gross',
                'netAmount': 'Net amount $102B after interactions',
                'impact': 'Adjust to impact personal income tax revenue'
              }
            },
            'corporate': {
              'title': 'Corporate tax expenditures',
              'items': {
                'baseAmount': 'Base amount $25B gross',
                'netAmount': 'Net amount $23.75B after interactions',
                'impact': 'Adjust to impact corporate income tax revenue'
              }
            }
          },
          'summary': 'A simplified model that emphasises overall fiscal impact rather than individual filings.'
        }
      },
      'faq': {
        'a1': 'Estimates are close but simplified and will not cover every situation.',
        'a2': 'All calculations stay in your browser; nothing is stored.',
        'a3': 'Updated yearly to follow new rates, brackets, and spending.',
        'a4': 'Designed for personal taxes, not business filings.',
        'a5': 'Spending data comes from Public Accounts and Budget 2024 documents.',
        'a6': 'Includes major credits but not every possible credit.',
        'a7': 'Shows how spending changes affect deficit, surplus, and debt-to-GDP.',
        'a8': 'Auto-balance adjusts revenue to keep the budget even.',
        'a9': 'Export your budget as a PDF with allocations and impacts.',
        'a10': 'Impact calculations are simplified; real-world interactions may differ.',
        'a11': 'Tooltips explain each category with spending levels and program notes.'
      }
    },
    'tour': {
      'steps': {
        'moreMobile': {
          'title': 'More',
          'body': 'On mobile the extra tabs live under More.'
        },
        'exportOptions': {
          'title': 'Export options',
          'body': 'Enable Include Full Breakdown then download the PDF.'
        },
        'spendingTaxExp': {
          'title': 'Tax expenditures',
          'body': 'Credits and deductions that reduce revenue.'
        },
        'spendingReset': {
          'title': 'Reset controls',
          'body': 'Each tile has a reset to baseline button.'
        },
        'resultsDeficit': {
          'title': 'Warnings',
          'body': 'Large deficits trigger a warning banner.'
        },
        'resultsDownload': {
          'title': 'Download',
          'body': 'Save charts using the download button.'
        }
      }
    },
    'simulator': {
      'yearSelector': {
        'aria': 'Fiscal year selector',
        'labels': {
          'y2024': '2023-2024'
        }
      }
    }
  },
  'fr': {
    'simulator': {
      'yearSelector': {
        'aria': 'Sélecteur d’exercice fiscal',
        'labels': {
          'y2024': '2023-2024'
        }
      }
    }
  }
}


function deepMerge(target, source) {
  if (!source) return target
  for (const key of Object.keys(source)) {
    const srcValue = source[key]
    const tgtValue = target[key]
    if (srcValue && typeof srcValue === 'object' && !Array.isArray(srcValue)) {
      target[key] = deepMerge(tgtValue && typeof tgtValue === 'object' ? tgtValue : {}, srcValue)
    } else {
      target[key] = srcValue
    }
  }
  return target
}

const messages = { en: deepMerge(en, overrides.en), fr: deepMerge(fr, overrides.fr) }

function resolveLocale() {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = window.localStorage.getItem('locale')
    if (stored && messages[stored]) return stored
  } catch (err) {
    // ignore storage errors
  }
  const browser = typeof navigator !== 'undefined' && navigator.language
    ? navigator.language.split('-')[0]
    : 'en'
  return messages[browser] ? browser : 'en'
}

const locale = ref(resolveLocale())

function setLocale(next) {
  if (messages[next]) {
    locale.value = next
    try {
      window.localStorage.setItem('locale', next)
    } catch (err) {
      // ignore storage errors
    }
  }
}

function get(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), obj)
}

function format(str, params) {
  if (!params || typeof str !== 'string') return str
  return str.replace(/\{(\w+)\}/g, (_, key) => (key in params ? String(params[key]) : `{${key}}`))
}

function translate(key, params) {
  const current = get(messages[locale.value] || {}, key)
  if (typeof current === 'string') return format(current, params)
  const fallback = get(messages.en || {}, key)
  if (typeof fallback === 'string') return format(fallback, params)
  return key
}

// Available locales configuration
const locales = [
  { code: 'en', labelKey: 'home.language.english', flag: '🇺🇸' },
  { code: 'fr', labelKey: 'home.language.french', flag: '🇫🇷' }
]

export function useI18n() {
  const t = (key, params) => translate(key, params)
  const currentLocale = locale
  return { t, locale, currentLocale, setLocale, locales }
}

// Helper function to get category name translation
export function getCategoryName(categoryId, categoryType = 'spending') {
  const key = `simulator.categories.${categoryType}.${categoryId}`;
  return translate(key) || categoryId; // fallback to ID if translation not found
}

export default {
  install(app) {
    const translateFn = (key, params) => translate(key, params)
    app.config.globalProperties.$t = translateFn
    app.config.globalProperties.t = translateFn
    app.provide('i18n-locale', locale)
    app.provide('t', translateFn)
  },
  useI18n,
  locale,
  setLocale
}
