# @modern/react-waypoint Demo

This is a live demo of the `@modern/react-waypoint` library.

## Features Demonstrated

1. **Basic Waypoint** - Simple enter/leave detection
2. **Lazy Loading** - Load images only when visible
3. **Animations** - Trigger animations on scroll
4. **Offsets** - Early detection with custom offsets
5. **Infinite Scroll** - Load more content trigger

## How to Use in CodeSandbox

1. Go to [codesandbox.io](https://codesandbox.io/)
2. Click "Create Sandbox"
3. Choose "React" or "React TypeScript" template
4. Copy all files from this `codesandbox-demo` folder into the sandbox
5. The demo will automatically run!

## Installation

To use this library in your own project:

```bash
npm install @modern/react-waypoint
```

## Basic Usage

```tsx
import { Waypoint } from '@modern/react-waypoint';

function MyComponent() {
  return (
    <Waypoint
      onEnter={() => console.log('Entered!')}
      onLeave={() => console.log('Left!')}
    >
      <div>Your content here</div>
    </Waypoint>
  );
}
```

## Learn More

- [GitHub Repository](https://github.com/eshanrajapakshe/modern-react-waypoint)
- [npm Package](https://www.npmjs.com/package/@modern/react-waypoint)

