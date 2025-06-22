import { validateStoreAction, sanitizeStoreAction, validateValue, sanitizeValue } from '../storeValidation.js';

describe('Store Validation Tests', () => {
  describe('validateValue', () => {
    test('should validate number within range', () => {
      const schema = { type: 'number', min: 0, max: 100 };
      const result = validateValue(50, schema);
      expect(result.valid).toBe(true);
    });

    test('should reject number below minimum', () => {
      const schema = { type: 'number', min: 0, max: 100 };
      const result = validateValue(-10, schema);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 0');
    });

    test('should reject number above maximum', () => {
      const schema = { type: 'number', min: 0, max: 100 };
      const result = validateValue(150, schema);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at most 100');
    });

    test('should validate string from allowed values', () => {
      const schema = { type: 'string', allowedValues: ['Alberta', 'Ontario', 'Quebec'] };
      const result = validateValue('Alberta', schema);
      expect(result.valid).toBe(true);
    });

    test('should reject string not in allowed values', () => {
      const schema = { type: 'string', allowedValues: ['Alberta', 'Ontario', 'Quebec'] };
      const result = validateValue('Manitoba', schema);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be one of');
    });

    test('should validate required fields', () => {
      const schema = { type: 'string', required: true };
      const result = validateValue('test', schema);
      expect(result.valid).toBe(true);
    });

    test('should reject missing required fields', () => {
      const schema = { type: 'string', required: true };
      const result = validateValue('', schema);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    test('should allow undefined for non-required fields', () => {
      const schema = { type: 'number', min: 0, max: 100, required: false };
      const result = validateValue(undefined, schema);
      expect(result.valid).toBe(true);
    });
  });

  describe('sanitizeValue', () => {
    test('should convert string to number', () => {
      const schema = { type: 'number', min: 0, max: 100 };
      const result = sanitizeValue('50', schema);
      expect(result).toBe(50);
    });

    test('should trim strings', () => {
      const schema = { type: 'string' };
      const result = sanitizeValue('  test  ', schema);
      expect(result).toBe('test');
    });

    test('should return default for invalid conversion', () => {
      const schema = { type: 'number', default: 0 };
      const result = sanitizeValue('invalid', schema);
      expect(result).toBe(0);
    });

    test('should handle boolean conversion', () => {
      const schema = { type: 'boolean' };
      const result = sanitizeValue('true', schema);
      expect(result).toBe(true);
    });
  });

  describe('validateStoreAction', () => {
    test('should validate calculator income', () => {
      const result = validateStoreAction('calculator', 'income', 50000);
      expect(result.valid).toBe(true);
    });

    test('should reject invalid calculator income', () => {
      const result = validateStoreAction('calculator', 'income', -1000);
      expect(result.valid).toBe(false);
    });

    test('should validate calculator region', () => {
      const result = validateStoreAction('calculator', 'selectedRegion', 'Ontario');
      expect(result.valid).toBe(true);
    });

    test('should reject invalid calculator region', () => {
      const result = validateStoreAction('calculator', 'selectedRegion', 'InvalidProvince');
      expect(result.valid).toBe(false);
    });

    test('should validate salary rate', () => {
      const result = validateStoreAction('salary', 'selectedSalaryRate', 'Annual');
      expect(result.valid).toBe(true);
    });

    test('should reject invalid salary rate', () => {
      const result = validateStoreAction('salary', 'selectedSalaryRate', 'Invalid');
      expect(result.valid).toBe(false);
    });

    test('should validate tax year', () => {
      const result = validateStoreAction('year', 'selectedTaxYear', '2024');
      expect(result.valid).toBe(true);
    });

    test('should reject invalid tax year', () => {
      const result = validateStoreAction('year', 'selectedTaxYear', '2020');
      expect(result.valid).toBe(false);
    });
  });

  describe('sanitizeStoreAction', () => {
    test('should sanitize calculator income', () => {
      const result = sanitizeStoreAction('calculator', 'income', '50000');
      expect(result).toBe(50000);
    });

    test('should sanitize calculator region', () => {
      const result = sanitizeStoreAction('calculator', 'selectedRegion', '  Ontario  ');
      expect(result).toBe('Ontario');
    });

    test('should handle undefined values', () => {
      const result = sanitizeStoreAction('calculator', 'income', undefined);
      expect(result).toBe(undefined);
    });
  });
}); 