import React, { useEffect, useState } from 'react';
import { JobOffer, scrapeHelloWorkJobs } from '@/services/jobScraper';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';

interface JobScraperWithAutomationProps {
  defaultCity?: string;
  onResultsLoaded?: (jobs: JobOffer[]) => void;
}

/**
 * Composant qui gère la recherche d'offres d'emploi avec automatisation
 * pour fermer les popups comme "Créez une alerte" sur HelloWork
 */
const JobScraperWithAutomation: React.FC<JobScraperWithAutomationProps> = ({ 
  defaultCity = 'paris',
  onResultsLoaded 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [completedPages, setCompletedPages] = useState(0);

  // Lancer automatiquement le scraping dès le chargement du composant
  useEffect(() => {
    startScraping();
  }, []);

  // Écouteur pour les messages de progression du scraping
  useEffect(() => {
    const progressListener = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.type === 'scraping-progress') {
          setProgress(customEvent.detail.message);
        } else if (customEvent.detail.type === 'scraping-page-complete') {
          setCompletedPages(prev => prev + 1);
        }
      }
    };

    // Écouter l'événement personnalisé pour la progression
    window.addEventListener('scraping-progress', progressListener);
    
    return () => {
      window.removeEventListener('scraping-progress', progressListener);
    };
  }, []);

  const startScraping = async () => {
    setIsLoading(true);
    setError(null);
    setProgress('Initialisation du chargement des offres d\'intérim...');
    setCompletedPages(0);
    
    try {
      // Événement personnalisé pour suivre la progression
      const customEvent = new CustomEvent('scraping-progress', {
        detail: { 
          type: 'scraping-progress',
          message: 'Recherche des offres d\'intérim récentes (< 3 mois) dans toute la France...'
        }
      });
      window.dispatchEvent(customEvent);
      
      // Récupération des offres
      const jobs = await scrapeHelloWorkJobs(defaultCity);
      
      // Notification au parent
      if (onResultsLoaded) {
        onResultsLoaded(jobs);
      }
      
      setProgress(`Récupération terminée! ${jobs.length} offres d'intérim des 3 derniers mois trouvées.`);
    } catch (error) {
      console.error('Erreur lors du scraping automatisé:', error);
      setError('Une erreur est survenue lors de la récupération des offres.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-blue-800 font-medium mb-2">Récupération de TOUTES les offres d'intérim</h3>
        <p className="text-sm text-blue-700 mb-4">
          Notre système va récupérer toutes les offres d'intérim des 3 derniers mois disponibles sur HelloWork.
          Cette opération peut prendre un peu de temps car nous analysons plusieurs pages de résultats.
        </p>
        
        {isLoading ? (
          <div className="space-y-2">
            <LoadingSpinner size="small" />
            <div className="text-sm text-blue-800">
              {progress}
              {completedPages > 0 && (
                <span className="ml-2 bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                  {completedPages} page{completedPages > 1 ? 's' : ''} analysée{completedPages > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        ) : (
          <Button onClick={startScraping} className="mt-2 bg-blue-600 hover:bg-blue-700">
            Charger TOUTES les offres d'intérim
          </Button>
        )}
        
        {error && (
          <div className="mt-2 text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobScraperWithAutomation; 