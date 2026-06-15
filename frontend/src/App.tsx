import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Registry from './pages/Registry';
import VideoCall from './pages/VideoCall';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mcp" element={<Registry />} />
        <Route path="/call" element={<VideoCall />} />
        <Route path="/call/video" element={<VideoCall />} />
        <Route path="/call/audio" element={<VideoCall />} />
      </Routes>
    </Router>
  );
}

export default App;
