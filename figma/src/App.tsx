import Component1920WLight, { Footer } from "./imports/1920WLight";
import { BackgroundEffects } from "./components/VisualEffects";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TrackRecord from './TrackRecord';
import Colaboradores from './Colaboradores';
import Blog from './Blog';
import ArticlePage from './ArticlePage';

export default function App() {
  return (
    <BrowserRouter basename="/figma">
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen w-full bg-[#010052] relative">
            {/* Efectos de fondo globales */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <BackgroundEffects />
            </div>

            <div className="relative z-10">
              <Component1920WLight />

              {/* Footer */}
              <Footer />
            </div>
          </div>
        } />
        <Route path="/track-record" element={<TrackRecord />} />
        <Route path="/colaboradores" element={<Colaboradores />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}
