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

const IndexDebug = () => {
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
        <title>Debug Mode - Homepage</title>
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
            🔍 Debug Panel
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
        </div>

        {/* Components */}
        {activeComponents.navigation && (
          <div style={{ border: '2px solid green' }}>
            <Navigation />
          </div>
        )}

        <main>
          {activeComponents.hero && (
            <div style={{ border: '2px solid blue', minHeight: '100px' }}>
              <HeroSection />
            </div>
          )}

          {activeComponents.about && (
            <div style={{ border: '2px solid purple', minHeight: '100px' }}>
              <AboutSection />
            </div>
          )}

          {activeComponents.quote && (
            <div style={{ border: '2px solid orange', minHeight: '100px' }}>
              <QuoteShowcaseSection />
            </div>
          )}

          {activeComponents.video && (
            <div style={{ border: '2px solid red', minHeight: '100px' }}>
              <VideoSection />
            </div>
          )}

          {activeComponents.gallery && (
            <div style={{ border: '2px solid cyan', minHeight: '100px' }}>
              <GallerySection />
            </div>
          )}

          {activeComponents.meeting && (
            <div style={{ border: '2px solid yellow', minHeight: '100px' }}>
              <MeetingScheduler />
            </div>
          )}
        </main>

        {activeComponents.footer && (
          <div style={{ border: '2px solid pink' }}>
            <Footer />
          </div>
        )}
      </div>
    </>
  );
};

export default IndexDebug;
