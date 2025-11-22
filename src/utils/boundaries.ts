import type { OffsetValue, Boundaries } from '../types';

/**
 * Parse an offset value (string or number) into pixels.
 * Supports: '10px', '50%', '-100px', '-10%', 100, -50
 *
 * @param offset - The offset value to parse
 * @param contextSize - The size to use for percentage calculations (viewport height/width)
 * @returns The parsed offset in pixels
 */
export function parseOffset(offset: OffsetValue, contextSize: number): number {
  if (typeof offset === 'number') {
    return offset;
  }

  const trimmed = offset.trim();

  // Handle percentage values
  if (trimmed.endsWith('%')) {
    const percentage = parseFloat(trimmed);
    if (isNaN(percentage)) {
      console.warn(`Invalid percentage offset: ${offset}`);
      return 0;
    }
    return (percentage / 100) * contextSize;
  }

  // Handle pixel values
  if (trimmed.endsWith('px')) {
    const pixels = parseFloat(trimmed);
    if (isNaN(pixels)) {
      console.warn(`Invalid pixel offset: ${offset}`);
      return 0;
    }
    return pixels;
  }

  // Try to parse as a number
  const parsed = parseFloat(trimmed);
  if (isNaN(parsed)) {
    console.warn(`Invalid offset value: ${offset}`);
    return 0;
  }

  return parsed;
}

/**
 * Calculate viewport boundaries with offsets applied.
 *
 * @param topOffset - Offset from the top of the viewport
 * @param bottomOffset - Offset from the bottom of the viewport
 * @param scrollableAncestor - The scrollable element (window or HTMLElement)
 * @param horizontal - Whether to calculate horizontal boundaries
 * @returns Boundaries object with top and bottom (or left and right for horizontal)
 */
export function calculateBoundaries(
  topOffset: OffsetValue | undefined,
  bottomOffset: OffsetValue | undefined,
  scrollableAncestor: Window | HTMLElement,
  horizontal: boolean = false
): Boundaries {
  const isWindow = scrollableAncestor === window;

  let viewportSize: number;
  let scrollPosition: number;

  if (horizontal) {
    // Horizontal scrolling
    if (isWindow) {
      viewportSize = window.innerWidth;
      scrollPosition = window.pageXOffset || window.scrollX;
    } else {
      const element = scrollableAncestor as HTMLElement;
      viewportSize = element.clientWidth;
      scrollPosition = element.scrollLeft;
    }
  } else {
    // Vertical scrolling
    if (isWindow) {
      viewportSize = window.innerHeight;
      scrollPosition = window.pageYOffset || window.scrollY;
    } else {
      const element = scrollableAncestor as HTMLElement;
      viewportSize = element.clientHeight;
      scrollPosition = element.scrollTop;
    }
  }

  // Parse offsets
  const parsedTopOffset = topOffset ? parseOffset(topOffset, viewportSize) : 0;
  const parsedBottomOffset = bottomOffset ? parseOffset(bottomOffset, viewportSize) : 0;

  // Calculate boundaries
  // topOffset moves the top boundary down (positive) or up (negative)
  // bottomOffset moves the bottom boundary up (positive) or down (negative)
  const top = scrollPosition + parsedTopOffset;
  const bottom = scrollPosition + viewportSize - parsedBottomOffset;

  return { top, bottom };
}

/**
 * Get the dimensions of a scrollable element.
 *
 * @param scrollableAncestor - The scrollable element
 * @param horizontal - Whether to get horizontal dimensions
 * @returns Object with size and scroll position
 */
export function getScrollableDimensions(
  scrollableAncestor: Window | HTMLElement,
  horizontal: boolean = false
): { size: number; scroll: number } {
  const isWindow = scrollableAncestor === window;

  if (horizontal) {
    if (isWindow) {
      return {
        size: window.innerWidth,
        scroll: window.pageXOffset || window.scrollX,
      };
    } else {
      const element = scrollableAncestor as HTMLElement;
      return {
        size: element.clientWidth,
        scroll: element.scrollLeft,
      };
    }
  } else {
    if (isWindow) {
      return {
        size: window.innerHeight,
        scroll: window.pageYOffset || window.scrollY,
      };
    } else {
      const element = scrollableAncestor as HTMLElement;
      return {
        size: element.clientHeight,
        scroll: element.scrollTop,
      };
    }
  }
}
