import { useEffect, useRef, useCallback } from 'react';
import type { WaypointPosition } from '../types';

export interface UseScrollObserverProps {
  element: HTMLElement | null;
  scrollableAncestor: Window | HTMLElement;
  calculatePosition: (element: HTMLElement) => WaypointPosition;
  onPositionUpdate: (position: WaypointPosition, event?: Event) => void;
  fireOnRapidScroll?: boolean;
  disabled?: boolean;
  debug?: boolean;
}

/**
 * Debounce function for scroll events.
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for rapid scroll events.
 */
function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Hook to use scroll/resize listeners as fallback for waypoint detection.
 * Used when IntersectionObserver is not suitable or as a complementary mechanism.
 */
export function useScrollObserver({
  element,
  scrollableAncestor,
  calculatePosition,
  onPositionUpdate,
  fireOnRapidScroll = true,
  disabled = false,
  debug = false,
}: UseScrollObserverProps): void {
  const previousPositionRef = useRef<WaypointPosition>('invisible');
  const rafIdRef = useRef<number | null>(null);

  // Handle position check
  const checkPosition = useCallback(
    (event?: Event) => {
      if (!element) return;

      // Use requestAnimationFrame for better performance
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const currentPosition = calculatePosition(element);

        if (debug) {
          console.log('[Waypoint] Scroll observer position check:', {
            currentPosition,
            previousPosition: previousPositionRef.current,
          });
        }

        // Only update if position changed
        if (currentPosition !== previousPositionRef.current) {
          previousPositionRef.current = currentPosition;
          onPositionUpdate(currentPosition, event);
        }

        rafIdRef.current = null;
      });
    },
    [element, calculatePosition, onPositionUpdate, debug]
  );

  // Create debounced/throttled handlers
  const debouncedCheckPosition = useRef(debounce(checkPosition, 100));
  const throttledCheckPosition = useRef(throttle(checkPosition, 150));

  // Get the appropriate handler based on fireOnRapidScroll
  const handleScroll = useCallback(
    (event: Event) => {
      if (fireOnRapidScroll) {
        throttledCheckPosition.current(event);
      } else {
        debouncedCheckPosition.current(event);
      }
    },
    [fireOnRapidScroll]
  );

  useEffect(() => {
    if (disabled || !element) {
      return;
    }

    if (debug) {
      console.log('[Waypoint] Setting up scroll observer', {
        scrollableAncestor: scrollableAncestor === window ? 'window' : scrollableAncestor,
        fireOnRapidScroll,
      });
    }

    // Initial position check
    checkPosition();

    // Add scroll listener
    const scrollTarget = scrollableAncestor;
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

    // Add resize listener (window only)
    if (scrollableAncestor === window) {
      window.addEventListener('resize', handleScroll, { passive: true });
    }

    // Cleanup
    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      if (scrollableAncestor === window) {
        window.removeEventListener('resize', handleScroll);
      }

      // Cancel any pending RAF
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [element, scrollableAncestor, handleScroll, checkPosition, disabled, debug]);

  // Check position on prop changes
  useEffect(() => {
    if (!disabled && element) {
      checkPosition();
    }
  }, [element, calculatePosition, disabled, checkPosition]);
}
