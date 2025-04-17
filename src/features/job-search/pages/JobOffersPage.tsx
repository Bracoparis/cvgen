/**
 * Page de recherche d'offres d'emploi
 * 
 * Cette page permet de rechercher des offres d'emploi en intérim
 * en utilisant différents critères comme la ville et le poste.
 * Elle affiche les résultats sous forme de cartes et permet de
 * consulter les détails d'une offre dans une modale.
 */

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
import { JobScraperInterface } from '@/features/job-search/components/JobScraperInterface';
import { getTotalJobsCount, getTopRecruiters } from '@/features/job-search/data/database-stats';

interface Recruiter {
  name: string;
  count: number;
}

/**
 * Interface pour les données du formulaire de recherche
 */
interface JobSearchFormData {
  city: string;
  jobTitle: string;
}

/**
 * Composant principal de la page des offres d'emploi
 */
const JobOffersPage: React.FC = () => {
  const navigate = useNavigate();
  
  // État du formulaire de recherche
  const [formData, setFormData] = useState<JobSearchFormData>({
    city: '',
    jobTitle: ''
  });
  
  // États pour la gestion des offres et du chargement
  const [isLoading, setIsLoading] = useState(true);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // États pour le dialogue de détails
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Chargement initial des offres d'emploi
  useEffect(() => {
    const loadInitialJobs = async () => {
      try {
        const jobs = await searchJobs('paris', '');
        setJobOffers(jobs);
        setHasSearched(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur au chargement initial des offres:", error);
        setIsLoading(false);
      }
    };
    
    loadInitialJobs();
  }, []);

  /**
   * Gestion des résultats de l'automatisation du scraping
   */
  const handleJobsFromAutomation = (jobs: JobOffer[]) => {
    setJobOffers(jobs);
    setHasSearched(true);
    setIsLoading(false);
  };

  /**
   * Mise à jour du formulaire de recherche
   */
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Soumission du formulaire de recherche
   */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const jobs = await searchJobs(formData.city || 'paris', formData.jobTitle);
      setJobOffers(jobs);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Affichage des détails d'une offre
   */
  const handleViewJobDetails = async (jobId: string) => {
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

  /**
   * Fermeture de la modale de détails
   */
  const closeJobDetailsDialog = () => {
    setIsDialogOpen(false);
    setSelectedJob(null);
  };

  /**
   * Redirection vers HelloWork pour postuler
   */
  const handleApplyForJob = (job: JobOffer) => {
    // Construire l'URL de recherche HelloWork avec le titre du poste
    const searchQuery = encodeURIComponent(job.title.replace(' H/F', '').trim());
    const helloWorkSearchUrl = `https://www.hellowork.com/fr-fr/emploi/recherche.html?k=${searchQuery}`;
    
    // Ouvrir l'URL dans un nouvel onglet
    window.open(helloWorkSearchUrl, '_blank');
  };

  // Statistiques de la base de données
  const totalJobsCount = getTotalJobsCount();
  const topRecruiters = getTopRecruiters(5);

  // Fonction de rendu des recruteurs avec types explicites
  const renderRecruiters = (recruiters: Recruiter[], index: number) => {
    return (
      <div key={index} className="flex flex-col gap-2">
        {recruiters.map((recruiter: Recruiter) => (
          <div key={recruiter.name} className="flex justify-between items-center">
            <span>{recruiter.name}</span>
            <span className="text-gray-500">{recruiter.count} offres</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Bouton de retour */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        {/* Titre de la page */}
        <div className="flex items-center mb-8">
          <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Offres d'emploi</h1>
        </div>

        {/* Formulaire de recherche */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rechercher des offres d'intérim</CardTitle>
            <CardDescription>
              Trouvez les meilleures opportunités correspondant à vos compétences et à votre localisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Champ Ville */}
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="city" 
                      name="city" 
                      placeholder="Ex: Paris, Lyon, Marseille..." 
                      className="pl-10"
                      value={formData.city}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                {/* Champ Poste */}
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Poste recherché</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="jobTitle" 
                      name="jobTitle" 
                      placeholder="Ex: Développeur, Assistant, Chef de projet..." 
                      className="pl-10"
                      value={formData.jobTitle}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* Bouton Rechercher */}
              <div className="flex items-center justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Statistiques (affiché seulement avant la recherche) */}
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
                  {/* Top recruteurs */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Top 5 des recruteurs en intérim</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderRecruiters(topRecruiters, 0)}
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

        {/* Affichage du chargement ou des résultats */}
        {isLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="large" text="Recherche des meilleures offres d'emploi..." />
          </div>
        ) : (
          <>
            {/* Interface de Scraping (affiché seulement avant la recherche) */}
            {!hasSearched && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-md">Récupération de toutes les offres d'intérim</CardTitle>
                </CardHeader>
                <CardContent>
                  <JobScraperInterface 
                    defaultCity="paris"
                    onResultsLoaded={handleJobsFromAutomation}
                  />
                </CardContent>
              </Card>
            )}
            
            {/* En-tête des résultats */}
            {hasSearched && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">
                  {jobOffers.length} offre(s) d'intérim trouvée(s)
                  {formData.city && ` à ${formData.city}`}
                  {formData.jobTitle && ` pour "${formData.jobTitle}"`}
                </h2>
                <p className="text-gray-600">
                  Offres d'emploi des 3 derniers mois issues directement de HelloWork, correspondant à votre profil et votre CV
                </p>
                <p className="text-green-600 mt-2 font-medium">
                  Base de données complète avec plusieurs milliers d'offres réelles récupérées de HelloWork
                </p>
              </div>
            )}

            {/* Liste des offres d'emploi */}
            <div className="space-y-4">
              {jobOffers.map(job => (
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
                      onClick={() => handleViewJobDetails(job.id)}
                    >
                      Voir les détails
                    </Button>
                    <Button 
                      onClick={() => handleApplyForJob(job)}
                    >
                      Postuler
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Message si aucun résultat */}
            {hasSearched && jobOffers.length === 0 && !isLoading && (
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

      {/* Dialogue de détails d'offre */}
      <Dialog open={isDialogOpen} onOpenChange={closeJobDetailsDialog}>
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
            <Button variant="outline" onClick={closeJobDetailsDialog}>Fermer</Button>
            {selectedJob && (
              <Button onClick={() => handleApplyForJob(selectedJob)}>
                Postuler
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobOffersPage; 