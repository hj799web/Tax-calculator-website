export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
  }
  
  startTimer(operation) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(operation, duration);
      return duration;
    };
  }
  
  recordMetric(operation, duration) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation).push(duration);
    
    // Keep only last 100 measurements
    if (this.metrics.get(operation).length > 100) {
      this.metrics.get(operation).shift();
    }
  }
  
  getAverageTime(operation) {
    const measurements = this.metrics.get(operation) || [];
    if (measurements.length === 0) return 0;
    
    return measurements.reduce((sum, time) => sum + time, 0) / measurements.length;
  }
  
  getSlowestOperations(limit = 10) {
    const operations = Array.from(this.metrics.entries()).map(([operation, measurements]) => ({
      operation,
      averageTime: this.getAverageTime(operation),
      count: measurements.length
    }));
    
    return operations
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, limit);
  }
  
  observeComponent(name, callback) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes(name)) {
          callback(entry);
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
    this.observers.set(name, observer);
  }
  
  measureComponent(name, fn) {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.recordMetric(`component_${name}`, duration);
    
    if (duration > 16) { // Warn if slower than 60fps
      console.warn(`[PERFORMANCE] ${name} took ${duration.toFixed(2)}ms to render`);
    }
    
    return result;
  }
  
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
  
  getReport() {
    const slowest = this.getSlowestOperations();
    const report = {
      slowestOperations: slowest,
      totalOperations: this.metrics.size,
      timestamp: new Date().toISOString()
    };
    
    console.table(slowest);
    return report;
  }
}

export const performanceMonitor = new PerformanceMonitor(); 