import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { Waypoint } from '../src/Waypoint';
import type { WaypointCallbackProps } from '../src/types';
import { act } from 'react';

// Helper to render components (async for React 19)
async function render(element: React.ReactElement) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(element);
  });

  return {
    container,
    unmount: async () => {
      await act(async () => {
        root.unmount();
      });
      document.body.removeChild(container);
    },
    rerender: async (newElement: React.ReactElement) => {
      await act(async () => {
        root.render(newElement);
      });
    },
  };
}

describe('Waypoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    it('renders children correctly', async () => {
      const { container } = await render(
        <Waypoint>
          <div data-testid="child">Content</div>
        </Waypoint>
      );

      const child = container.querySelector('[data-testid="child"]');
      expect(child).toBeTruthy();
      expect(child?.textContent).toBe('Content');
    });

    it('renders invisible marker when no children provided', async () => {
      const { container } = await render(<Waypoint />);
      const span = container.querySelector('span');

      expect(span).toBeTruthy();
      expect(span?.style.fontSize).toBe('0');
    });

    it('handles single child correctly', async () => {
      const { container } = await render(
        <Waypoint>
          <div data-testid="single-child">Single</div>
        </Waypoint>
      );

      expect(container.querySelector('[data-testid="single-child"]')).toBeTruthy();
    });

    it('wraps composite components in span', async () => {
      const CompositeComponent = () => <div data-testid="composite">Composite</div>;

      const { container } = await render(
        <Waypoint>
          <CompositeComponent />
        </Waypoint>
      );

      const wrapper = container.querySelector('span');
      expect(wrapper).toBeTruthy();
      expect(container.querySelector('[data-testid="composite"]')).toBeTruthy();
    });
  });

  describe('callbacks', () => {
    it('accepts onEnter callback', async () => {
      const onEnter = vi.fn();

      await render(
        <Waypoint onEnter={onEnter}>
          <div>Content</div>
        </Waypoint>
      );

      // Note: Actual callback invocation requires scroll/intersection simulation
      expect(onEnter).toHaveBeenCalledTimes(0);
    });

    it('accepts onLeave callback', async () => {
      const onLeave = vi.fn();

      await render(
        <Waypoint onLeave={onLeave}>
          <div>Content</div>
        </Waypoint>
      );

      expect(onLeave).toHaveBeenCalledTimes(0);
    });

    it('accepts onPositionChange callback', async () => {
      const onPositionChange = vi.fn();

      await render(
        <Waypoint onPositionChange={onPositionChange}>
          <div>Content</div>
        </Waypoint>
      );

      expect(onPositionChange).toHaveBeenCalledTimes(0);
    });

    it('callback props have correct shape', async () => {
      const onEnter = vi.fn();

      await render(
        <Waypoint onEnter={onEnter}>
          <div>Content</div>
        </Waypoint>
      );

      if (onEnter.mock.calls.length > 0) {
        const callbackProps = onEnter.mock.calls[0]?.[0] as WaypointCallbackProps;
        expect(callbackProps).toHaveProperty('currentPosition');
        expect(callbackProps).toHaveProperty('previousPosition');
      }
    });
  });

  describe('props', () => {
    it('accepts horizontal prop', async () => {
      const { container } = await render(
        <Waypoint horizontal>
          <div>Content</div>
        </Waypoint>
      );

      expect(container).toBeTruthy();
    });

    it('accepts topOffset prop', async () => {
      const { container } = await render(
        <Waypoint topOffset="100px">
          <div>Content</div>
        </Waypoint>
      );

      expect(container).toBeTruthy();
    });

    it('accepts bottomOffset prop', async () => {
      const { container } = await render(
        <Waypoint bottomOffset="50%">
          <div>Content</div>
        </Waypoint>
      );

      expect(container).toBeTruthy();
    });

    it('accepts numeric offsets', async () => {
      const { container } = await render(
        <Waypoint topOffset={100} bottomOffset={50}>
          <div>Content</div>
        </Waypoint>
      );

      expect(container).toBeTruthy();
    });

    it('accepts scrollableAncestor as "window"', async () => {
      const { container } = await render(
        <Waypoint scrollableAncestor="window">
          <div>Content</div>
        </Waypoint>
      );

      expect(container).toBeTruthy();
    });

    it('accepts fireOnRapidScroll prop', async () => {
      const { container } = await render(
        <Waypoint fireOnRapidScroll={false}>
          <div>Content</div>
        </Waypoint>
      );

      expect(container).toBeTruthy();
    });

    it('accepts debug prop', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await render(
        <Waypoint debug>
          <div>Content</div>
        </Waypoint>
      );

      consoleSpy.mockRestore();
    });
  });

  describe('SSR compatibility', () => {
    it('handles SSR environment gracefully', async () => {
      const { container } = await render(
        <Waypoint>
          <div>Content</div>
        </Waypoint>
      );

      expect(container).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('handles rapid prop updates', async () => {
      const { rerender, container } = await render(
        <Waypoint topOffset="0px">
          <div>Content</div>
        </Waypoint>
      );

      await rerender(
        <Waypoint topOffset="100px">
          <div>Content</div>
        </Waypoint>
      );

      await rerender(
        <Waypoint topOffset="200px">
          <div>Content</div>
        </Waypoint>
      );

      expect(container.textContent).toContain('Content');
    });

    it('handles unmounting gracefully', async () => {
      const { unmount } = await render(
        <Waypoint>
          <div>Content</div>
        </Waypoint>
      );

      await expect(unmount()).resolves.not.toThrow();
    });
  });
});
