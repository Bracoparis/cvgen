import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
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
    {/* Envelopper App avec Suspense */}
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
  </StrictMode>
);
