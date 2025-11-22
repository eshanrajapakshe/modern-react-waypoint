import { useState } from 'react';
import { Waypoint } from '@modern/react-waypoint';

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [section2Visible, setSection2Visible] = useState(false);
  const [section3Visible, setSection3Visible] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 10));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>@modern/react-waypoint Demo</h1>
        <p>Scroll down to see the Waypoint component in action!</p>
      </header>

      <div className="log-panel">
        <h3>Event Log (last 10 events)</h3>
        <div className="logs">
          {logs.length === 0 ? (
            <div className="log-empty">Start scrolling to see events...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="log-entry">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="content">
        {/* Section 1: Basic Usage */}
        <section className="section">
          <h2>1. Basic Waypoint</h2>
          <p>Scroll down to trigger the waypoint below:</p>
          <div className="spacer" />
          
          <Waypoint
            onEnter={() => addLog('✅ Section 1 entered viewport')}
            onLeave={() => addLog('❌ Section 1 left viewport')}
          >
            <div className="waypoint-box">
              <h3>🎯 Waypoint Trigger Zone</h3>
              <p>This box triggers callbacks when entering/leaving viewport</p>
            </div>
          </Waypoint>
        </section>

        {/* Section 2: Lazy Loading Image */}
        <section className="section">
          <h2>2. Lazy Loading Image</h2>
          <p>Image loads only when you scroll to it:</p>
          <div className="spacer" />
          
          <Waypoint
            onEnter={() => {
              addLog('📸 Image waypoint entered - loading image');
              setImageLoaded(true);
            }}
          >
            <div className="image-container">
              {imageLoaded ? (
                <img
                  src="https://picsum.photos/600/400"
                  alt="Lazy loaded"
                  className="lazy-image"
                />
              ) : (
                <div className="image-placeholder">
                  <p>🖼️ Image will load when visible...</p>
                </div>
              )}
            </div>
          </Waypoint>
        </section>

        {/* Section 3: Animation on Scroll */}
        <section className="section">
          <h2>3. Animation on Scroll</h2>
          <p>Content animates when entering viewport:</p>
          <div className="spacer" />
          
          <Waypoint
            onEnter={() => {
              addLog('🎬 Animation triggered');
              setSection2Visible(true);
            }}
          >
            <div className={`animated-box ${section2Visible ? 'visible' : ''}`}>
              <h3>✨ Animated Content</h3>
              <p>This box slides in when you scroll to it!</p>
            </div>
          </Waypoint>
        </section>

        {/* Section 4: With Offsets */}
        <section className="section">
          <h2>4. Waypoint with Offsets</h2>
          <p>Triggers 100px before entering viewport:</p>
          <div className="spacer" />
          
          <Waypoint
            topOffset="100px"
            bottomOffset="100px"
            onEnter={() => {
              addLog('⚡ Early trigger (100px offset)');
              setSection3Visible(true);
            }}
            onLeave={() => setSection3Visible(false)}
          >
            <div className={`waypoint-box ${section3Visible ? 'active' : ''}`}>
              <h3>⏰ Early Detection Zone</h3>
              <p>Triggered 100px before entering viewport</p>
              <p className="status">
                Status: {section3Visible ? '🟢 Active' : '⚪ Inactive'}
              </p>
            </div>
          </Waypoint>
        </section>

        {/* Section 5: Infinite Scroll Simulation */}
        <section className="section">
          <h2>5. Infinite Scroll Trigger</h2>
          <p>Simulates loading more content:</p>
          <div className="spacer" />
          
          <Waypoint
            onEnter={() => addLog('📦 Load more content triggered')}
          >
            <div className="load-more-trigger">
              <p>🔄 Scroll here to load more items...</p>
            </div>
          </Waypoint>
        </section>

        <div className="footer">
          <p>End of demo - scroll back up to see events again!</p>
        </div>
      </div>
    </div>
  );
}

