import { Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog';
import Player from './pages/Player';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalog />} />
      <Route path="/watch/:id" element={<Player />} />
    </Routes>
  );
}