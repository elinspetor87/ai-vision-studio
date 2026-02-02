import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import QuoteShowcaseSection from '@/components/QuoteShowcaseSection';
import VideoSection from '@/components/VideoSection';
import ProjectsSection from '@/components/ProjectsSection';
import GallerySection from '@/components/GallerySection';
import MeetingScheduler from '@/components/MeetingScheduler';
import Footer from '@/components/Footer';

const Index = () => {
  // MODO DE DEBUG TEMPORÁRIO - Comentando componentes para identificar o problema
  const DEBUG_MODE = false;

  if (DEBUG_MODE) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '40px'
      }}>
        <h1 style={{ fontSize: '48px', color: '#f59e0b', marginBottom: '20px' }}>
          🔍 DEBUG MODE ATIVO
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          A homepage está em modo debug. Vou carregar os componentes um por um para identificar qual está quebrando.
        </p>

        <div style={{ marginTop: '40px' }}>
          <h2 style={{ color: '#f59e0b', marginBottom: '10px' }}>Status dos Componentes:</h2>
          <ul style={{ fontSize: '16px', lineHeight: '2' }}>
            <li>✅ React está funcionando</li>
            <li>✅ Routing está funcionando</li>
            <li>⏳ Testando componentes...</li>
          </ul>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '10px', color: '#00ff00' }}>✅ Navigation</h3>
          <Navigation />
        </div>

        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '10px', color: '#00ff00' }}>⏳ Testando HeroSection...</h3>
          <HeroSection />
        </div>

        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '10px', color: '#00ff00' }}>Status:</h3>
          <p>Se você vê isso, Hero também está OK! Vou adicionar AboutSection...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>AI Filmmaker Freelancer | Felipe Almeida | Visual Director</title>
        <meta
          name="description"
          content="Hire Felipe Almeida, a top-tier AI Filmmaker Freelancer and Visual Director. Expert in AI video production, VFX, and cinematic storytelling for commercials, music videos, and films."
        />
        <meta name="keywords" content="AI Filmmaker Freelancer, Freelance AI Video Artist, Hire AI Video Editor, AI Music Video Director, Felipe Almeida, VFX Artist, Midjourney, Gen-3 Alpha, Kling AI, ComfyUI" />
        <link rel="canonical" href="https://www.felipealmeida.studio/" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <QuoteShowcaseSection />
          <VideoSection />
          <ProjectsSection />
          <GallerySection />
          <MeetingScheduler />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
