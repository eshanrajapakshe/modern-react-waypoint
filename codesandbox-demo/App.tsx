import { useState } from 'react';
import { Waypoint } from '@eshan.rajapakshe/react-waypoint';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [animatedVisible, setAnimatedVisible] = useState(false);
  const [offsetActive, setOffsetActive] = useState(false);
  const [items, setItems] = useState(10);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setItems(prev => prev + 10);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="app">
      {/* Fixed Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <h1>@eshan.rajapakshe/react-waypoint</h1>
          <div className="nav-links">
            <a href="#intro" className={activeSection === 'intro' ? 'active' : ''}>Intro</a>
            <a href="#basic" className={activeSection === 'basic' ? 'active' : ''}>Basic</a>
            <a href="#lazy" className={activeSection === 'lazy' ? 'active' : ''}>Lazy Load</a>
            <a href="#animation" className={activeSection === 'animation' ? 'active' : ''}>Animation</a>
            <a href="#offset" className={activeSection === 'offset' ? 'active' : ''}>Offset</a>
            <a href="#infinite" className={activeSection === 'infinite' ? 'active' : ''}>Infinite</a>
          </div>
        </div>
      </nav>

      {/* Intro Section */}
      <Waypoint
        onEnter={() => setActiveSection('intro')}
        topOffset="100px"
        bottomOffset="100px"
      >
        <section id="intro" className="hero">
          <div className="hero-content">
            <h2>🎯 React Waypoint Demo</h2>
            <p className="subtitle">Scroll down to see waypoints in action!</p>
            <div className="features">
              <div className="feature">
                <span className="icon">⚡</span>
                <h3>Fast</h3>
                <p>IntersectionObserver API</p>
              </div>
              <div className="feature">
                <span className="icon">🎨</span>
                <h3>Flexible</h3>
                <p>Customizable offsets</p>
              </div>
              <div className="feature">
                <span className="icon">📦</span>
                <h3>Lightweight</h3>
                <p>&lt;5KB gzipped</p>
              </div>
            </div>
          </div>
        </section>
      </Waypoint>

      {/* Basic Waypoint */}
      <Waypoint
        onEnter={() => setActiveSection('basic')}
        topOffset="100px"
        bottomOffset="100px"
      >
        <section id="basic" className="demo-section">
          <div className="section-header">
            <h2>1️⃣ Basic Waypoint Detection</h2>
            <p>Detects when element enters/leaves viewport</p>
          </div>

          <div className="demo-content">
            <div className="spacer">👇 Scroll down 👇</div>

            <Waypoint
              onEnter={() => console.log('✅ Basic waypoint ENTERED')}
              onLeave={() => console.log('❌ Basic waypoint LEFT')}
            >
              <div className="trigger-box basic">
                <h3>🎯 Trigger Zone</h3>
                <p>Watch the console when this enters/leaves viewport!</p>
                <code>onEnter / onLeave</code>
              </div>
            </Waypoint>
          </div>
        </section>
      </Waypoint>

      {/* Lazy Loading */}
      <Waypoint
        onEnter={() => setActiveSection('lazy')}
        topOffset="100px"
        bottomOffset="100px"
      >
        <section id="lazy" className="demo-section alt">
          <div className="section-header">
            <h2>2️⃣ Lazy Loading Images</h2>
            <p>Load images only when they become visible</p>
          </div>

          <div className="demo-content">
            <div className="spacer">👇 Scroll to load image 👇</div>

            <Waypoint onEnter={() => setImageLoaded(true)}>
              <div className="image-demo">
                {imageLoaded ? (
                  <div className="image-loaded">
                    <img
                      src="https://picsum.photos/800/500?random=1"
                      alt="Lazy loaded"
                    />
                    <p className="success">✅ Image loaded!</p>
                  </div>
                ) : (
                  <div className="image-placeholder">
                    <div className="spinner"></div>
                    <p>Image will load when visible...</p>
                  </div>
                )}
              </div>
            </Waypoint>
          </div>
        </section>
      </Waypoint>

      {/* Animation on Scroll */}
      <Waypoint
        onEnter={() => setActiveSection('animation')}
        topOffset="100px"
        bottomOffset="100px"
      >
        <section id="animation" className="demo-section">
          <div className="section-header">
            <h2>3️⃣ Scroll Animations</h2>
            <p>Trigger animations when elements enter viewport</p>
          </div>

          <div className="demo-content">
            <div className="spacer">👇 Scroll to animate 👇</div>

            <Waypoint onEnter={() => setAnimatedVisible(true)}>
              <div className={`animated-card ${animatedVisible ? 'visible' : ''}`}>
                <h3>✨ Animated Content</h3>
                <p>This card slides in with a smooth animation!</p>
                <div className="animation-demo">
                  <div className="box box1"></div>
                  <div className="box box2"></div>
                  <div className="box box3"></div>
                </div>
              </div>
            </Waypoint>
          </div>
        </section>
      </Waypoint>

      {/* Offset Detection */}
      <Waypoint
        onEnter={() => setActiveSection('offset')}
        topOffset="100px"
        bottomOffset="100px"
      >
        <section id="offset" className="demo-section alt">
          <div className="section-header">
            <h2>4️⃣ Custom Offsets</h2>
            <p>Trigger waypoints before/after entering viewport</p>
          </div>

          <div className="demo-content">
            <div className="spacer">👇 Triggers 200px early 👇</div>

            <Waypoint
              topOffset="200px"
              bottomOffset="200px"
              onEnter={() => setOffsetActive(true)}
              onLeave={() => setOffsetActive(false)}
            >
              <div className={`trigger-box offset ${offsetActive ? 'active' : ''}`}>
                <h3>⏰ Early Detection</h3>
                <p>This triggers 200px before entering viewport!</p>
                <div className={`status-indicator ${offsetActive ? 'active' : ''}`}>
                  {offsetActive ? '🟢 ACTIVE' : '⚪ INACTIVE'}
                </div>
              </div>
            </Waypoint>
          </div>
        </section>
      </Waypoint>

      {/* Infinite Scroll */}
      <Waypoint
        onEnter={() => setActiveSection('infinite')}
        topOffset="100px"
        bottomOffset="100px"
      >
        <section id="infinite" className="demo-section">
          <div className="section-header">
            <h2>5️⃣ Infinite Scroll</h2>
            <p>Load more content as you scroll</p>
          </div>

          <div className="demo-content">
            <div className="items-grid">
              {Array.from({ length: items }, (_, i) => (
                <div key={i} className="item">
                  <div className="item-number">{i + 1}</div>
                  <p>Item {i + 1}</p>
                </div>
              ))}
            </div>

            <Waypoint onEnter={loadMore}>
              <div className="load-trigger">
                {loading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading more items...</p>
                  </div>
                ) : (
                  <p>🔄 Scroll here to load more</p>
                )}
              </div>
            </Waypoint>
          </div>
        </section>
      </Waypoint>

      {/* Footer */}
      <footer className="footer">
        <p>🎉 End of demo - scroll back up to see navigation update!</p>
        <a href="https://github.com/eshanrajapakshe/modern-react-waypoint" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </footer>
    </div>
  );
}

