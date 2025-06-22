export function handleError(error, showUserMessage) {
  // Log error with context
  const errorContext = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    errorType: error.constructor.name
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', errorContext);
  }

  // Send to error tracking service in production
  if (process.env.NODE_ENV === 'production') {
    // You can integrate with services like Sentry here
    console.error('Production Error:', errorContext);
  }

  if (typeof showUserMessage === 'function') {
    showUserMessage("Something went wrong. Please try again later.");
  }
}

// Enhanced error handler with component context
export function handleComponentError(error, componentName, context = {}) {
  const errorContext = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    errorType: error.constructor.name,
    component: componentName,
    context
  };

  if (process.env.NODE_ENV === 'development') {
    console.error(`[${componentName}] Error Details:`, errorContext);
  }

  // Send to error tracking service in production
  if (process.env.NODE_ENV === 'production') {
    // You can integrate with services like Sentry here
    console.error(`[${componentName}] Production Error:`, errorContext);
  }

  return errorContext;
}

// Store-specific error handler with validation
export function handleStoreError(error, storeName, actionName, data = null) {
  const errorContext = {
    ...handleComponentError(error, `${storeName}.${actionName}`),
    store: storeName,
    action: actionName,
    data: data ? JSON.stringify(data) : null
  };

  console.error(`[STORE ERROR] ${storeName}.${actionName}:`, errorContext);
  
  return {
    success: false,
    error: error.message,
    context: errorContext
  };
}

// Specific error handlers for different types
export function handleValidationError(error, fieldName) {
  console.warn(`Validation error for ${fieldName}:`, error.message);
  return {
    valid: false,
    message: error.message,
    field: fieldName
  };
}

// Security-focused error handler
export function handleSecurityError(error, context) {
  const securityContext = {
    ...context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    errorType: 'SecurityError'
  };

  // Always log security errors
  console.error('Security Error:', securityContext);

  // In production, you might want to send this to a security monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to security monitoring service
    console.error('Security violation detected:', securityContext);
  }

  return {
    blocked: true,
    reason: 'Security violation detected',
    context: securityContext
  };
}

// Input sanitization error handler
export function handleSanitizationError(error, inputValue, fieldName) {
  console.warn(`Sanitization error for ${fieldName}:`, {
    originalValue: inputValue,
    error: error.message,
    field: fieldName
  });

  return {
    sanitized: false,
    originalValue: inputValue,
    error: error.message,
    field: fieldName
  };
}

// Rate limiting error handler
export function handleRateLimitError(error, action, limit) {
  console.warn(`Rate limit exceeded for ${action}:`, {
    limit,
    action,
    timestamp: new Date().toISOString()
  });

  return {
    rateLimited: true,
    action,
    limit,
    retryAfter: 60 // seconds
  };
} 