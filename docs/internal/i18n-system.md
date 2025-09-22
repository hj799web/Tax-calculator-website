# i18n System Documentation

## Overview

The application uses a custom, dependency-free internationalization (i18n) system that replaces vue-i18n to eliminate external dependencies while maintaining full functionality.

## Architecture

### Local i18n Module (`src/i18n/index.js`)

The i18n system is implemented as a lightweight utility that provides:

- **useI18n() Hook**: Returns `{ t, locale }` for component usage
- **Plugin Interface**: Compatible with `app.use(i18n)` for Vue app integration
- **LocalStorage Integration**: Persists locale selection across browser sessions
- **Parameter Interpolation**: Supports `{param}` syntax for dynamic content
- **Fallback System**: Falls back to English if translation key not found

### Core Implementation

```javascript
// Local i18n implementation
export function useI18n() {
  return {
    t: (key, params = {}) => {
      const message = getMessage(key, currentLocale.value);
      return interpolate(message, params);
    },
    locale: currentLocale
  };
}

// Plugin interface for Vue app
export default {
  install(app) {
    app.config.globalProperties.$t = (key, params) => t(key, params);
    app.provide('i18n', { t, locale: currentLocale });
  }
};
```

## Features

### 1. Dependency-Free Design
- **No External Dependencies**: Eliminates vue-i18n dependency
- **Lightweight**: Minimal bundle size impact
- **Self-Contained**: All functionality built-in

### 2. LocalStorage Integration
```javascript
// Locale persistence
const getStoredLocale = () => {
  return localStorage.getItem('app-locale') || 'en';
};

const setStoredLocale = (locale) => {
  localStorage.setItem('app-locale', locale);
  currentLocale.value = locale;
};
```

### 3. Parameter Interpolation
```javascript
// Translation with parameters
const message = t('simulator.description.intro', { 
  year: 2024, 
  country: 'Canada' 
});
// Result: "Experience fiscal planning in Canada for 2024"
```

### 4. Fallback System
```javascript
// Key lookup with fallback
const getMessage = (key, locale) => {
  const messages = translations[locale] || translations.en;
  return getNestedProperty(messages, key) || key;
};
```

### 5. Mojibake Fix
```javascript
// Special handling for French language labels
if (locale === 'fr') {
  messages.fr.home.language.french = 'Français';
}
```

## Translation Structure

### English (EN) Translations (`src/i18n/en.json`)
```json
{
  "simulator": {
    "header": {
      "title": "Budget Simulator",
      "subtitle": "Experience fiscal planning"
    },
    "nav": {
      "overview": "Overview",
      "results": "Results",
      "revenue": "Revenue",
      "spending": "Spending",
      "analysis": "Analysis",
      "sentiment": "Sentiment",
      "export": "Export"
    },
    "sections": {
      "revenue": {
        "title": "Revenue Sources",
        "description": "Adjust tax rates and revenue sources"
      },
      "spending": {
        "title": "Spending Categories",
        "description": "Allocate government spending"
      }
    },
    "description": {
      "intro": "Experience what it's like to manage Canada's federal budget",
      "disclaimer": "The Budget Simulator uses approximate federal budget data from Public Accounts of Canada and Budget 2024 documents."
    },
    "chaosWarning": "Fiscal chaos detected! Your budget changes have created unsustainable conditions."
  }
}
```

### French (FR) Translations (`src/i18n/fr.json`)
```json
{
  "simulator": {
    "header": {
      "title": "Simulateur Budgétaire",
      "subtitle": "Découvrez la planification fiscale"
    },
    "nav": {
      "overview": "Aperçu",
      "results": "Résultats",
      "revenue": "Revenus",
      "spending": "Dépenses",
      "analysis": "Analyse",
      "sentiment": "Sentiment",
      "export": "Exportation"
    },
    "sections": {
      "revenue": {
        "title": "Sources de Revenus",
        "description": "Ajustez les taux d'imposition et les sources de revenus"
      },
      "spending": {
        "title": "Catégories de Dépenses",
        "description": "Allouez les dépenses gouvernementales"
      }
    },
    "description": {
      "intro": "Découvrez ce que c'est que de gérer le budget fédéral du Canada",
      "disclaimer": "Le Simulateur Budgétaire utilise des données budgétaires fédérales approximatives des Comptes publics du Canada et des documents du Budget 2024."
    },
    "chaosWarning": "Chaos fiscal détecté ! Vos changements budgétaires ont créé des conditions non durables."
  }
}
```

## Component Integration

### Basic Usage
```vue
<template>
  <div>
    <h1>{% raw %}{{ t('simulator.header.title') }}{% endraw %}</h1>
    <p>{% raw %}{{ t('simulator.description.intro') }}{% endraw %}</p>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n'

const { t, locale } = useI18n()
</script>
```

### With Parameters
```vue
<template>
  <div>
    <h2>{% raw %}{{ t('simulator.sections.revenue.title') }}{% endraw %}</h2>
    <p>{% raw %}{{ t('simulator.sections.revenue.description', { year: 2024 }) }}{% endraw %}</p>
  </div>
</template>
```

### Language Switching
```vue
<template>
  <div>
    <button @click="switchLanguage('en')">English</button>
    <button @click="switchLanguage('fr')">Français</button>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n'

const { locale } = useI18n()

const switchLanguage = (newLocale) => {
  locale.value = newLocale
}
</script>
```

## ESLint Configuration

### Per-File Disable
Components using the i18n system include ESLint disable comments:

```javascript
/* eslint-disable */
import { useI18n } from '@/i18n'
// ... rest of component
```

### Files with ESLint Disable
- `src/App.vue`
- `src/components/MainNavigation.vue`
- `src/views/CalculatorView.vue`
- `src/views/FinanceMinisterSimulator.vue`
- `src/domains/calculator/components/RegionSelector.vue`
- `src/i18n/index.js`

## Migration from vue-i18n

### Before (vue-i18n)
```javascript
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
```

### After (Local i18n)
```javascript
import { useI18n } from '@/i18n'

const { t } = useI18n()
```

### Benefits of Migration
- **Reduced Bundle Size**: Eliminates vue-i18n dependency
- **Simplified Maintenance**: No external dependency updates
- **Custom Features**: Mojibake fix and custom fallback logic
- **Better Performance**: Lightweight implementation

## Testing

### Manual Testing Checklist
- [ ] Language switcher updates all text
- [ ] Locale persists across page reloads
- [ ] Parameter interpolation works correctly
- [ ] Fallback to EN works for missing keys
- [ ] French labels display correctly (no mojibake)
- [ ] ESLint errors are suppressed

### Automated Testing
```javascript
// Example test for i18n functionality
test('translates text correctly', () => {
  const { t } = useI18n()
  
  expect(t('simulator.header.title')).toBe('Budget Simulator')
  expect(t('simulator.header.title', 'fr')).toBe('Simulateur Budgétaire')
})

test('interpolates parameters', () => {
  const { t } = useI18n()
  
  const result = t('simulator.description.intro', { year: 2024 })
  expect(result).toContain('2024')
})
```

## Future Enhancements

### Potential Improvements
1. **Pluralization Support**: Add plural form handling
2. **Date/Number Formatting**: Locale-specific formatting
3. **RTL Support**: Right-to-left language support
4. **Translation Management**: External translation service integration
5. **Lazy Loading**: Load translations on demand

### Maintenance
- **Regular Updates**: Keep translation keys in sync
- **Quality Assurance**: Review translations for accuracy
- **Performance Monitoring**: Track i18n system performance
- **User Feedback**: Collect feedback on translation quality

## Related Documentation

- [CHANGELOG](CHANGELOG.md) - i18n refactoring entry
- [Architecture Overview](ARCHITECTURE.md) - i18n system integration
- [Component Guide](tabs-component-guide.md) - i18n usage in components

