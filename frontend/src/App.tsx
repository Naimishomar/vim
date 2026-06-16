import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Registry from './pages/Registry';
import VideoCall from './pages/VideoCall';
import GlobalChat from './pages/GlobalChat';
import OAuthCallback from './pages/OAuthCallback';
import Lobby from './pages/Lobby';
import Terms from './pages/Terms';
import Contact from './pages/Contact';

import OnboardingModal from './components/OnboardingModal';
import { ReactLenis } from 'lenis/react';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ReactLenis root>
      <Router>
        <OnboardingModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/chat" element={<GlobalChat />} />
          <Route path="/mcp" element={<Registry />} />
          <Route path="/setup/:type" element={<Lobby />} />
          <Route path="/call" element={<VideoCall />} />
          <Route path="/call/video" element={<VideoCall />} />
          <Route path="/call/audio" element={<VideoCall />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </ReactLenis>
  );
}

export default App;
