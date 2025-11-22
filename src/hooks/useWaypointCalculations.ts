import { useCallback, useMemo } from 'react';
import type { WaypointPosition, OffsetValue, WaypointCallbackProps } from '../types';
import { calculateBoundaries } from '../utils/boundaries';
import {
  calculateWaypointPosition,
  clientRectToPageCoordinates,
  getElementBounds,
} from '../utils/position';

export interface UseWaypointCalculationsProps {
  topOffset?: OffsetValue;
  bottomOffset?: OffsetValue;
  horizontal?: boolean;
  scrollableAncestor: Window | HTMLElement;
  debug?: boolean;
}

export interface UseWaypointCalculationsReturn {
  calculatePosition: (element: HTMLElement) => WaypointPosition;
  getCallbackProps: (
    element: HTMLElement,
    currentPosition: WaypointPosition,
    previousPosition: WaypointPosition,
    event?: Event
  ) => WaypointCallbackProps;
}

/**
 * Hook to calculate waypoint position and prepare callback props.
 * Encapsulates all position calculation logic.
 */
export function useWaypointCalculations({
  topOffset,
  bottomOffset,
  horizontal = false,
  scrollableAncestor,
  debug = false,
}: UseWaypointCalculationsProps): UseWaypointCalculationsReturn {
  // Memoize boundaries calculation
  const boundaries = useMemo(() => {
    return calculateBoundaries(topOffset, bottomOffset, scrollableAncestor, horizontal);
  }, [topOffset, bottomOffset, scrollableAncestor, horizontal]);

  // Calculate current position of waypoint
  const calculatePosition = useCallback(
    (element: HTMLElement): WaypointPosition => {
      const rect = getElementBounds(element);
      const coords = clientRectToPageCoordinates(rect, scrollableAncestor, horizontal);

      const position = calculateWaypointPosition(
        {
          waypointTop: coords.start,
          waypointBottom: coords.end,
          viewportTop: boundaries.top,
          viewportBottom: boundaries.bottom,
          waypointLeft: horizontal ? coords.start : undefined,
          waypointRight: horizontal ? coords.end : undefined,
          viewportLeft: horizontal ? boundaries.top : undefined,
          viewportRight: horizontal ? boundaries.bottom : undefined,
        },
        horizontal
      );

      if (debug) {
        console.log('[Waypoint] Position calculation:', {
          position,
          waypointStart: coords.start,
          waypointEnd: coords.end,
          viewportStart: boundaries.top,
          viewportEnd: boundaries.bottom,
          horizontal,
        });
      }

      return position;
    },
    [boundaries, scrollableAncestor, horizontal, debug]
  );

  // Get callback props with all necessary data
  const getCallbackProps = useCallback(
    (
      element: HTMLElement,
      currentPosition: WaypointPosition,
      previousPosition: WaypointPosition,
      event?: Event
    ): WaypointCallbackProps => {
      const rect = getElementBounds(element);
      const coords = clientRectToPageCoordinates(rect, scrollableAncestor, horizontal);

      const props: WaypointCallbackProps = {
        currentPosition,
        previousPosition,
        event,
        waypointTop: coords.start,
        viewportTop: boundaries.top,
        viewportBottom: boundaries.bottom,
      };

      if (debug) {
        console.log('[Waypoint] Callback props:', props);
      }

      return props;
    },
    [boundaries, scrollableAncestor, horizontal, debug]
  );

  return {
    calculatePosition,
    getCallbackProps,
  };
}
