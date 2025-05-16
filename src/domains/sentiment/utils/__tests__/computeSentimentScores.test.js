import { computeSentimentScores } from '../computeSentimentScores';
import { CLAMP_RANGE } from '../../config/sentimentConfig';

describe('computeSentimentScores', () => {
  // Test case for rawScore=5 being clamped to 1 and mapping to sentimentValue=5
  test('clamps high raw score and maps to correct sentiment value', () => {
    const budget = {
      revenueMix: {
        personalIncomeTax: 25,
        corporateIncomeTax: 20,
        gst: 7
      },
      budgetItems: {
        healthcare: 200000000000, // $200B - extremely high value
        education: 150000000000,  // $150B - extremely high value
        infrastructure: 100000000000 // $100B - extremely high value
      }
    };

    const result = computeSentimentScores(budget);
    
    // Check that the raw score was clamped to CLAMP_RANGE (1)
    expect(result.aggregateRaw).toBeLessThanOrEqual(CLAMP_RANGE);
    
    // Check that the final sentiment value is 5
    expect(result.overall).toBe(5);
  });

  // Test case for rawScore=-5 being clamped to -1 and mapping to sentimentValue=1
  test('clamps low raw score and maps to correct sentiment value', () => {
    const budget = {
      revenueMix: {
        personalIncomeTax: 5,  // Extremely low tax rate
        corporateIncomeTax: 5, // Extremely low tax rate
        gst: 2                 // Extremely low tax rate
      },
      budgetItems: {
        healthcare: 10000000000,    // $10B - extremely low value
        education: 5000000000,      // $5B - extremely low value
        infrastructure: 2000000000  // $2B - extremely low value
      }
    };

    const result = computeSentimentScores(budget);
    
    // Check that the raw score was clamped to -CLAMP_RANGE (-1)
    expect(result.aggregateRaw).toBeGreaterThanOrEqual(-CLAMP_RANGE);
    
    // Check that the final sentiment value is 1
    expect(result.overall).toBe(1);
  });

  // Test case for extreme severity trigger appearing in criticalAlerts
  test('handles extreme severity triggers correctly', () => {
    const budget = {
      revenueMix: {
        personalIncomeTax: 25,
        corporateIncomeTax: 20,
        gst: 7
      },
      budgetItems: {
        healthcare: 200000000000, // $200B - extremely high value
        education: 150000000000,  // $150B - extremely high value
        infrastructure: 100000000000 // $100B - extremely high value
      }
    };

    const result = computeSentimentScores(budget);
    
    // Check that critical alerts are present
    expect(result.criticalAlerts).toBeDefined();
    expect(Array.isArray(result.criticalAlerts)).toBe(true);
    
    // Check that the extreme severity trigger is in criticalAlerts
    const hasExtremeTrigger = result.criticalAlerts.some(alert => 
      alert.severity === 'extreme' && alert.score === 4
    );
    expect(hasExtremeTrigger).toBe(true);
    
    // Check that the extreme trigger is not included in the aggregate score
    expect(result.aggregateRaw).not.toBe(4);
  });
}); 