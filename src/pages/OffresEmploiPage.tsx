import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, ArrowLeft, Building, MapPin, Briefcase, Calendar, Euro } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { JobOffer, searchJobs, getJobDetails } from '@/services/jobScraper';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import JobScraperWithAutomation from '@/components/JobScraperWithAutomation';
import { getTotalJobsCount, getTopRecruiters } from '@/data/databaseStats';

interface SearchFormData {
  ville: string;
  poste: string;
}

const OffresEmploiPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SearchFormData>({
    ville: '',
    poste: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<JobOffer[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Charger automatiquement les offres au démarrage
  useEffect(() => {
    const loadInitialJobs = async () => {
      try {
        const jobs = await searchJobs('paris', '');
        setResults(jobs);
        setHasSearched(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur au chargement initial des offres:", error);
        setIsLoading(false);
      }
    };
    
    loadInitialJobs();
  }, []);

  const handleResultsFromAutomation = (jobs: JobOffer[]) => {
    setResults(jobs);
    setHasSearched(true);
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const jobs = await searchJobs(formData.ville || 'paris', formData.poste);
      setResults(jobs);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobDetails = async (jobId: string) => {
    setIsLoadingDetails(true);
    setIsDialogOpen(true);
    
    try {
      const details = await getJobDetails(jobId);
      setSelectedJob(details);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedJob(null);
  };

  const handlePostuler = (job: JobOffer) => {
    // Construire l'URL de recherche HelloWork avec le titre du poste
    const searchQuery = encodeURIComponent(job.title.replace(' H/F', '').trim());
    const helloWorkSearchUrl = `https://www.hellowork.com/fr-fr/emploi/recherche.html?k=${searchQuery}`;
    
    // Ouvrir l'URL dans un nouvel onglet
    window.open(helloWorkSearchUrl, '_blank');
  };

  // Statistiques de la base de données
  const totalJobsCount = getTotalJobsCount();
  const topRecruiters = getTopRecruiters(5);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="flex items-center mb-8">
          <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Offres d'emploi</h1>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rechercher des offres d'intérim</CardTitle>
            <CardDescription>
              Trouvez les meilleures opportunités correspondant à vos compétences et à votre localisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="ville" 
                      name="ville" 
                      placeholder="Paris, Lyon, Marseille..." 
                      className="pl-10"
                      value={formData.ville}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="poste">Poste recherché</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="poste" 
                      name="poste" 
                      placeholder="Développeur, Assistant, Chef de projet..." 
                      className="pl-10"
                      value={formData.poste}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {!isLoading && !hasSearched && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Base de données d'offres d'intérim</CardTitle>
                <CardDescription>
                  Nous avons récupéré {totalJobsCount.toLocaleString()} offres d'intérim directement depuis HelloWork
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Top 5 des recruteurs en intérim</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {topRecruiters.map((recruiter, index) => (
                        <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full mr-3 text-blue-700 font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{recruiter.name}</p>
                            <p className="text-sm text-gray-600">{recruiter.count} offres</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-blue-600 font-medium">
                      Notre base de données est constamment mise à jour avec les dernières offres d'intérim
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="large" text="Recherche des meilleures offres d'emploi..." />
          </div>
        ) : (
          <>
            {!hasSearched && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-md">Récupération de toutes les offres d'intérim</CardTitle>
                </CardHeader>
                <CardContent>
                  <JobScraperWithAutomation 
                    defaultCity="paris"
                    onResultsLoaded={handleResultsFromAutomation}
                  />
                </CardContent>
              </Card>
            )}
            
            {hasSearched && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">
                  {results.length} offre(s) d'intérim trouvée(s)
                  {formData.ville && ` à ${formData.ville}`}
                  {formData.poste && ` pour "${formData.poste}"`}
                </h2>
                <p className="text-gray-600">
                  Offres d'emploi des 3 derniers mois issues directement de HelloWork, correspondant à votre profil et votre CV
                </p>
                <p className="text-green-600 mt-2 font-medium">
                  Base de données complète avec plusieurs milliers d'offres réelles récupérées de HelloWork
                </p>
              </div>
            )}

            <div className="space-y-4">
              {results.map(job => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-blue-700">{job.title}</CardTitle>
                        <div className="flex flex-wrap items-center text-gray-600 mt-1 gap-3">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>{job.location}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center">
                              <Euro className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span>{job.salary}</span>
                            </div>
                          )}
                          {job.duration && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span>Durée: {job.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {job.postedAt && (
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                          {job.postedAt}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{job.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-3 pt-0">
                    <Button 
                      variant="outline" 
                      onClick={() => handleJobDetails(job.id)}
                    >
                      Voir les détails
                    </Button>
                    <Button 
                      onClick={() => handlePostuler(job)}
                    >
                      Postuler
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {hasSearched && results.length === 0 && !isLoading && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-lg text-gray-700">
                  Aucune offre ne correspond à votre recherche.
                </p>
                <p className="mt-2 text-gray-600">
                  Essayez d'élargir vos critères de recherche ou de revenir plus tard.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedJob?.title || 'Détails de l\'offre'}
            </DialogTitle>
            <DialogDescription>
              {selectedJob ? (
                <div className="flex flex-wrap items-center text-sm gap-3 mt-1">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{selectedJob.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{selectedJob.location}</span>
                  </div>
                  {selectedJob.contractType && (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>{selectedJob.contractType}</span>
                    </div>
                  )}
                </div>
              ) : 'Chargement des détails...'}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 mt-4">
            {isLoadingDetails ? (
              <div className="flex justify-center p-8">
                <LoadingSpinner size="medium" text="Chargement des détails..." />
              </div>
            ) : (
              <div className="space-y-4 p-1">
                <div>
                  <h3 className="font-semibold mb-1">Description du poste</h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedJob?.description}</p>
                </div>
                
                {selectedJob?.salary && (
                  <div>
                    <h3 className="font-semibold mb-1">Rémunération</h3>
                    <p className="text-gray-700">{selectedJob.salary}</p>
                  </div>
                )}
                
                {selectedJob?.duration && (
                  <div>
                    <h3 className="font-semibold mb-1">Durée</h3>
                    <p className="text-gray-700">{selectedJob.duration}</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeDialog}>Fermer</Button>
            {selectedJob && (
              <Button onClick={() => handlePostuler(selectedJob)}>
                Postuler
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OffresEmploiPage; 