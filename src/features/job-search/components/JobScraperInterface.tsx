import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { JobOffer, searchJobs } from '@/services/jobScraper';
import LoadingSpinner from '@/components/LoadingSpinner';

interface JobScraperInterfaceProps {
  defaultCity?: string;
  onResultsLoaded: (jobs: JobOffer[]) => void;
}

export const JobScraperInterface: React.FC<JobScraperInterfaceProps> = ({
  defaultCity = 'paris',
  onResultsLoaded
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStartScraping = async () => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      // Lancer la recherche d'offres
      const jobs = await searchJobs(defaultCity, '');
      onResultsLoaded(jobs);
      setProgress(100);
    } catch (error) {
      console.error('Erreur lors du scraping:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={handleStartScraping}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <LoadingSpinner size="small" className="mr-2" />
          ) : null}
          {isLoading ? 'Récupération en cours...' : 'Lancer la récupération'}
        </Button>
        
        {isLoading && (
          <div className="text-sm text-gray-600">
            {progress}% complété
          </div>
        )}
      </div>

      {isLoading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}; 