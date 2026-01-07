import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import QuoteShowcaseSection from '@/components/QuoteShowcaseSection';
import VideoSection from '@/components/VideoSection';
import GallerySection from '@/components/GallerySection';
import MeetingScheduler from '@/components/MeetingScheduler';
import Footer from '@/components/Footer';

const IndexDebugV2 = () => {
  const [activeComponents, setActiveComponents] = useState({
    navigation: true,
    hero: false,
    about: false,
    quote: false,
    video: false,
    gallery: false,
    meeting: false,
    footer: false,
  });

  const toggleComponent = (name: keyof typeof activeComponents) => {
    setActiveComponents(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      <Helmet>
        <title>Debug Mode V2 - Homepage</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Debug Panel */}
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
          backgroundColor: '#2a2a2a',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '14px',
          maxWidth: '250px',
          border: '2px solid #f59e0b'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#f59e0b', fontSize: '16px', fontWeight: 'bold' }}>
            🔍 Debug Panel V2
          </h3>
          <p style={{ fontSize: '12px', marginBottom: '10px', color: '#888' }}>
            Toggle components on/off to find which one is breaking:
          </p>
          {Object.entries(activeComponents).map(([name, active]) => (
            <label key={name} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggleComponent(name as keyof typeof activeComponents)}
                style={{ marginRight: '8px' }}
              />
              {name.charAt(0).toUpperCase() + name.slice(1)}
              {active ? ' ✅' : ' ⬜'}
            </label>
          ))}

          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #444' }}>
            <p style={{ fontSize: '11px', color: '#666' }}>
              Componentes com borda colorida estão ativos
            </p>
          </div>
        </div>

        {/* Components */}
        {activeComponents.navigation && (
          <div style={{ border: '2px solid green', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              backgroundColor: 'green',
              color: 'white',
              padding: '2px 8px',
              fontSize: '12px',
              borderRadius: '3px',
              zIndex: 100
            }}>
              Navigation
            </div>
            <Navigation />
          </div>
        )}

        <main>
          {activeComponents.hero && (
            <div style={{ border: '2px solid blue', minHeight: '100px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                backgroundColor: 'blue',
                color: 'white',
                padding: '2px 8px',
                fontSize: '12px',
                borderRadius: '3px',
                zIndex: 100
              }}>
                Hero
              </div>
              <HeroSection />
            </div>
          )}

          {activeComponents.about && (
            <div style={{ border: '2px solid purple', minHeight: '100px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                backgroundColor: 'purple',
                color: 'white',
                padding: '2px 8px',
                fontSize: '12px',
                borderRadius: '3px',
                zIndex: 100
              }}>
                About
              </div>
              <AboutSection />
            </div>
          )}

          {activeComponents.quote && (
            <div style={{ border: '2px solid orange', minHeight: '100px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                backgroundColor: 'orange',
                color: 'black',
                padding: '2px 8px',
                fontSize: '12px',
                borderRadius: '3px',
                zIndex: 100
              }}>
                Quote
              </div>
              <QuoteShowcaseSection />
            </div>
          )}

          {activeComponents.video && (
            <div style={{ border: '2px solid red', minHeight: '100px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                backgroundColor: 'red',
                color: 'white',
                padding: '2px 8px',
                fontSize: '12px',
                borderRadius: '3px',
                zIndex: 100
              }}>
                Video (pode estar vazio)
              </div>
              <VideoSection />
            </div>
          )}

          {activeComponents.gallery && (
            <div style={{ border: '2px solid cyan', minHeight: '100px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                backgroundColor: 'cyan',
                color: 'black',
                padding: '2px 8px',
                fontSize: '12px',
                borderRadius: '3px',
                zIndex: 100
              }}>
                Gallery (pode estar vazio)
              </div>
              <GallerySection />
            </div>
          )}

          {activeComponents.meeting && (
            <div style={{ border: '2px solid yellow', minHeight: '100px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                backgroundColor: 'yellow',
                color: 'black',
                padding: '2px 8px',
                fontSize: '12px',
                borderRadius: '3px',
                zIndex: 100
              }}>
                Meeting Scheduler
              </div>
              <MeetingScheduler />
            </div>
          )}
        </main>

        {activeComponents.footer && (
          <div style={{ border: '2px solid pink', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              backgroundColor: 'pink',
              color: 'black',
              padding: '2px 8px',
              fontSize: '12px',
              borderRadius: '3px',
              zIndex: 100
            }}>
              Footer
            </div>
            <Footer />
          </div>
        )}
      </div>
    </>
  );
};

export default IndexDebugV2;
