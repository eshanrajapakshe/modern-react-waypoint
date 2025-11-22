/**
 * Example usage showing IntelliSense support
 *
 * When you type this in VS Code or any TypeScript-aware editor,
 * you'll get full autocomplete and type checking!
 */

import { Waypoint, WaypointCallbackProps, POSITIONS } from './src/index';

function Example() {
  // ✅ Callback props are fully typed - IntelliSense works!
  const handleEnter = (props: WaypointCallbackProps) => {
    console.log('Position:', props.currentPosition);
    console.log('Previous:', props.previousPosition);
    console.log('Event:', props.event);
    console.log('Waypoint Top:', props.waypointTop);
  };

  return (
    <div>
      {/* ✅ All props have autocomplete */}
      <Waypoint
        onEnter={handleEnter}
        onLeave={(props) => {
          // ✅ Inline callback props are typed automatically!
          console.log(props.currentPosition);
        }}
        topOffset="100px"     // ✅ String offset
        bottomOffset={50}      // ✅ Number offset
        horizontal={false}     // ✅ Boolean
        fireOnRapidScroll={true}
        debug={false}
        scrollableAncestor="window"  // ✅ "window" | HTMLElement | Window
      >
        <div>Content</div>
      </Waypoint>

      {/* ✅ Without children (invisible marker) */}
      <Waypoint onEnter={handleEnter} />

      {/* ✅ Position constants are exported */}
      <Waypoint
        onPositionChange={(props) => {
          if (props.currentPosition === POSITIONS.inside) {
            console.log('Inside viewport!');
          }
        }}
      >
        <div>More content</div>
      </Waypoint>
    </div>
  );
}

// ✅ You can also use it with forwardRef components
import { forwardRef } from 'react';

const CustomComponent = forwardRef<HTMLDivElement>((props, ref) => (
  <div ref={ref}>Custom</div>
));

function AdvancedExample() {
  return (
    <Waypoint onEnter={() => console.log('entered')}>
      <CustomComponent />
    </Waypoint>
  );
}

export { Example, AdvancedExample };
