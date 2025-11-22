/**
 * ============================================
 * INTELLISENSE DEMO - Try this in VS Code!
 * ============================================
 *
 * This file demonstrates the complete IntelliSense
 * support you get with @modern/react-waypoint
 *
 * TRY THIS:
 * 1. Open this file in VS Code
 * 2. Type `<Waypoint ` and press Ctrl+Space
 * 3. See all props with descriptions!
 * 4. Inside callbacks, type `props.` and see autocomplete
 * 5. Hover over any prop to see type information
 */

import { Waypoint, WaypointCallbackProps, POSITIONS } from '../src/index';

// ===============================================
// EXAMPLE 1: Full Type Inference
// ===============================================
function Example1_AutoComplete() {
  return (
    <Waypoint
      // 👆 Try typing here - you'll see ALL props with autocomplete!
      // As you type each letter, IntelliSense narrows down options

      onEnter={(props) => {
        // 👆 Hover over 'props' - it's automatically typed!
        // Try typing 'props.' below to see all available properties

        props.currentPosition;   // Type: 'above' | 'inside' | 'below' | 'invisible'
        props.previousPosition;  // Type: 'above' | 'inside' | 'below' | 'invisible'
        props.event;            // Type: Event | undefined
        props.waypointTop;      // Type: number | undefined
        props.viewportTop;      // Type: number | undefined
        props.viewportBottom;   // Type: number | undefined
      }}

      onLeave={(props) => {
        // Same full type inference here!
        if (props.currentPosition === 'above') {
          console.log('Scrolled past');
        }
      }}

      // Try different offset formats - all are typed!
      topOffset="100px"      // ✅ string
      bottomOffset={50}      // ✅ number

      horizontal={false}     // ✅ boolean

      // Try typing invalid values - TypeScript will catch them!
      // topOffset={true}    // ❌ Error: Type 'boolean' is not assignable
    >
      <div>Content</div>
    </Waypoint>
  );
}


// ===============================================
// EXAMPLE 2: Using Exported Types
// ===============================================
// You can import and use all types for your own code

function Example2_ExportedTypes() {
  // Define your own typed handler
  const handlePositionChange = (props: WaypointCallbackProps) => {
    // Full IntelliSense on props!
    console.log('Current:', props.currentPosition);
    console.log('Previous:', props.previousPosition);
  };

  return (
    <Waypoint
      onPositionChange={handlePositionChange}
      topOffset="20%"
    >
      <div>Lazy loaded content</div>
    </Waypoint>
  );
}


// ===============================================
// EXAMPLE 3: Position Constants
// ===============================================
function Example3_PositionConstants() {
  return (
    <Waypoint
      onPositionChange={(props) => {
        // IntelliSense shows all available POSITIONS constants
        // Try typing 'POSITIONS.' below

        if (props.currentPosition === POSITIONS.inside) {
          console.log('Visible!');
        } else if (props.currentPosition === POSITIONS.above) {
          console.log('Scrolled past');
        } else if (props.currentPosition === POSITIONS.below) {
          console.log('Not yet reached');
        } else if (props.currentPosition === POSITIONS.invisible) {
          console.log('Hidden or zero height');
        }
      }}
    >
      <div>Content</div>
    </Waypoint>
  );
}


// ===============================================
// EXAMPLE 4: Complex Real-World Usage
// ===============================================
import { useState, useCallback } from 'react';

function Example4_RealWorld() {
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  // Fully typed callback with useCallback
  const handleImageEnter = useCallback((imageId: number) => {
    return (props: WaypointCallbackProps) => {
      // IntelliSense works perfectly here!
      if (props.currentPosition === POSITIONS.inside) {
        setImagesLoaded(prev => new Set(Array.from(prev).concat(imageId)));
      }
    };
  }, []);

  return (
    <div>
      {[1, 2, 3, 4, 5].map(id => (
        <Waypoint
          key={id}
          onEnter={handleImageEnter(id)}
          topOffset="-100px"  // Load slightly before visible
        >
          <img
            src={imagesLoaded.has(id) ? `/image-${id}.jpg` : '/placeholder.jpg'}
            alt={`Image ${id}`}
          />
        </Waypoint>
      ))}
    </div>
  );
}


// ===============================================
// EXAMPLE 5: Horizontal Scrolling
// ===============================================
function Example5_HorizontalScroll() {
  return (
    <div style={{ display: 'flex', overflowX: 'auto' }}>
      <Waypoint
        horizontal  // ✅ IntelliSense knows this is boolean
        onEnter={(props) => {
          // Even with horizontal, all props are correctly typed
          console.log('Entered horizontal viewport');
        }}
      >
        <div style={{ minWidth: '300px' }}>
          Horizontal content
        </div>
      </Waypoint>
    </div>
  );
}


// ===============================================
// EXAMPLE 6: Error Prevention
// ===============================================
function Example6_ErrorPrevention() {
  return (
    <Waypoint
      // ✅ These are all valid:
      topOffset="100px"
      bottomOffset="50%"

      // ❌ Try uncommenting these - TypeScript will catch errors:
      // topOffset={true}              // Error: boolean not assignable
      // horizontal="yes"              // Error: string not assignable to boolean
      // scrollableAncestor={123}      // Error: number not assignable
      // onEnter="handleEnter"         // Error: string not assignable to function
    >
      <div>Content</div>
    </Waypoint>
  );
}


// ===============================================
// EXAMPLE 7: JavaScript Users Still Get IntelliSense!
// ===============================================
// Even in .js files (not .ts), VS Code shows:
// - Autocomplete for all props
// - Type information on hover
// - Error warnings for wrong types
//
// This works because of our .d.ts type declaration file!


export {
  Example1_AutoComplete,
  Example2_ExportedTypes,
  Example3_PositionConstants,
  Example4_RealWorld,
  Example5_HorizontalScroll,
  Example6_ErrorPrevention,
};


// ===============================================
// 🎉 BONUS: Try These Yourself!
// ===============================================

// 1. Type '<Waypoint ' and press Ctrl+Space (or Cmd+Space on Mac)
//    → See all available props!

// 2. Inside a callback, type 'props.' and press Ctrl+Space
//    → See all callback properties!

// 3. Type 'POSITIONS.' and press Ctrl+Space
//    → See all position constants!

// 4. Hover over any prop or type
//    → See full type information and documentation!

// 5. Try typing an invalid value
//    → TypeScript immediately shows an error!

// ===============================================
