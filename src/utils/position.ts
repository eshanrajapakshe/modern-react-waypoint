import type { WaypointPosition, PositionCalculationContext } from '../types';

/**
 * Determine the position of a waypoint relative to the viewport boundaries.
 *
 * @param context - The calculation context with waypoint and viewport positions
 * @param horizontal - Whether to use horizontal positioning
 * @returns The waypoint position
 */
export function calculateWaypointPosition(
  context: PositionCalculationContext,
  horizontal: boolean = false
): WaypointPosition {
  if (horizontal) {
    return calculateHorizontalPosition(context);
  }
  return calculateVerticalPosition(context);
}

/**
 * Calculate vertical waypoint position.
 */
function calculateVerticalPosition(context: PositionCalculationContext): WaypointPosition {
  const { waypointTop, waypointBottom, viewportTop, viewportBottom } = context;

  // Check if waypoint is invisible (has no height or invalid positions)
  if (waypointTop === waypointBottom || !isFinite(waypointTop) || !isFinite(waypointBottom)) {
    return 'invisible';
  }

  // Waypoint is completely above the viewport
  if (waypointBottom <= viewportTop) {
    return 'above';
  }

  // Waypoint is completely below the viewport
  if (waypointTop >= viewportBottom) {
    return 'below';
  }

  // Waypoint intersects with the viewport (partially or fully visible)
  return 'inside';
}

/**
 * Calculate horizontal waypoint position.
 */
function calculateHorizontalPosition(context: PositionCalculationContext): WaypointPosition {
  const { waypointLeft, waypointRight, viewportLeft, viewportRight } = context;

  // Validate horizontal positions are provided
  if (
    waypointLeft === undefined ||
    waypointRight === undefined ||
    viewportLeft === undefined ||
    viewportRight === undefined
  ) {
    return 'invisible';
  }

  // Check if waypoint is invisible (has no width or invalid positions)
  if (waypointLeft === waypointRight || !isFinite(waypointLeft) || !isFinite(waypointRight)) {
    return 'invisible';
  }

  // Waypoint is completely to the left of the viewport
  if (waypointRight <= viewportLeft) {
    return 'above'; // Use 'above' for consistency (left = above)
  }

  // Waypoint is completely to the right of the viewport
  if (waypointLeft >= viewportRight) {
    return 'below'; // Use 'below' for consistency (right = below)
  }

  // Waypoint intersects with the viewport (partially or fully visible)
  return 'inside';
}

/**
 * Check if position has changed and should trigger callbacks.
 *
 * @param currentPosition - The current position
 * @param previousPosition - The previous position
 * @returns True if position has changed
 */
export function hasPositionChanged(
  currentPosition: WaypointPosition,
  previousPosition: WaypointPosition
): boolean {
  return currentPosition !== previousPosition;
}

/**
 * Determine if onEnter should be called based on position change.
 *
 * @param currentPosition - The current position
 * @param previousPosition - The previous position
 * @returns True if onEnter should be called
 */
export function shouldCallOnEnter(
  currentPosition: WaypointPosition,
  previousPosition: WaypointPosition
): boolean {
  return currentPosition === 'inside' && previousPosition !== 'inside';
}

/**
 * Determine if onLeave should be called based on position change.
 *
 * @param currentPosition - The current position
 * @param previousPosition - The previous position
 * @returns True if onLeave should be called
 */
export function shouldCallOnLeave(
  currentPosition: WaypointPosition,
  previousPosition: WaypointPosition
): boolean {
  return previousPosition === 'inside' && currentPosition !== 'inside';
}

/**
 * Get element bounds relative to the page.
 *
 * @param element - The element to get bounds for
 * @returns The element bounds
 */
export function getElementBounds(element: HTMLElement): DOMRect {
  return element.getBoundingClientRect();
}

/**
 * Convert client rect to page coordinates.
 *
 * @param rect - The client rect
 * @param scrollableAncestor - The scrollable ancestor
 * @param horizontal - Whether to use horizontal coordinates
 * @returns Page coordinates
 */
export function clientRectToPageCoordinates(
  rect: DOMRect,
  scrollableAncestor: Window | HTMLElement,
  horizontal: boolean = false
): { start: number; end: number } {
  const isWindow = scrollableAncestor === window;

  if (horizontal) {
    const scrollX = isWindow
      ? window.pageXOffset || window.scrollX
      : (scrollableAncestor as HTMLElement).scrollLeft;
    return {
      start: rect.left + scrollX,
      end: rect.right + scrollX,
    };
  } else {
    const scrollY = isWindow
      ? window.pageYOffset || window.scrollY
      : (scrollableAncestor as HTMLElement).scrollTop;
    return {
      start: rect.top + scrollY,
      end: rect.bottom + scrollY,
    };
  }
}
