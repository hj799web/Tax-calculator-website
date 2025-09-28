// Chunk loading utility with retry logic and error handling
export class ChunkLoader {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    this.loadingChunks = new Set();
  }

  // Enhanced chunk loading with retry logic
  async loadChunk(chunkId, importFn) {
    if (this.loadingChunks.has(chunkId)) {
      // If already loading, wait for it
      return new Promise((resolve, reject) => {
        const checkLoading = () => {
          if (!this.loadingChunks.has(chunkId)) {
            // Try to get the chunk from cache or retry
            this.retryLoadChunk(chunkId, importFn, 0)
              .then(resolve)
              .catch(reject);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    this.loadingChunks.add(chunkId);
    
    try {
      const result = await this.retryLoadChunk(chunkId, importFn, 0);
      this.loadingChunks.delete(chunkId);
      return result;
    } catch (error) {
      this.loadingChunks.delete(chunkId);
      throw error;
    }
  }

  async retryLoadChunk(chunkId, importFn, attempt) {
    try {
      return await importFn();
    } catch (error) {
      if (this.isChunkLoadError(error) && attempt < this.retryAttempts) {
        console.warn(`[ChunkLoader] Retry ${attempt + 1}/${this.retryAttempts} for chunk ${chunkId}`);
        
        // Wait before retrying
        await this.delay(this.retryDelay * Math.pow(2, attempt));
        
        // Clear the failed chunk from cache
        this.clearChunkFromCache(chunkId);
        
        return this.retryLoadChunk(chunkId, importFn, attempt + 1);
      }
      
      throw error;
    }
  }

  isChunkLoadError(error) {
    return (
      error.name === 'ChunkLoadError' ||
      error.message?.includes('Loading chunk') ||
      error.message?.includes('Loading CSS chunk') ||
      error.message?.includes('ChunkLoadError')
    );
  }

  clearChunkFromCache(chunkId) {
    // Clear from webpack's chunk cache
    if (window.__webpack_require__ && window.__webpack_require__.cache) {
      Object.keys(window.__webpack_require__.cache).forEach(key => {
        if (key.includes(chunkId)) {
          delete window.__webpack_require__.cache[key];
        }
      });
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Preload critical chunks
  async preloadCriticalChunks() {
    const criticalChunks = [
      // Add critical chunk IDs here
      'runtime',
      'app',
      'vendors'
    ];

    for (const chunkId of criticalChunks) {
      try {
        // Preload chunk by creating a link element
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = `/js/${chunkId}.js`;
        document.head.appendChild(link);
      } catch (error) {
        console.warn(`[ChunkLoader] Failed to preload chunk ${chunkId}:`, error);
      }
    }
  }
}

// Global chunk loader instance
export const chunkLoader = new ChunkLoader();

// Enhanced import function with chunk loading error handling
export function safeImport(importFn, chunkId = 'unknown') {
  return chunkLoader.loadChunk(chunkId, importFn);
}

// Utility to wrap dynamic imports
export function createSafeImport(importFn, chunkId) {
  return () => safeImport(importFn, chunkId);
}

// Initialize chunk loader
if (typeof window !== 'undefined') {
  // Preload critical chunks on page load
  chunkLoader.preloadCriticalChunks();
  
  // Global error handler for chunk loading
  window.addEventListener('error', (event) => {
    if (event.target && event.target.tagName === 'SCRIPT') {
      const src = event.target.src;
      if (src && src.includes('/js/') && src.includes('.js')) {
        console.error('[ChunkLoader] Script loading error:', src);
        // Optionally retry or show user-friendly error
      }
    }
  });
}
