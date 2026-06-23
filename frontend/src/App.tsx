import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Registry from './pages/Registry';
import VideoCall from './pages/VideoCall';
import GlobalChat from './pages/GlobalChat';
import OAuthCallback from './pages/OAuthCallback';
import Lobby from './pages/Lobby';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Groups from './pages/Groups';
import GroupChat from './pages/GroupChat';
import OmegleAlternative from './pages/OmegleAlternative';
import OmeTvAlternative from './pages/OmeTvAlternative';
import ChatrouletteAlternative from './pages/ChatrouletteAlternative';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

import OnboardingModal from './components/OnboardingModal';
import { ReactLenis } from 'lenis/react';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useAuthStore } from './store/useAuthStore';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <HelmetProvider>
      <ReactLenis root>
      <Router>
        <ScrollToTop />
        <OnboardingModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/chat" element={<GlobalChat />} />
          <Route path="/groups" element={<Groups />}>
            <Route path=":roomId" element={<GroupChat />} />
          </Route>
          <Route path="/mcp" element={<Registry />} />
          <Route path="/setup/:type" element={<Lobby />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/call" element={<VideoCall />} />
          <Route path="/call/video" element={<VideoCall />} />
          <Route path="/call/audio" element={<VideoCall />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/omegle-alternative" element={<OmegleAlternative />} />
          <Route path="/ometv-alternative" element={<OmeTvAlternative />} />
          <Route path="/chatroulette-alternative" element={<ChatrouletteAlternative />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </Router>
      </ReactLenis>
    </HelmetProvider>
  );
}

export default App;
