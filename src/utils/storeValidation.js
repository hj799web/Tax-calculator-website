import { handleError } from '@/utils/errorHandler.js';

// Validation schemas for different store actions
export const validationSchemas = {
  calculator: {
    income: {
      type: 'number',
      min: 0,
      max: 1000000000,
      required: false
    },
    selectedRegion: {
      type: 'string',
      allowedValues: ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon'],
      required: true
    },
    selfEmploymentIncome: {
      type: 'number',
      min: 0,
      max: 1000000000,
      required: false
    },
    capitalGainsBeforeJune25: {
      type: 'number',
      min: 0,
      max: 1000000000,
      required: false
    },
    capitalGainsAfterJune25: {
      type: 'number',
      min: 0,
      max: 1000000000,
      required: false
    },
    eligibleDividends: {
      type: 'number',
      min: 0,
      max: 1000000000,
      required: false
    },
    ineligibleDividends: {
      type: 'number',
      min: 0,
      max: 1000000000,
      required: false
    },
    otherIncome: {
      type: 'number',
      min: 0,
      max: 1000000000,
      required: false
    },
    rrspDeduction: {
      type: 'number',
      min: 0,
      max: 29210,
      required: false
    },
    maritalStatus: {
      type: 'string',
      allowedValues: ['Single', 'Married or Common-Law', 'Separated', 'Divorced', 'Widowed'],
      required: false
    },
    numberOfDependents: {
      type: 'number',
      min: 0,
      max: 20,
      required: false
    },
    numberOfChildrenUnder18: {
      type: 'number',
      min: 0,
      max: 20,
      required: false
    },
    numberOfDependentsWithDisabilities: {
      type: 'number',
      min: 0,
      max: 20,
      required: false
    }
  },
  
  budget: {
    revenueSources: {
      type: 'object',
      properties: {
        personalIncomeTax: { type: 'number', min: 0, max: 100 },
        corporateIncomeTax: { type: 'number', min: 0, max: 100 },
        gst: { type: 'number', min: 0, max: 100 },
        exciseTaxes: { type: 'number', min: 0, max: 100 },
        carbonPricing: { type: 'number', min: 0, max: 100 },
        eiPremiums: { type: 'number', min: 0, max: 100 },
        customsDuties: { type: 'number', min: 0, max: 100 },
        crownProfits: { type: 'number', min: 0, max: 100 },
        nonTaxRevenue: { type: 'number', min: 0, max: 100 },
        resourceRoyalties: { type: 'number', min: 0, max: 100 }
      }
    },
    spendingCategories: {
      type: 'object',
      properties: {
        healthcare: { type: 'number', min: 0, max: 5 },
        education: { type: 'number', min: 0, max: 5 },
        childrenAndFamilies: { type: 'number', min: 0, max: 5 },
        supportForSeniors: { type: 'number', min: 0, max: 5 },
        indigenousServices: { type: 'number', min: 0, max: 5 },
        defense: { type: 'number', min: 0, max: 5 },
        scienceAndInnovation: { type: 'number', min: 0, max: 5 },
        infrastructure: { type: 'number', min: 0, max: 5 },
        digitalGovernment: { type: 'number', min: 0, max: 5 },
        environmentAndClimateChange: { type: 'number', min: 0, max: 5 },
        carbonPricing: { type: 'number', min: 0, max: 5 },
        agriculture: { type: 'number', min: 0, max: 5 },
        internationalDevelopment: { type: 'number', min: 0, max: 5 },
        culturalPrograms: { type: 'number', min: 0, max: 5 },
        transit: { type: 'number', min: 0, max: 5 },
        economicDevelopment: { type: 'number', min: 0, max: 5 },
        indigenousOperations: { type: 'number', min: 0, max: 5 },
        diplomaticRepresentation: { type: 'number', min: 0, max: 5 }
      }
    },
    budgetGoals: {
      type: 'object',
      properties: {
        targetRevenue: { type: 'number', min: 0, max: 1000000000000 },
        targetDeficit: { type: 'number', min: -1000000000000, max: 1000000000000 },
        enabled: { type: 'boolean' }
      }
    }
  },
  
  sentiment: {
    sensitivity: {
      type: 'object',
      properties: {
        overall: { type: 'number', min: 0, max: 2 },
        regions: { type: 'number', min: 0, max: 2 },
        demographics: { type: 'number', min: 0, max: 2 },
        sectors: { type: 'number', min: 0, max: 2 }
      }
    },
    thresholds: {
      type: 'object',
      properties: {
        warning: { type: 'number', min: 0, max: 1 },
        critical: { type: 'number', min: 0, max: 1 }
      }
    },
    updateFrequency: {
      type: 'number',
      min: 100,
      max: 5000
    }
  },

  salary: {
    selectedSalaryRate: {
      type: 'string',
      allowedValues: ['Annual', 'Monthly', 'Weekly', 'Hourly'],
      required: true
    }
  },

  year: {
    selectedTaxYear: {
      type: 'string',
      allowedValues: ['2023', '2024', '2025'],
      required: true
    }
  },

  config: {
    sortOrder: {
      type: 'string',
      allowedValues: ['asc', 'desc'],
      required: false
    },
    allExpanded: {
      type: 'boolean',
      required: false
    }
  }
};

// Budget Simulator Validation Schemas
export const budgetValidationSchemas = {
  // Revenue rate validation
  revenueRate: {
    sourceId: {
      type: 'string',
      required: true,
      pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
      maxLength: 50
    },
    newRate: {
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      precision: 2
    }
  },

  // Spending factor validation
  spendingFactor: {
    categoryId: {
      type: 'string',
      required: true,
      pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
      maxLength: 50
    },
    factor: {
      type: 'number',
      required: true,
      min: 0.1,
      max: 5.0,
      precision: 3
    }
  },

  // Group spending factor validation
  groupSpendingFactor: {
    groupId: {
      type: 'string',
      required: true,
      pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
      maxLength: 50
    },
    factor: {
      type: 'number',
      required: true,
      min: 0.1,
      max: 5.0,
      precision: 3
    }
  },

  // Tax expenditure adjustment validation
  taxExpenditureAdjustment: {
    expenditureId: {
      type: 'string',
      required: true,
      pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
      maxLength: 50
    },
    adjustment: {
      type: 'number',
      required: true,
      min: -100,
      max: 100,
      precision: 2
    }
  },

  // Budget goals validation
  budgetGoals: {
    enabled: {
      type: 'boolean',
      required: false
    },
    revenueTarget: {
      type: 'number',
      required: false,
      min: 0,
      max: 1000,
      precision: 1
    },
    deficitTarget: {
      type: 'number',
      required: false,
      min: 0,
      max: 200,
      precision: 1
    }
  },

  // Revenue source amount validation
  revenueSourceAmount: {
    sourceId: {
      type: 'string',
      required: true,
      pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
      maxLength: 50
    },
    newAmount: {
      type: 'number',
      required: true,
      min: 0,
      max: 1000,
      precision: 2
    }
  },

  // Year validation
  year: {
    year: {
      type: 'number',
      required: true,
      min: 2020,
      max: 2030,
      integer: true
    }
  },

  // Auto-balance toggle validation
  autoBalanceToggle: {
    active: {
      type: 'boolean',
      required: true
    }
  }
};

// Validation functions
export function validateValue(value, schema) {
  try {
    // Type validation
    if (schema.type && typeof value !== schema.type) {
      return { valid: false, error: `Expected ${schema.type}, got ${typeof value}` };
    }
    
    // Required validation
    if (schema.required && (value === undefined || value === null || value === '')) {
      return { valid: false, error: 'This field is required' };
    }
    
    // Skip validation for undefined/null values that aren't required
    if (!schema.required && (value === undefined || value === null || value === '')) {
      return { valid: true };
    }
    
    // Min/Max validation for numbers
    if (schema.type === 'number' && typeof value === 'number') {
      if (schema.min !== undefined && value < schema.min) {
        return { valid: false, error: `Value must be at least ${schema.min}` };
      }
      if (schema.max !== undefined && value > schema.max) {
        return { valid: false, error: `Value must be at most ${schema.max}` };
      }
    }
    
    // Allowed values validation
    if (schema.allowedValues && !schema.allowedValues.includes(value)) {
      return { valid: false, error: `Value must be one of: ${schema.allowedValues.join(', ')}` };
    }
    
    // Object validation
    if (schema.type === 'object' && schema.properties && typeof value === 'object') {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (value[key] !== undefined) {
          const result = validateValue(value[key], propSchema);
          if (!result.valid) {
            return { valid: false, error: `${key}: ${result.error}` };
          }
        }
      }
    }
    
    return { valid: true };
  } catch (error) {
    handleError(error, (msg) => console.error(`Validation error: ${msg}`));
    return { valid: false, error: 'Validation failed' };
  }
}

// Sanitization functions
export function sanitizeValue(value, schema) {
  try {
    if (value === undefined || value === null) {
      return schema.default !== undefined ? schema.default : value;
    }
    
    // Type conversion
    if (schema.type === 'number' && typeof value !== 'number') {
      const num = parseFloat(value);
      return isNaN(num) ? schema.default : num;
    }
    
    // String sanitization
    if (schema.type === 'string' && typeof value === 'string') {
      return value.trim();
    }
    
    // Boolean conversion
    if (schema.type === 'boolean' && typeof value !== 'boolean') {
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
      }
      return Boolean(value);
    }
    
    // Object sanitization
    if (schema.type === 'object' && schema.properties && typeof value === 'object') {
      const sanitized = {};
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (value[key] !== undefined) {
          sanitized[key] = sanitizeValue(value[key], propSchema);
        }
      }
      return sanitized;
    }
    
    return value;
  } catch (error) {
    handleError(error, (msg) => console.error(`Sanitization error: ${msg}`));
    return schema.default !== undefined ? schema.default : value;
  }
}

// Main validation function for store actions
export function validateStoreAction(storeName, actionName, data) {
  const schema = validationSchemas[storeName];
  if (!schema) {
    return { valid: false, error: `No validation schema found for store: ${storeName}` };
  }
  
  const actionSchema = schema[actionName];
  if (!actionSchema) {
    return { valid: false, error: `No validation schema found for action: ${actionName}` };
  }
  
  return validateValue(data, actionSchema);
}

// Main sanitization function for store actions
export function sanitizeStoreAction(storeName, actionName, data) {
  const schema = validationSchemas[storeName];
  if (!schema) {
    return data;
  }
  
  const actionSchema = schema[actionName];
  if (!actionSchema) {
    return data;
  }
  
  return sanitizeValue(data, actionSchema);
} 