import {
  useRef,
  useEffect,
  useState,
  useCallback,
  Children,
  cloneElement,
  isValidElement,
} from 'react';
import type { WaypointProps, WaypointPosition } from './types';
import { getScrollableAncestor } from './utils/scrollableAncestor';
import { useWaypointCalculations } from './hooks/useWaypointCalculations';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { useScrollObserver } from './hooks/useScrollObserver';
import { shouldCallOnEnter, shouldCallOnLeave, hasPositionChanged } from './utils/position';

/**
 * Waypoint component - detects when an element enters or leaves the viewport.
 *
 * This modern implementation uses IntersectionObserver as the primary detection
 * mechanism with a fallback to scroll listeners for edge cases.
 *
 * @example
 * ```tsx
 * <Waypoint onEnter={() => console.log('entered')} onLeave={() => console.log('left')}>
 *   <div>Content</div>
 * </Waypoint>
 * ```
 */
export function Waypoint({
  onEnter,
  onLeave,
  onPositionChange,
  horizontal = false,
  topOffset,
  bottomOffset,
  scrollableAncestor: scrollableAncestorProp,
  fireOnRapidScroll = true,
  debug = false,
  children,
}: WaypointProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [scrollableAncestor, setScrollableAncestor] = useState<Window | HTMLElement>(
    typeof window !== 'undefined' ? window : null as any
  );
  const previousPositionRef = useRef<WaypointPosition>('invisible');

  // Get calculations hook
  const { calculatePosition, getCallbackProps } = useWaypointCalculations({
    topOffset,
    bottomOffset,
    horizontal,
    scrollableAncestor,
    debug,
  });

  // Find scrollable ancestor when element is mounted
  useEffect(() => {
    if (elementRef.current) {
      const ancestor = getScrollableAncestor(
        elementRef.current,
        scrollableAncestorProp,
        horizontal
      );
      setScrollableAncestor(ancestor);

      if (debug) {
        console.log('[Waypoint] Scrollable ancestor found:', ancestor);
      }
    }
  }, [scrollableAncestorProp, horizontal, debug]);

  // Handle position updates from observers
  const handlePositionUpdate = useCallback(
    (currentPosition: WaypointPosition, event?: Event) => {
      const previousPosition = previousPositionRef.current;

      if (!hasPositionChanged(currentPosition, previousPosition)) {
        return;
      }

      if (debug) {
        console.log('[Waypoint] Position changed:', {
          from: previousPosition,
          to: currentPosition,
        });
      }

      // Get callback props
      const callbackProps = elementRef.current
        ? getCallbackProps(elementRef.current, currentPosition, previousPosition, event)
        : {
            currentPosition,
            previousPosition,
            event,
          };

      // Call appropriate callbacks
      if (shouldCallOnEnter(currentPosition, previousPosition) && onEnter) {
        if (debug) console.log('[Waypoint] Calling onEnter');
        onEnter(callbackProps);
      }

      if (shouldCallOnLeave(currentPosition, previousPosition) && onLeave) {
        if (debug) console.log('[Waypoint] Calling onLeave');
        onLeave(callbackProps);
      }

      if (onPositionChange) {
        if (debug) console.log('[Waypoint] Calling onPositionChange');
        onPositionChange(callbackProps);
      }

      // Update previous position
      previousPositionRef.current = currentPosition;
    },
    [onEnter, onLeave, onPositionChange, getCallbackProps, debug]
  );

  // Use IntersectionObserver (primary detection mechanism)
  useIntersectionObserver({
    element: elementRef.current,
    scrollableAncestor,
    topOffset,
    bottomOffset,
    onPositionUpdate: handlePositionUpdate,
    debug,
  });

  // Use scroll observer as complementary mechanism
  // This catches cases where IntersectionObserver might miss updates
  useScrollObserver({
    element: elementRef.current,
    scrollableAncestor,
    calculatePosition,
    onPositionUpdate: handlePositionUpdate,
    fireOnRapidScroll,
    debug,
  });

  // Ref callback to attach to the waypoint element
  const refCallback = useCallback(
    (node: HTMLElement | null) => {
      elementRef.current = node;

      if (debug) {
        console.log('[Waypoint] Element ref updated:', node);
      }
    },
    [debug]
  );

  // SSR safety check
  if (typeof window === 'undefined') {
    return children ? <>{children}</> : null;
  }

  // Handle children
  if (!children) {
    // No children: create invisible marker element
    return <span ref={refCallback} style={{ fontSize: 0 }} />;
  }

  const child = Children.only(children);

  if (!isValidElement(child)) {
    console.error('[Waypoint] Children must be a single valid React element');
    return null;
  }

  // Check if child is a DOM element or composite component
  const isDOMElement = typeof child.type === 'string';

  if (isDOMElement) {
    // Clone DOM element and attach ref
    return cloneElement(child as React.ReactElement<any>, {
      ref: refCallback,
    });
  } else {
    // For composite components, wrap in a span
    // This ensures we can always attach a ref
    return (
      <span ref={refCallback} style={{ display: 'contents' }}>
        {child}
      </span>
    );
  }
}

// Export position constants for API compatibility with original library
export const POSITIONS = {
  above: 'above' as const,
  inside: 'inside' as const,
  below: 'below' as const,
  invisible: 'invisible' as const,
};
