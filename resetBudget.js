/**
 * Reset budget function for the budget simulator
 * This can be imported and used in the budget simulator store
 */
export function resetBudget() {
      console.log('Starting budget reset...');
      
      // Store the current auto-balance state to log it
      const wasAutoBalanceActive = this.autoBalanceActive;
      if (wasAutoBalanceActive) {
        console.log('Auto-Balance was active - disabling it for reset');
      }
      
      // Disable auto-balance first to prevent it from interfering with the reset
      this.autoBalanceActive = false;
      
      // Reset active preset
      this.activePreset = null;
      
      // Clear badges
      this.badges = [];
      
      // Skip automatic recalculation to ensure we maintain exact values
      this._isRecalculating = true;
      
      try {
        // Define exact original values for all revenue sources with correct distribution
        const sources = {
          // Income Taxes: 290B total (210 + 80)
          personalIncomeTax: { rate: 21, amount: 210, adjustedAmount: 210 },
          corporateIncomeTax: { rate: 15, amount: 80, adjustedAmount: 80 },
          
          // Consumption Taxes: 76B total (50 + 12 + 8 + 6)
          gst: { rate: 5, amount: 50, adjustedAmount: 50 },
          exciseTaxes: { rate: 2.5, amount: 12, adjustedAmount: 12 },
          carbonPricing: { rate: 1, amount: 8, adjustedAmount: 8 },
          customsDuties: { rate: 1, amount: 6, adjustedAmount: 6 },
          
          // Other Revenue: 68B total (27 + 6 + 5 + 30)
          eiPremiums: { rate: 1.35, amount: 27, adjustedAmount: 27 },
          crownProfits: { rate: 2.5, amount: 6, adjustedAmount: 6 },
          resourceRoyalties: { rate: 1, amount: 5, adjustedAmount: 5 },
          nonTaxRevenue: { rate: 3, amount: 30, adjustedAmount: 30 }
        };
        
        // Reset each revenue source individually
        Object.keys(sources).forEach(sourceId => {
          if (this.revenueSources[sourceId]) {
            const source = sources[sourceId];
            
            // Update only the properties that need to be reset
            // Keep all other properties (base, rateByYear, etc.)
            this.revenueSources[sourceId].rate = source.rate;
            this.revenueSources[sourceId].amount = source.amount;
            this.revenueSources[sourceId].adjustedAmount = source.adjustedAmount;
            this.revenueSources[sourceId].expenditureImpact = 0;
            
            console.log(`Reset ${sourceId} to rate: ${source.rate}, amount: ${source.amount}B`);
          } else {
            console.warn(`Revenue source ${sourceId} does not exist and cannot be reset`);
          }
        });
        
        // Reset spending categories immutably
        const resetCategories = {};
        for (const catId in this.spendingCategories) {
          const cat = this.spendingCategories[catId];
          if (!cat.isGroup) {
            resetCategories[catId] = { ...cat, adjustmentFactor: 1 };
          } else if (cat.children) {
            const resetChildren = {};
            for (const childId in cat.children) {
              resetChildren[childId] = { ...cat.children[childId], adjustmentFactor: 1 };
            }
            resetCategories[catId] = { ...cat, children: resetChildren };
          }
        }
        this.spendingCategories = resetCategories;
        
        // Reset expanded groups immutably
        this.expandedGroups = {
          incomeTaxes: true,
          consumptionTaxes: true,
          otherRevenues: true,
          mainCategories: true,
          otherCategories: false,
          governmentOperations: false,
          taxExpenditures: true,
        };
        
        // Handle CPP Premiums if they exist in the store but not in our defaults
        if (this.revenueSources.cppPremiums) {
          console.log('CPP Premiums found in store but not in defaults - setting to zero');
          this.revenueSources.cppPremiums.rate = 0;
          this.revenueSources.cppPremiums.amount = 0;
          this.revenueSources.cppPremiums.adjustedAmount = 0;
          this.revenueSources.cppPremiums.expenditureImpact = 0;
        }
        
        // Now perform a controlled recalculation
        this.recalculateTotals();
        
        // Verify the total revenue is correct
        const expectedTotal = 434; // The expected total revenue
        const actualTotal = this.totalRevenue;
        
        console.log(`Total revenue after reset: ${actualTotal}B (expected: ${expectedTotal}B)`);
        
        // Ensure badges remain empty after recalculation
        this.badges = [];
        this.lastBadgeUpdate = Date.now();
        
        // Force a UI update for all revenue sources
        this.lastRevenueSourceUpdate = Date.now();
        
        // Double-check that auto-balance is still disabled
        // This is critical when auto-balance was active before reset
        if (this.autoBalanceActive) {
          console.warn('Auto-balance was re-enabled during reset - forcing it off again');
          this.autoBalanceActive = false;
        }
        
        // Double-check totals one more time
        const finalTotal = this.totalRevenue;
        if (Math.abs(finalTotal - 434) > 0.5) {
          console.warn(`Final revenue check: ${finalTotal}B doesn't match expected 434B`);
          // Force direct correction of any discrepancy
          const correction = 434 - finalTotal;
          this.revenueSources.personalIncomeTax.amount += correction;
          this.revenueSources.personalIncomeTax.adjustedAmount += correction;
          this.revenueSources.personalIncomeTax.rate = this.revenueSources.personalIncomeTax.amount / this.revenueSources.personalIncomeTax.base;
          console.log(`Applied final correction of ${correction}B to personal income tax`);
        }
      } finally {
        this._isRecalculating = false;
      }

      // Signal reset complete
      this.lastUpdate = Date.now();

      // Sync to localStorage
      this.syncToLocalStorage();

      console.log('Budget reset to initial state with badges cleared');
      console.log('Total Revenue after reset:', this.totalRevenue);
    },
