import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  // Cleanup DOM after each test
  document.body.innerHTML = '';
});

// Mock IntersectionObserver if not available in test environment
if (typeof IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(
      public callback: IntersectionObserverCallback,
      public options?: IntersectionObserverInit
    ) {}

    observe() {
      // Mock implementation
    }

    unobserve() {
      // Mock implementation
    }

    disconnect() {
      // Mock implementation
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }

    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds = [];
  };
}
