import { useEffect, useRef, useCallback } from 'react';
import type { WaypointPosition } from '../types';

export interface UseIntersectionObserverProps {
  element: HTMLElement | null;
  scrollableAncestor: Window | HTMLElement;
  topOffset?: string | number;
  bottomOffset?: string | number;
  onPositionUpdate: (position: WaypointPosition, event?: Event) => void;
  disabled?: boolean;
  debug?: boolean;
}

/**
 * Hook to use IntersectionObserver for efficient waypoint detection.
 * This is the primary detection mechanism for modern browsers.
 */
export function useIntersectionObserver({
  element,
  scrollableAncestor,
  topOffset,
  bottomOffset,
  onPositionUpdate,
  disabled = false,
  debug = false,
}: UseIntersectionObserverProps): void {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const previousPositionRef = useRef<WaypointPosition>('invisible');

  // Parse offset values into rootMargin format
  const getRootMargin = useCallback(() => {
    const parseOffsetToMargin = (offset: string | number | undefined): string => {
      if (offset === undefined) return '0px';
      if (typeof offset === 'number') return `${offset}px`;
      return offset;
    };

    const top = parseOffsetToMargin(topOffset);
    const bottom = parseOffsetToMargin(bottomOffset);

    // rootMargin format: "top right bottom left"
    // We negate the offsets because rootMargin grows outward
    const topMargin = top.startsWith('-') ? top.slice(1) : `-${top}`;
    const bottomMargin = bottom.startsWith('-') ? bottom.slice(1) : `-${bottom}`;

    return `${topMargin} 0px ${bottomMargin} 0px`;
  }, [topOffset, bottomOffset]);

  // Get root element for IntersectionObserver
  const getRoot = useCallback(() => {
    if (scrollableAncestor === window) {
      return null; // null means use viewport
    }
    return scrollableAncestor as HTMLElement;
  }, [scrollableAncestor]);

  useEffect(() => {
    if (disabled || !element) {
      return;
    }

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      if (debug) {
        console.warn('[Waypoint] IntersectionObserver not available, skipping');
      }
      return;
    }

    const rootMargin = getRootMargin();
    const root = getRoot();

    if (debug) {
      console.log('[Waypoint] Setting up IntersectionObserver', {
        rootMargin,
        root: root === null ? 'viewport' : root,
      });
    }

    // Create observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Determine position based on intersection
          let position: WaypointPosition;

          if (entry.isIntersecting) {
            position = 'inside';
          } else {
            // Check if element is above or below viewport
            const rect = entry.boundingClientRect;
            const rootBounds = entry.rootBounds;

            if (!rootBounds) {
              position = 'invisible';
            } else if (rect.bottom < rootBounds.top) {
              position = 'above';
            } else if (rect.top > rootBounds.bottom) {
              position = 'below';
            } else {
              position = 'invisible';
            }
          }

          if (debug) {
            console.log('[Waypoint] IntersectionObserver update:', {
              position,
              isIntersecting: entry.isIntersecting,
              intersectionRatio: entry.intersectionRatio,
            });
          }

          // Only call callback if position changed
          if (position !== previousPositionRef.current) {
            previousPositionRef.current = position;
            onPositionUpdate(position);
          }
        });
      },
      {
        root,
        rootMargin,
        threshold: [0, 1], // Trigger at both 0% and 100% intersection
      }
    );

    observer.observe(element);
    observerRef.current = observer;

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [element, scrollableAncestor, topOffset, bottomOffset, onPositionUpdate, disabled, debug, getRootMargin, getRoot]);
}
