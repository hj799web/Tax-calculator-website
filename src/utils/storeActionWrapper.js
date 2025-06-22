import { validateStoreAction, sanitizeStoreAction, validateValue, sanitizeValue } from './storeValidation.js';
import { handleError } from './errorHandler.js';

export function createValidatedAction(storeName, actionName, originalAction) {
  return function(...args) {
    try {
      // Validate input data (first argument is typically the data)
      if (args.length > 0) {
        const validationResult = validateStoreAction(storeName, actionName, args[0]);
        if (!validationResult.valid) {
          handleError(new Error(`Validation failed for ${storeName}.${actionName}: ${validationResult.error}`), (msg) => {
            console.error(`[STORE VALIDATION] ${msg}`);
          });
          return false;
        }
        
        // Sanitize input data
        const sanitizedArgs = args.map((arg, index) => {
          if (index === 0) {
            return sanitizeStoreAction(storeName, actionName, arg);
          }
          return arg;
        });
        
        // Execute original action with sanitized data
        return originalAction.apply(this, sanitizedArgs);
      } else {
        // No arguments to validate, execute original action
        return originalAction.apply(this, args);
      }
    } catch (error) {
      handleError(error, (msg) => {
        console.error(`[STORE ACTION] Error in ${storeName}.${actionName}: ${msg}`);
      });
      return false;
    }
  };
}

// Wrapper function for store actions with validation schema
export function wrapStoreAction(actionFunction, validationSchema, actionName) {
  return function(...args) {
    try {
      // Validate input data if schema is provided
      if (validationSchema && args.length > 0) {
        // For methods with multiple parameters, create an object for validation
        let dataToValidate;
        if (args.length === 1) {
          dataToValidate = args[0];
        } else {
          // Create an object from the arguments based on the schema keys
          const schemaKeys = Object.keys(validationSchema);
          dataToValidate = {};
          args.forEach((arg, index) => {
            if (schemaKeys[index]) {
              dataToValidate[schemaKeys[index]] = arg;
            }
          });
        }
        
        const validationResult = validateValue(dataToValidate, validationSchema);
        if (!validationResult.valid) {
          handleError(new Error(`Validation failed for ${actionName}: ${validationResult.error}`), (msg) => {
            console.error(`[STORE VALIDATION] ${msg}`);
          });
          return false;
        }
        
        // Sanitize input data
        const sanitizedData = sanitizeValue(dataToValidate, validationSchema);
        
        // Convert back to arguments if needed
        let sanitizedArgs = args;
        if (args.length > 1) {
          const schemaKeys = Object.keys(validationSchema);
          sanitizedArgs = schemaKeys.map(key => sanitizedData[key]);
        } else {
          sanitizedArgs = [sanitizedData];
        }
        
        // Execute original action with sanitized data
        return actionFunction.apply(this, sanitizedArgs);
      } else {
        // No validation schema, execute original action
        return actionFunction.apply(this, args);
      }
    } catch (error) {
      handleError(error, (msg) => {
        console.error(`[STORE ACTION] Error in ${actionName}: ${msg}`);
      });
      return false;
    }
  };
}

// Decorator for store actions (for future use with TypeScript)
export function validateAction(storeName, actionName) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args) {
      return createValidatedAction(storeName, actionName, originalMethod).apply(this, args);
    };
    
    return descriptor;
  };
}

// Utility to wrap all actions in a store
export function wrapStoreActions(store, storeName) {
  const wrappedStore = { ...store };
  
  // Wrap all actions that have validation schemas
  Object.keys(store.actions || {}).forEach(actionName => {
    const originalAction = store.actions[actionName];
    if (typeof originalAction === 'function') {
      wrappedStore.actions[actionName] = createValidatedAction(storeName, actionName, originalAction);
    }
  });
  
  return wrappedStore;
}

// Higher-order function to create validated stores
export function createValidatedStore(storeDefinition, storeName) {
  // If it's a function-based store (composition API)
  if (typeof storeDefinition === 'function') {
    return function() {
      const store = storeDefinition();
      
      // Wrap actions if they exist
      if (store.actions) {
        Object.keys(store.actions).forEach(actionName => {
          const originalAction = store.actions[actionName];
          if (typeof originalAction === 'function') {
            store.actions[actionName] = createValidatedAction(storeName, actionName, originalAction);
          }
        });
      }
      
      return store;
    };
  }
  
  // If it's an options-based store
  if (typeof storeDefinition === 'object') {
    const wrappedStore = { ...storeDefinition };
    
    if (wrappedStore.actions) {
      Object.keys(wrappedStore.actions).forEach(actionName => {
        const originalAction = wrappedStore.actions[actionName];
        if (typeof originalAction === 'function') {
          wrappedStore.actions[actionName] = createValidatedAction(storeName, actionName, originalAction);
        }
      });
    }
    
    return wrappedStore;
  }
  
  return storeDefinition;
} 