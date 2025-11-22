
# @eshan.rajapakshe/react-waypoint

> Modern, fully TypeScript implementation of react-waypoint with React 19 compatibility

A performant and reliable React component for executing callbacks when scrolling to an element. Built with TypeScript, powered by IntersectionObserver API, and optimized for React 19.

## 🎮 Live Demo

**[Try it on CodeSandbox →](https://codesandbox.io/p/sandbox/rrzv2n)**

See interactive examples of lazy loading, scroll animations, infinite scroll, and more!

## ✨ Features

- 🚀 **Modern & Performant** - Uses IntersectionObserver API for efficient detection
- 💪 **TypeScript Native** - Full type safety with comprehensive type definitions
- 🧠 **Full IntelliSense** - Complete autocomplete and type checking in your IDE
- ⚛️ **React 19 Compatible** - Built with latest React patterns and hooks
- 📦 **Tree Shakeable** - ESM modules for optimal bundle size (<3KB gzipped)
- 🎯 **Reliable** - Comprehensive test coverage and battle-tested logic
- 🔄 **API Compatible** - Drop-in replacement for original react-waypoint
- 🎨 **Flexible** - Support for vertical/horizontal scrolling and custom offsets
- 🔍 **Debug Mode** - Built-in debugging for development

## 📦 Installation

```bash
npm install @eshan.rajapakshe/react-waypoint
```

```bash
yarn add @eshan.rajapakshe/react-waypoint
```

```bash
pnpm add @eshan.rajapakshe/react-waypoint
```

## 🚀 Quick Start

```tsx
import { Waypoint } from '@eshan.rajapakshe/react-waypoint';

function App() {
  return (
    <div>
      <div style={{ height: '200vh' }}>Scroll down...</div>

      <Waypoint
        onEnter={() => console.log('Entered viewport!')}
        onLeave={() => console.log('Left viewport!')}
      >
        <div>I trigger callbacks when scrolled into view!</div>
      </Waypoint>

      <div style={{ height: '200vh' }}>More content...</div>
    </div>
  );
}
```

## 📖 API Documentation

### Props

#### `onEnter?: (props: WaypointCallbackProps) => void`

Callback fired when the waypoint enters the viewport.

```tsx
<Waypoint onEnter={({ currentPosition, previousPosition }) => {
  console.log('Entered!', currentPosition);
}}>
  <div>Content</div>
</Waypoint>
```

#### `onLeave?: (props: WaypointCallbackProps) => void`

Callback fired when the waypoint leaves the viewport.

```tsx
<Waypoint onLeave={({ currentPosition, previousPosition }) => {
  console.log('Left!', currentPosition);
}}>
  <div>Content</div>
</Waypoint>
```

#### `onPositionChange?: (props: WaypointCallbackProps) => void`

Callback fired whenever the waypoint position changes.

```tsx
<Waypoint onPositionChange={({ currentPosition }) => {
  console.log('Position:', currentPosition); // 'above' | 'inside' | 'below' | 'invisible'
}}>
  <div>Content</div>
</Waypoint>
```

#### `topOffset?: string | number`

Offset from the top of the viewport. Accepts pixels (`100`, `'100px'`) or percentages (`'50%'`).

Positive values move the boundary down, negative values move it up.

```tsx
// Trigger 100px before reaching viewport top
<Waypoint topOffset="-100px">
  <div>Content</div>
</Waypoint>

// Trigger at 20% from top
<Waypoint topOffset="20%">
  <div>Content</div>
</Waypoint>
```

#### `bottomOffset?: string | number`

Offset from the bottom of the viewport. Accepts pixels or percentages.

Positive values move the boundary up, negative values move it down.

```tsx
// Trigger 50px before reaching viewport bottom
<Waypoint bottomOffset="50px">
  <div>Content</div>
</Waypoint>
```

#### `horizontal?: boolean`

Enable horizontal scrolling detection instead of vertical.

```tsx
<Waypoint horizontal>
  <div>Horizontal content</div>
</Waypoint>
```

#### `scrollableAncestor?: HTMLElement | Window | 'window'`

The scrollable container to monitor. If not provided, automatically finds the scrollable ancestor.

```tsx
const containerRef = useRef<HTMLDivElement>(null);

<div ref={containerRef} style={{ overflow: 'auto', height: '400px' }}>
  <Waypoint scrollableAncestor={containerRef.current || undefined}>
    <div>Content</div>
  </Waypoint>
</div>
```

#### `fireOnRapidScroll?: boolean`

Fire callbacks during rapid scrolling. Default: `true`.

When `false`, uses debouncing to skip intermediate positions during fast scrolling.

```tsx
<Waypoint fireOnRapidScroll={false}>
  <div>Content</div>
</Waypoint>
```

#### `debug?: boolean`

Enable debug logging to console. Useful for development.

```tsx
<Waypoint debug>
  <div>Content</div>
</Waypoint>
```

### TypeScript Types

```typescript
import type {
  WaypointPosition,
  WaypointCallbackProps,
  WaypointProps
} from '@eshan.rajapakshe/react-waypoint';

// Position type
type WaypointPosition = 'above' | 'inside' | 'below' | 'invisible';

// Callback props
interface WaypointCallbackProps {
  currentPosition: WaypointPosition;
  previousPosition: WaypointPosition;
  event?: Event;
  waypointTop?: number;
  viewportTop?: number;
  viewportBottom?: number;
}
```

### Position Constants

```tsx
import { POSITIONS } from '@eshan.rajapakshe/react-waypoint';

console.log(POSITIONS.above);     // 'above'
console.log(POSITIONS.inside);    // 'inside'
console.log(POSITIONS.below);     // 'below'
console.log(POSITIONS.invisible); // 'invisible'
```

## 🎯 Common Use Cases

### Lazy Loading Images

```tsx
import { Waypoint } from '@eshan.rajapakshe/react-waypoint';
import { useState } from 'react';

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Waypoint onEnter={() => setLoaded(true)}>
      <div>
        {loaded ? (
          <img src={src} alt={alt} />
        ) : (
          <div style={{ height: '300px', background: '#eee' }}>Loading...</div>
        )}
      </div>
    </Waypoint>
  );
}
```

### Infinite Scroll

```tsx
import { Waypoint } from '@eshan.rajapakshe/react-waypoint';
import { useState } from 'react';

function InfiniteList() {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i));
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading) return;

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setItems(prev => [...prev, ...Array.from({ length: 20 }, (_, i) => prev.length + i)]);
    setLoading(false);
  };

  return (
    <div>
      {items.map(item => (
        <div key={item} style={{ padding: '20px', border: '1px solid #ddd' }}>
          Item {item}
        </div>
      ))}

      <Waypoint onEnter={loadMore} bottomOffset="-200px">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          {loading ? 'Loading...' : 'Load More'}
        </div>
      </Waypoint>
    </div>
  );
}
```

### Scroll Spy / Active Navigation

```tsx
import { Waypoint } from '@eshan.rajapakshe/react-waypoint';
import { useState } from 'react';

function ScrollSpy() {
  const [activeSection, setActiveSection] = useState('');

  return (
    <div>
      <nav style={{ position: 'fixed', top: 0 }}>
        <a href="#section1" style={{ fontWeight: activeSection === 'section1' ? 'bold' : 'normal' }}>
          Section 1
        </a>
        <a href="#section2" style={{ fontWeight: activeSection === 'section2' ? 'bold' : 'normal' }}>
          Section 2
        </a>
      </nav>

      <Waypoint onEnter={() => setActiveSection('section1')} topOffset="60px">
        <section id="section1" style={{ height: '100vh' }}>
          <h2>Section 1</h2>
        </section>
      </Waypoint>

      <Waypoint onEnter={() => setActiveSection('section2')} topOffset="60px">
        <section id="section2" style={{ height: '100vh' }}>
          <h2>Section 2</h2>
        </section>
      </Waypoint>
    </div>
  );
}
```

### Analytics Tracking

```tsx
import { Waypoint } from '@eshan.rajapakshe/react-waypoint';

function TrackedContent({ id, children }: { id: string; children: React.ReactNode }) {
  const trackView = () => {
    // Send analytics event
    analytics.track('content_viewed', { contentId: id });
  };

  return (
    <Waypoint onEnter={trackView}>
      <div>{children}</div>
    </Waypoint>
  );
}
```

### Animation Triggers

```tsx
import { Waypoint } from '@eshan.rajapakshe/react-waypoint';
import { useState } from 'react';

function AnimatedSection() {
  const [visible, setVisible] = useState(false);

  return (
    <Waypoint onEnter={() => setVisible(true)}>
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(50px)',
          transition: 'all 0.6s ease-out',
        }}
      >
        Animated content!
      </div>
    </Waypoint>
  );
}
```

## 🔄 Migration from Original react-waypoint

This library is designed as a drop-in replacement for the original react-waypoint:

```diff
- import Waypoint from 'react-waypoint';
+ import { Waypoint } from '@eshan.rajapakshe/react-waypoint';

// All props work exactly the same!
<Waypoint
  onEnter={handleEnter}
  onLeave={handleLeave}
  topOffset="100px"
>
  <div>Content</div>
</Waypoint>
```

### Key Improvements

- ✅ Full TypeScript support (no `@types` package needed)
- ✅ Uses IntersectionObserver for better performance
- ✅ React 19 compatible
- ✅ Better tree-shaking and smaller bundle size
- ✅ Improved SSR support
- ✅ Better debugging with `debug` prop

## 🎨 Advanced Usage

### Without Children (Invisible Marker)

```tsx
<Waypoint
  onEnter={() => console.log('Scrolled to this point')}
/>
```

### Multiple Callbacks

```tsx
<Waypoint
  onEnter={() => console.log('Entered')}
  onLeave={() => console.log('Left')}
  onPositionChange={({ currentPosition }) => {
    console.log('Position:', currentPosition);
  }}
>
  <div>Content</div>
</Waypoint>
```

### Custom Scrollable Container

```tsx
function ScrollableContainer() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: '200vh' }}>
        <Waypoint
          scrollableAncestor={containerRef.current || undefined}
          onEnter={() => console.log('Entered in custom container')}
        >
          <div>Content</div>
        </Waypoint>
      </div>
    </div>
  );
}
```

## 🐛 Troubleshooting

### Callbacks not firing

1. **Check if IntersectionObserver is supported** - The library uses IntersectionObserver, which is supported in all modern browsers. For older browsers, consider using a polyfill.

2. **Verify scrollable ancestor** - Make sure the scrollable container is properly detected. You can manually specify it with the `scrollableAncestor` prop.

3. **Enable debug mode** - Use the `debug` prop to see detailed logs:

```tsx
<Waypoint debug onEnter={() => console.log('entered')}>
  <div>Content</div>
</Waypoint>
```

### Callbacks firing multiple times

- This is expected when the waypoint crosses viewport boundaries multiple times
- Use `onEnter` and `onLeave` instead of `onPositionChange` if you only want specific transitions

### Performance issues

- Set `fireOnRapidScroll={false}` for debounced callbacks
- Avoid heavy computations in callbacks
- Use `useCallback` to memoize callback functions

## 🏗️ How It Works

The library uses a dual-detection strategy:

1. **IntersectionObserver (Primary)** - Efficiently detects when elements enter/leave the viewport
2. **Scroll Listeners (Fallback)** - Catches edge cases and provides additional precision

This approach provides the best of both worlds: performance from IntersectionObserver and reliability from scroll listeners.

## 🌐 Browser Support

- Chrome/Edge 58+
- Firefox 55+
- Safari 12.1+
- All modern mobile browsers

For older browsers, use an [IntersectionObserver polyfill](https://www.npmjs.com/package/intersection-observer).

## 📊 Bundle Size

- **Minified**: ~8KB
- **Gzipped**: <5KB
- Zero runtime dependencies (except React)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🙏 Acknowledgments

This library is inspired by the original [react-waypoint](https://github.com/civiccc/react-waypoint) by Brigade. We're grateful to the original creators for their pioneering work in this space.

Our implementation modernizes the approach with:
- Full TypeScript support
- IntersectionObserver API
- React 19 compatibility
- Improved performance and reliability

---

**Made with ❤️ for the React community**