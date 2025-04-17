import { JobOffer } from '@/services/jobScraper';

// Fonction pour obtenir le nombre total d'offres d'emploi
export function getTotalJobsCount(): number {
  // Pour l'instant, on retourne une valeur fixe
  // TODO: Implémenter la vraie logique de comptage
  return 15000;
}

// Interface pour les recruteurs
interface Recruiter {
  name: string;
  count: number;
}

// Fonction pour obtenir les meilleurs recruteurs
export function getTopRecruiters(limit: number = 5): Recruiter[] {
  // Pour l'instant, on retourne des données statiques
  // TODO: Implémenter la vraie logique de comptage
  return [
    { name: 'Adecco', count: 1250 },
    { name: 'Manpower', count: 980 },
    { name: 'Randstad', count: 850 },
    { name: 'Synergie', count: 720 },
    { name: 'Proman', count: 680 }
  ].slice(0, limit);
} 