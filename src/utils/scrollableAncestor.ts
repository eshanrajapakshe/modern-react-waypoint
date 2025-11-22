/**
 * Check if an element is scrollable.
 *
 * @param element - The element to check
 * @param horizontal - Whether to check for horizontal scrolling
 * @returns True if the element is scrollable
 */
export function isScrollable(element: HTMLElement, horizontal: boolean = false): boolean {
  const style = window.getComputedStyle(element);
  const overflowProp = horizontal ? 'overflowX' : 'overflowY';
  const overflow = style[overflowProp];

  // Check if overflow allows scrolling
  if (overflow === 'auto' || overflow === 'scroll') {
    return true;
  }

  // Even with overflow: hidden, element might be scrollable programmatically
  if (horizontal) {
    return element.scrollWidth > element.clientWidth;
  } else {
    return element.scrollHeight > element.clientHeight;
  }
}

/**
 * Find the first scrollable ancestor of an element.
 * Traverses up the DOM tree until a scrollable element is found.
 *
 * @param element - The starting element
 * @param horizontal - Whether to find horizontally scrollable ancestor
 * @returns The scrollable ancestor element or window
 */
export function findScrollableAncestor(
  element: HTMLElement | null,
  horizontal: boolean = false
): Window | HTMLElement {
  if (!element) {
    return window;
  }

  let currentElement: HTMLElement | null = element.parentElement;

  while (currentElement) {
    // Check if current element is scrollable
    if (isScrollable(currentElement, horizontal)) {
      return currentElement;
    }

    // Check if we've reached the document body
    if (currentElement === document.body || currentElement === document.documentElement) {
      return window;
    }

    currentElement = currentElement.parentElement;
  }

  // Default to window if no scrollable ancestor found
  return window;
}

/**
 * Normalize scrollable ancestor prop to Window or HTMLElement.
 *
 * @param scrollableAncestor - The scrollable ancestor prop value
 * @returns Normalized Window or HTMLElement
 */
export function normalizeScrollableAncestor(
  scrollableAncestor: HTMLElement | Window | 'window' | undefined
): Window | HTMLElement | undefined {
  if (!scrollableAncestor) {
    return undefined;
  }

  if (scrollableAncestor === 'window') {
    return window;
  }

  return scrollableAncestor;
}

/**
 * Get the scrollable ancestor for a waypoint element.
 * Uses provided ancestor if available, otherwise finds one automatically.
 *
 * @param element - The waypoint element
 * @param scrollableAncestorProp - The scrollableAncestor prop
 * @param horizontal - Whether to find horizontal scrollable ancestor
 * @returns The scrollable ancestor
 */
export function getScrollableAncestor(
  element: HTMLElement | null,
  scrollableAncestorProp: HTMLElement | Window | 'window' | undefined,
  horizontal: boolean = false
): Window | HTMLElement {
  const normalized = normalizeScrollableAncestor(scrollableAncestorProp);

  if (normalized) {
    return normalized;
  }

  return findScrollableAncestor(element, horizontal);
}
