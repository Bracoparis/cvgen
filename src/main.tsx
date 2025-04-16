import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import FormationPage from './pages/FormationPage';
import OffresEmploiPage from './pages/OffresEmploiPage';
import './index.css';

// Importer la configuration i18n
import './i18n';

// Composant de chargement simple
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    Loading translations...
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Envelopper App avec Suspense et BrowserRouter */}
    <Suspense fallback={<LoadingFallback />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/formation" element={<FormationPage />} />
          <Route path="/offres-emploi" element={<OffresEmploiPage />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </StrictMode>
);
