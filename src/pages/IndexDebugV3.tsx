import { Helmet } from 'react-helmet-async';
import ErrorBoundary from '@/components/ErrorBoundary';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import QuoteShowcaseSection from '@/components/QuoteShowcaseSection';
import VideoSection from '@/components/VideoSection';
import GallerySection from '@/components/GallerySection';
import MeetingScheduler from '@/components/MeetingScheduler';
import Footer from '@/components/Footer';

const IndexDebugV3 = () => {
  return (
    <>
      <Helmet>
        <title>Debug V3 - Error Boundaries</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Info Panel */}
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
          maxWidth: '300px',
          border: '2px solid #00ff00'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#00ff00', fontSize: '16px', fontWeight: 'bold' }}>
            🛡️ Debug V3 - Error Boundaries
          </h3>
          <p style={{ fontSize: '12px', color: '#888' }}>
            Cada componente está envolvido em um Error Boundary.
            Se algum componente quebrar, você verá um box vermelho com o erro específico.
          </p>
        </div>

        {/* Navigation */}
        <ErrorBoundary>
          <Navigation />
        </ErrorBoundary>

        <main>
          {/* Hero */}
          <ErrorBoundary>
            <HeroSection />
          </ErrorBoundary>

          {/* About */}
          <ErrorBoundary>
            <AboutSection />
          </ErrorBoundary>

          {/* Quote */}
          <ErrorBoundary>
            <QuoteShowcaseSection />
          </ErrorBoundary>

          {/* Video */}
          <ErrorBoundary fallback={
            <div style={{
              padding: '40px',
              backgroundColor: '#ff990020',
              border: '2px dashed #ff9900',
              margin: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#ff9900', marginBottom: '10px' }}>⚠️ VideoSection</h3>
              <p style={{ color: '#888' }}>Não há vídeos ou ocorreu um erro ao carregar esta seção</p>
            </div>
          }>
            <VideoSection />
          </ErrorBoundary>

          {/* Gallery */}
          <ErrorBoundary fallback={
            <div style={{
              padding: '40px',
              backgroundColor: '#ff990020',
              border: '2px dashed #ff9900',
              margin: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#ff9900', marginBottom: '10px' }}>⚠️ GallerySection</h3>
              <p style={{ color: '#888' }}>Não há filmes ou ocorreu um erro ao carregar esta seção</p>
            </div>
          }>
            <GallerySection />
          </ErrorBoundary>

          {/* Meeting */}
          <ErrorBoundary>
            <MeetingScheduler />
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default IndexDebugV3;
