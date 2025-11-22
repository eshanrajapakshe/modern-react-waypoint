/**
 * Position of the waypoint relative to the viewport.
 * - 'above': Waypoint is above the viewport
 * - 'inside': Waypoint is inside the viewport (visible)
 * - 'below': Waypoint is below the viewport
 * - 'invisible': Waypoint is not visible or hidden
 */
export type WaypointPosition = 'above' | 'inside' | 'below' | 'invisible';

/**
 * Props passed to waypoint callback functions.
 */
export interface WaypointCallbackProps {
  /** Current position of the waypoint */
  currentPosition: WaypointPosition;
  /** Previous position of the waypoint */
  previousPosition: WaypointPosition;
  /** The event that triggered the callback (if available) */
  event?: Event;
  /** Top position of the waypoint element */
  waypointTop?: number;
  /** Top position of the viewport */
  viewportTop?: number;
  /** Bottom position of the viewport */
  viewportBottom?: number;
}

/**
 * Offset value can be a string (px or %) or a number.
 * - String: '10px', '50%', '-100px', '-10%'
 * - Number: 100, -50 (treated as pixels)
 */
export type OffsetValue = string | number;

/**
 * Props for the Waypoint component.
 */
export interface WaypointProps {
  /**
   * Callback fired when waypoint enters the viewport.
   */
  onEnter?: (props: WaypointCallbackProps) => void;

  /**
   * Callback fired when waypoint leaves the viewport.
   */
  onLeave?: (props: WaypointCallbackProps) => void;

  /**
   * Callback fired when waypoint position changes.
   */
  onPositionChange?: (props: WaypointCallbackProps) => void;

  /**
   * Enable horizontal scrolling detection instead of vertical.
   * @default false
   */
  horizontal?: boolean;

  /**
   * Offset from the top of the viewport.
   * Positive values move the boundary down, negative values move it up.
   * @default '0px'
   */
  topOffset?: OffsetValue;

  /**
   * Offset from the bottom of the viewport.
   * Positive values move the boundary up, negative values move it down.
   * @default '0px'
   */
  bottomOffset?: OffsetValue;

  /**
   * The scrollable ancestor element to listen to.
   * Can be an HTMLElement, Window, or 'window' string.
   * If not provided, will automatically find the scrollable ancestor.
   */
  scrollableAncestor?: HTMLElement | Window | 'window';

  /**
   * Fire callbacks even during rapid scrolling.
   * When false, may skip intermediate positions during fast scrolling.
   * @default true
   */
  fireOnRapidScroll?: boolean;

  /**
   * Enable debug logging to console.
   * @default false
   */
  debug?: boolean;

  /**
   * Optional children. Can be a single React element or null.
   * If null, waypoint will create an invisible marker element.
   */
  children?: React.ReactNode;
}

/**
 * Parsed boundary information.
 */
export interface Boundaries {
  top: number;
  bottom: number;
}

/**
 * Rect information for waypoint calculations.
 */
export interface WaypointRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  height: number;
  width: number;
}

/**
 * Context for waypoint position calculations.
 */
export interface PositionCalculationContext {
  waypointTop: number;
  waypointBottom: number;
  viewportTop: number;
  viewportBottom: number;
  waypointLeft?: number;
  waypointRight?: number;
  viewportLeft?: number;
  viewportRight?: number;
}
