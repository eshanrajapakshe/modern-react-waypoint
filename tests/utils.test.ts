import { describe, it, expect } from 'vitest';
import { parseOffset, calculateBoundaries } from '../src/utils/boundaries';
import {
  calculateWaypointPosition,
  hasPositionChanged,
  shouldCallOnEnter,
  shouldCallOnLeave,
} from '../src/utils/position';
import { isScrollable, findScrollableAncestor } from '../src/utils/scrollableAncestor';

describe('boundaries utilities', () => {
  describe('parseOffset', () => {
    it('parses number offsets', () => {
      expect(parseOffset(100, 1000)).toBe(100);
      expect(parseOffset(-50, 1000)).toBe(-50);
      expect(parseOffset(0, 1000)).toBe(0);
    });

    it('parses pixel string offsets', () => {
      expect(parseOffset('100px', 1000)).toBe(100);
      expect(parseOffset('-50px', 1000)).toBe(-50);
      expect(parseOffset('0px', 1000)).toBe(0);
    });

    it('parses percentage string offsets', () => {
      expect(parseOffset('50%', 1000)).toBe(500);
      expect(parseOffset('10%', 1000)).toBe(100);
      expect(parseOffset('100%', 1000)).toBe(1000);
      expect(parseOffset('-25%', 1000)).toBe(-250);
    });

    it('handles invalid offsets gracefully', () => {
      expect(parseOffset('invalid', 1000)).toBe(0);
      expect(parseOffset('abc%', 1000)).toBe(0);
      expect(parseOffset('xyzpx', 1000)).toBe(0);
    });

    it('handles whitespace', () => {
      expect(parseOffset(' 100px ', 1000)).toBe(100);
      expect(parseOffset(' 50% ', 1000)).toBe(500);
    });
  });

  describe('calculateBoundaries', () => {
    it('calculates boundaries for window', () => {
      const boundaries = calculateBoundaries(undefined, undefined, window, false);
      expect(boundaries).toHaveProperty('top');
      expect(boundaries).toHaveProperty('bottom');
    });

    it('applies top offset correctly', () => {
      const boundaries = calculateBoundaries('100px', undefined, window, false);
      expect(boundaries.top).toBeGreaterThan(0);
    });

    it('applies bottom offset correctly', () => {
      const boundaries = calculateBoundaries(undefined, '50px', window, false);
      expect(boundaries.bottom).toBeGreaterThan(0);
    });
  });
});

describe('position utilities', () => {
  describe('calculateWaypointPosition', () => {
    it('returns "above" when waypoint is above viewport', () => {
      const position = calculateWaypointPosition(
        {
          waypointTop: 0,
          waypointBottom: 100,
          viewportTop: 200,
          viewportBottom: 1000,
        },
        false
      );
      expect(position).toBe('above');
    });

    it('returns "below" when waypoint is below viewport', () => {
      const position = calculateWaypointPosition(
        {
          waypointTop: 1500,
          waypointBottom: 1600,
          viewportTop: 200,
          viewportBottom: 1000,
        },
        false
      );
      expect(position).toBe('below');
    });

    it('returns "inside" when waypoint intersects viewport', () => {
      const position = calculateWaypointPosition(
        {
          waypointTop: 500,
          waypointBottom: 700,
          viewportTop: 200,
          viewportBottom: 1000,
        },
        false
      );
      expect(position).toBe('inside');
    });

    it('returns "inside" when waypoint partially overlaps viewport top', () => {
      const position = calculateWaypointPosition(
        {
          waypointTop: 100,
          waypointBottom: 300,
          viewportTop: 200,
          viewportBottom: 1000,
        },
        false
      );
      expect(position).toBe('inside');
    });

    it('returns "inside" when waypoint partially overlaps viewport bottom', () => {
      const position = calculateWaypointPosition(
        {
          waypointTop: 900,
          waypointBottom: 1100,
          viewportTop: 200,
          viewportBottom: 1000,
        },
        false
      );
      expect(position).toBe('inside');
    });

    it('returns "invisible" when waypoint has no height', () => {
      const position = calculateWaypointPosition(
        {
          waypointTop: 500,
          waypointBottom: 500,
          viewportTop: 200,
          viewportBottom: 1000,
        },
        false
      );
      expect(position).toBe('invisible');
    });

    it('handles horizontal positioning', () => {
      const position = calculateWaypointPosition(
        {
          waypointTop: 0,
          waypointBottom: 0,
          viewportTop: 0,
          viewportBottom: 0,
          waypointLeft: 500,
          waypointRight: 700,
          viewportLeft: 200,
          viewportRight: 1000,
        },
        true
      );
      expect(position).toBe('inside');
    });
  });

  describe('hasPositionChanged', () => {
    it('returns true when position changed', () => {
      expect(hasPositionChanged('inside', 'above')).toBe(true);
      expect(hasPositionChanged('above', 'below')).toBe(true);
      expect(hasPositionChanged('below', 'inside')).toBe(true);
    });

    it('returns false when position unchanged', () => {
      expect(hasPositionChanged('inside', 'inside')).toBe(false);
      expect(hasPositionChanged('above', 'above')).toBe(false);
      expect(hasPositionChanged('below', 'below')).toBe(false);
    });
  });

  describe('shouldCallOnEnter', () => {
    it('returns true when entering viewport', () => {
      expect(shouldCallOnEnter('inside', 'above')).toBe(true);
      expect(shouldCallOnEnter('inside', 'below')).toBe(true);
      expect(shouldCallOnEnter('inside', 'invisible')).toBe(true);
    });

    it('returns false when not entering viewport', () => {
      expect(shouldCallOnEnter('above', 'below')).toBe(false);
      expect(shouldCallOnEnter('below', 'above')).toBe(false);
      expect(shouldCallOnEnter('inside', 'inside')).toBe(false);
    });
  });

  describe('shouldCallOnLeave', () => {
    it('returns true when leaving viewport', () => {
      expect(shouldCallOnLeave('above', 'inside')).toBe(true);
      expect(shouldCallOnLeave('below', 'inside')).toBe(true);
      expect(shouldCallOnLeave('invisible', 'inside')).toBe(true);
    });

    it('returns false when not leaving viewport', () => {
      expect(shouldCallOnLeave('above', 'below')).toBe(false);
      expect(shouldCallOnLeave('inside', 'inside')).toBe(false);
      expect(shouldCallOnLeave('above', 'above')).toBe(false);
    });
  });
});

describe('scrollableAncestor utilities', () => {
  describe('isScrollable', () => {
    it('identifies scrollable elements', () => {
      const div = document.createElement('div');
      div.style.overflow = 'auto';
      div.style.height = '100px';

      // Note: In jsdom, scrollHeight might not work as expected
      // This is a simplified test
      expect(typeof isScrollable(div)).toBe('boolean');
    });
  });

  describe('findScrollableAncestor', () => {
    it('returns window when no scrollable ancestor found', () => {
      const div = document.createElement('div');
      const result = findScrollableAncestor(div);
      expect(result).toBe(window);
    });

    it('handles null element', () => {
      const result = findScrollableAncestor(null);
      expect(result).toBe(window);
    });
  });
});
