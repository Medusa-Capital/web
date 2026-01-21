import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import TrackRecord from './TrackRecord';

export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/track-record" element={<TrackRecord />} />
      </Routes>
    </BrowserRouter>
  );
}
