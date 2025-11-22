/**
 * @modern/react-waypoint
 *
 * Modern, fully TypeScript implementation of react-waypoint with React 19 compatibility.
 * Uses IntersectionObserver for efficient waypoint detection with scroll listener fallback.
 *
 * @author Modern React Waypoint Contributors
 * @license MIT
 *
 * Inspired by the original react-waypoint library by Brigade:
 * https://github.com/civiccc/react-waypoint
 */

export { Waypoint, POSITIONS } from './Waypoint';

export type {
  WaypointProps,
  WaypointPosition,
  WaypointCallbackProps,
  OffsetValue,
  Boundaries,
  WaypointRect,
  PositionCalculationContext,
} from './types';

// Default export for backwards compatibility
export { Waypoint as default } from './Waypoint';
