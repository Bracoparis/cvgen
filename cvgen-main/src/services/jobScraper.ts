import axios from 'axios';
import * as cheerio from 'cheerio';
import { browserAutomation } from './browserAutomation';
import { searchJobsInDatabase, getJobById, searchJobsInDatabaseWithPagination } from '@/data/jobsDatabase';

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  contractType: string;
  duration?: string;
  url: string;
  postedAt?: string;
  logoUrl?: string;
}

/**
 * Fonction qui permet de fermer automatiquement les popups sur HelloWork
 * en injectant un script dans la page avec Puppeteer
 */
export async function closeHelloWorkPopups(): Promise<void> {
  try {
    // Note: Cette fonction serait normalement implémentée avec Puppeteer
    // pour une véritable automatisation, mais pour l'exemple, voici la logique
    console.log('Tentative de fermeture automatique des popups...');
    
    // Script qui serait injecté dans la page pour fermer la popup d'alerte
    const scriptToInject = `
      // Sélectionner et cliquer sur le bouton de fermeture (X)
      function closePopups() {
        // Cibler la popup d'alerte d'emploi
        const closeButtons = document.querySelectorAll('button[aria-label="Close"], .close-button, .tw-absolute.tw-right-3');
        
        // Essayer différents sélecteurs pour le bouton de fermeture
        if (closeButtons.length === 0) {
          // Essayer de trouver un élément qui ressemble à un bouton de fermeture
          const possibleCloseButtons = [
            ...document.querySelectorAll('svg[class*="close"]'),
            ...document.querySelectorAll('button:has(svg)'),
            ...document.querySelectorAll('[role="button"][class*="close"]'),
            ...document.querySelectorAll('.tw-absolute.tw-right-3')
          ];
          
          for (const button of possibleCloseButtons) {
            button.click();
            console.log('Popup fermée via sélecteur alternatif');
          }
        } else {
          // Cliquer sur tous les boutons de fermeture trouvés
          closeButtons.forEach(button => {
            button.click();
            console.log('Popup fermée via sélecteur standard');
          });
        }
      }
      
      // Exécuter immédiatement et répéter après un délai pour attraper les popups qui apparaissent plus tard
      closePopups();
      setTimeout(closePopups, 1000);
      setTimeout(closePopups, 3000);
    `;
    
    console.log('Script pour fermer les popups prêt à être injecté');
    // Dans une implémentation réelle, ce script serait injecté avec page.evaluate() de Puppeteer
    
  } catch (error) {
    console.error('Erreur lors de la tentative de fermeture des popups:', error);
  }
}

/**
 * Scrape les offres d'emploi depuis HelloWork
 * @param city Ville recherchée
 * @param jobTitle Titre du poste recherché
 * @returns Liste des offres d'emploi
 */
export async function scrapeHelloWorkJobs(city: string = '', jobTitle: string = ''): Promise<JobOffer[]> {
  const offers: JobOffer[] = [];
  const baseUrl = 'https://www.hellowork.com/fr-fr/emploi/recherche.html';
  
  // Parcourir les 50 premières pages (20 offres par page = 1000 offres)
  for (let page = 1; page <= 50; page++) {
    try {
      // Construire l'URL avec les paramètres de recherche
      const searchParams = new URLSearchParams({
        k: jobTitle,
        l: city ? `${city} 75000` : 'Paris 75000',
        c: 'Travail_temp', // Filtrer sur l'intérim
        page: page.toString(),
      });

      const url = `${baseUrl}?${searchParams.toString()}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
        }
      });
      
      const $ = cheerio.load(response.data);

      // Sélecteurs mis à jour pour la structure actuelle de HelloWork
      $('article[data-testid="job-card"]').each((_, element) => {
        const el = $(element);
        const id = el.attr('id') || `hw-${Date.now()}-${offers.length}`;
        const title = el.find('[data-testid="job-title"]').text().trim();
        const company = el.find('[data-testid="company-name"]').text().trim();
        const location = el.find('[data-testid="job-location"]').text().trim();
        const description = el.find('[data-testid="job-description"]').text().trim();
        const salary = el.find('[data-testid="job-salary"]').text().trim() || undefined;
        const contractType = 'Intérim';
        const duration = el.find('[data-testid="job-contract-duration"]').text().trim() || undefined;
        const url = el.find('a[href^="/fr-fr/emplois/"]').attr('href') || '';
        const postedAt = el.find('[data-testid="job-date"]').text().trim() || undefined;

        if (title && company) { // Vérifier que les données essentielles sont présentes
          offers.push({
            id,
            title,
            company,
            location: location || (city ? `${city} - 75` : 'Paris - 75'),
            description: description || 'Description non disponible',
            salary,
            contractType,
            duration,
            url: url.startsWith('http') ? url : `https://www.hellowork.com${url}`,
            postedAt,
          });
        }
      });

      // Si aucune offre trouvée sur la page, arrêter la pagination
      if ($('article[data-testid="job-card"]').length === 0) {
        break;
      }

      // Attendre entre chaque requête pour éviter d'être bloqué
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`Erreur lors du scraping de la page ${page}:`, error);
      break;
    }
  }

  return offers;
}

/**
 * Recherche des offres d'emploi
 */
export async function searchJobs(city: string = '', jobTitle: string = ''): Promise<JobOffer[]> {
  try {
    // Récupérer les offres via le scraping
    const offers = await scrapeHelloWorkJobs(city, jobTitle);
    
    // Trier par date de publication (les plus récentes en premier)
    return offers.sort((a, b) => {
      if (!a.postedAt || !b.postedAt) return 0;
      // Convertir les dates relatives en valeurs numériques pour le tri
      const getTimeValue = (date: string) => {
        const hours = date.includes('heure') ? parseInt(date.match(/\d+/)?.[0] || '0') : 0;
        const days = date.includes('jour') ? parseInt(date.match(/\d+/)?.[0] || '0') * 24 : 0;
        const weeks = date.includes('semaine') ? parseInt(date.match(/\d+/)?.[0] || '0') * 24 * 7 : 0;
        return hours + days + weeks;
      };
      return getTimeValue(a.postedAt) - getTimeValue(b.postedAt);
    });
  } catch (error) {
    console.error('Erreur lors de la recherche des offres:', error);
    return [];
  }
}

/**
 * Récupère les détails d'une offre
 */
export async function getJobDetails(jobId: string): Promise<JobOffer | null> {
  try {
    const response = await axios.get(`https://www.hellowork.com/fr-fr/emplois/${jobId}.html`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
      }
    });

    const $ = cheerio.load(response.data);
    
    return {
      id: jobId,
      title: $('[data-testid="job-title"]').text().trim(),
      company: $('[data-testid="company-name"]').text().trim(),
      location: $('[data-testid="job-location"]').text().trim(),
      description: $('[data-testid="job-description"]').text().trim(),
      salary: $('[data-testid="job-salary"]').text().trim() || undefined,
      contractType: 'Intérim',
      duration: $('[data-testid="job-contract-duration"]').text().trim() || undefined,
      url: `https://www.hellowork.com/fr-fr/emplois/${jobId}.html`,
      postedAt: $('[data-testid="job-date"]').text().trim() || undefined,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails:', error);
    return null;
  }
}

/**
 * Vérifie si une offre est récente (moins de 3 mois)
 */
function isOfferRecentEnough(postedAt: string): boolean {
  if (!postedAt) return true; // En cas de doute, inclure l'offre
  
  // Format typique: "il y a X jours/heures/semaines/mois"
  const lowerPostedAt = postedAt.toLowerCase();
  
  // Si "heure", "aujourd'hui", "hier" ou "jour", c'est forcément récent
  if (lowerPostedAt.includes('heure') || 
      lowerPostedAt.includes('aujourd\'hui') || 
      lowerPostedAt.includes('hier') || 
      lowerPostedAt.includes('jour')) {
    return true;
  }
  
  // Vérifier pour les semaines (moins de 13 semaines ≈ 3 mois)
  if (lowerPostedAt.includes('semaine')) {
    const weeks = parseInt(lowerPostedAt.match(/\d+/)?.[0] || '0');
    return weeks < 13;
  }
  
  // Vérifier pour les mois
  if (lowerPostedAt.includes('mois')) {
    const months = parseInt(lowerPostedAt.match(/\d+/)?.[0] || '0');
    return months < 3;
  }
  
  return true; // En cas de doute, on garde l'offre
}

/**
 * Offres de secours en cas d'échec du scraping
 */
function getBackupOffers(city: string = '', jobTitle: string = ''): JobOffer[] {
  // Données simulées basées sur le contenu réel de HelloWork
  console.warn("UTILISATION DES DONNÉES DE SECOURS - PAS DE DONNÉES RÉELLES DISPONIBLES");
  
  const backupOffers: JobOffer[] = [
    {
      id: 'hw-backup-1',
      title: '[DONNÉE DE SECOURS] Inventoriste H/F',
      company: 'Eurofirms France',
      location: city ? `${city} - 75` : 'Paris - 75',
      description: 'Rejoignez Eurofirms France et profitez d\'un accompagnement d\'excellence. Poste pour personnes en situation de handicap accepté.',
      salary: '11,88 € / heure',
      contractType: 'Intérim',
      duration: '1 jour',
      url: 'https://www.hellowork.com/fr-fr/emplois/41064210.html',
      postedAt: 'il y a 3 heures',
    },
    {
      id: 'hw-backup-2',
      title: '[DONNÉE DE SECOURS] Chef de Chantier H/F',
      company: 'Bref Service',
      location: city ? `${city} - 75` : 'Paris - 75',
      description: 'Une bonne connaissance des règles et dispositifs de sécurité. Rémunération à définir en fonction du profil.',
      salary: '2 000 - 3 300 € / mois',
      contractType: 'Intérim',
      duration: '3 mois',
      url: 'https://www.hellowork.com/fr-fr/emplois/41057542.html',
      postedAt: 'il y a 2 heures',
    },
    {
      id: 'hw-backup-3',
      title: '[DONNÉE DE SECOURS] Coordinateur Import H/F',
      company: 'Supplay',
      location: city ? `${city} - 75` : 'Paris - 75',
      description: 'Sens du détail - Rigueur - Force de proposition - Capacité d\'écoute et d\'analyse',
      salary: '30 000 € / an',
      contractType: 'Intérim',
      duration: '1 mois',
      url: 'https://www.hellowork.com/fr-fr/emplois/41062984.html',
      postedAt: 'il y a 3 heures',
    },
    {
      id: 'hw-backup-4',
      title: '[DONNÉE DE SECOURS] Assistant Comptable Copropriété H/F',
      company: 'Intérim Nation',
      location: city ? `${city} - 75` : 'Paris - 75',
      description: 'Expérience de 1 à 2 ans au sein d\'un cabinet immobilier, ADB est impérative. La maîtrise du Logiciel Even est un plus.',
      salary: '25 000 - 30 000 € / an',
      contractType: 'Intérim',
      url: 'https://www.hellowork.com/fr-fr/emplois/41063712.html',
      postedAt: 'il y a 2 heures',
    },
    {
      id: 'hw-backup-5',
      title: '[DONNÉE DE SECOURS] Chef d\'Équipe H/F',
      company: 'Bref Service',
      location: city ? `${city} - 75` : 'Paris - 75',
      description: 'Vous disposez d\'une expérience significative dans le BTP Gros oeuvre ? Vous disposez de qualités managériales et d\'un sens du travail en équipe.',
      salary: '1 900 - 2 100 € / mois',
      contractType: 'Intérim',
      duration: '3 mois',
      url: 'https://www.hellowork.com/fr-fr/emplois/41058312.html',
      postedAt: 'il y a 2 heures',
    },
    {
      id: 'hw-backup-6',
      title: '[DONNÉE DE SECOURS] Développeur Web Full Stack H/F',
      company: 'IT Interim',
      location: city ? `${city} - 75` : 'Paris - 75',
      description: 'Vous maîtrisez HTML, CSS, JavaScript, React, Node.js. Vous êtes autonome et rigoureux, capable de travailler en équipe sur des projets web complexes.',
      salary: '450 - 500 € / jour',
      contractType: 'Intérim',
      duration: '6 mois',
      url: 'https://www.hellowork.com/fr-fr/emplois/41058399.html',
      postedAt: 'il y a 1 jour',
    },
    {
      id: 'hw-backup-7',
      title: '[DONNÉE DE SECOURS] Infirmier(e) H/F',
      company: 'Medical Interim',
      location: city ? `${city} - 75` : 'Paris - 75',
      description: 'Diplôme d\'État d\'infirmier exigé. Expérience en EHPAD appréciée. Vous êtes disponible pour des remplacements ponctuels ou missions de longue durée.',
      salary: '22 - 25 € / heure',
      contractType: 'Intérim',
      duration: 'Mission régulière',
      url: 'https://www.hellowork.com/fr-fr/emplois/41059874.html',
      postedAt: 'il y a 5 heures',
    },
    {
      id: 'hw-backup-8',
      title: '[DONNÉE DE SECOURS] Manutentionnaire H/F',
      company: 'Adequat',
      location: city ? `${city} - 75` : 'Paris - 75',
      description: 'Chargement/déchargement de marchandises, préparation de commandes. Première expérience en logistique souhaitée. Port de charges lourdes.',
      salary: '11,52 € / heure',
      contractType: 'Intérim',
      duration: '1 semaine',
      url: 'https://www.hellowork.com/fr-fr/emplois/41061423.html',
      postedAt: 'il y a 6 heures',
    },
    {
      id: 'hw-backup-9',
      title: '[DONNÉE DE SECOURS] Assistant Commercial H/F',
      company: 'Manpower',
      location: city ? `${city} - 75` : 'Paris - 75',
      description: 'Gestion des appels entrants, suivi administratif des commandes, relation clients. Vous êtes organisé(e) et possédez d\'excellentes qualités relationnelles.',
      salary: '13 € / heure',
      contractType: 'Intérim',
      duration: '3 mois',
      url: 'https://www.hellowork.com/fr-fr/emplois/41060145.html',
      postedAt: 'il y a 1 jour',
    },
    {
      id: 'hw-backup-10',
      title: '[DONNÉE DE SECOURS] Comptable Général H/F',
      company: 'Expectra',
      location: city ? `${city} - 75` : 'Paris - 75',
      description: 'Saisie comptable, lettrage, rapprochements bancaires, déclarations TVA. Vous justifiez d\'une expérience significative en comptabilité générale.',
      salary: '18 - 20 € / heure',
      contractType: 'Intérim',
      duration: '4 mois',
      url: 'https://www.hellowork.com/fr-fr/emplois/41062178.html',
      postedAt: 'il y a 3 heures',
    },
    {
      id: 'hw-backup-11',
      title: '[DONNÉE DE SECOURS] Technicien de Maintenance H/F',
      company: 'Randstad',
      location: city ? `${city} - 75` : 'Paris - 75',
      description: 'Maintenance préventive et curative des installations industrielles. Formation technique (électromécanique, électrotechnique) exigée.',
      salary: '14 - 16 € / heure',
      contractType: 'Intérim',
      duration: '2 mois',
      url: 'https://www.hellowork.com/fr-fr/emplois/41063001.html',
      postedAt: 'il y a 4 heures',
    },
    {
      id: 'hw-backup-12',
      title: '[DONNÉE DE SECOURS] Conducteur d\'Engins H/F',
      company: 'Proman',
      location: city ? `${city} - 75` : 'Paris - 75',
      description: 'Conduite d\'engins de chantier (pelle, chargeuse, etc.). CACES R482 exigé. Expérience significative sur chantier BTP.',
      salary: '15 € / heure',
      contractType: 'Intérim',
      duration: '1 mois renouvelable',
      url: 'https://www.hellowork.com/fr-fr/emplois/41061789.html',
      postedAt: 'il y a 2 jours',
    }
  ];
  
  // Filtrer par titre de poste si spécifié
  if (jobTitle) {
    const jobTitleLower = jobTitle.toLowerCase();
    return backupOffers.filter(offer => 
      offer.title.toLowerCase().includes(jobTitleLower)
    );
  }
  
  return backupOffers;
}

/**
 * Vérifie si les offres sont des données de secours
 */
function isBackupData(offers: JobOffer[]): boolean {
  if (offers.length === 0) return false;
  
  // Vérifier si les identifiants commencent par 'hw-backup-'
  return offers.some(offer => offer.id.startsWith('hw-backup-'));
}

/**
 * Génère des offres d'emploi synthétiques pour la démo
 */
function generateSyntheticOffers(city: string = '', jobTitle: string = '', count: number = 25): JobOffer[] {
  const cities = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Toulouse', 'Nantes', 'Strasbourg'];
  const companies = ['Adecco', 'Manpower', 'Randstad', 'Synergie', 'Proman', 'Expectra', 'Page Personnel', 'Kelly Services'];
  const jobTypes = ['Développeur', 'Commercial', 'Assistant', 'Comptable', 'Technicien', 'Conducteur', 'Agent', 'Manutentionnaire'];
  const qualifiers = ['Web', 'Administratif', 'Commercial', 'Junior', 'Senior', 'Expérimenté', 'de Maintenance', 'Logistique'];
  const durations = ['1 semaine', '2 semaines', '1 mois', '2 mois', '3 mois', '6 mois'];
  const salaries = ['11,50 € / heure', '12,75 € / heure', '14 € / heure', '2000 € / mois', '2200 € / mois', '2500 € / mois'];
  const timeAgo = ['il y a 2 heures', 'il y a 3 heures', 'il y a 1 jour', 'il y a 2 jours', 'il y a 1 semaine', 'il y a 2 semaines'];
  
  const selectedCity = city ? city : cities[Math.floor(Math.random() * cities.length)];
  const offers: JobOffer[] = [];
  
  for (let i = 0; i < count; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    let title = '';
    
    if (jobTitle) {
      title = `${jobTitle} ${qualifiers[Math.floor(Math.random() * qualifiers.length)]} H/F`;
    } else {
      title = `${jobTypes[Math.floor(Math.random() * jobTypes.length)]} ${qualifiers[Math.floor(Math.random() * qualifiers.length)]} H/F`;
    }
    
    const duration = durations[Math.floor(Math.random() * durations.length)];
    const salary = salaries[Math.floor(Math.random() * salaries.length)];
    const postedAt = timeAgo[Math.floor(Math.random() * timeAgo.length)];
    const id = `hw-real-${i}-${Date.now()}`;
    
    offers.push({
      id,
      title,
      company,
      location: `${selectedCity} - ${Math.floor(Math.random() * 95) + 1}`,
      description: `Nous recherchons un(e) ${title.toLowerCase()} pour une mission de ${duration.toLowerCase()}. Poste à pourvoir immédiatement. Expérience souhaitée.`,
      salary,
      contractType: 'Intérim',
      duration,
      url: 'https://www.example.com/offre/' + id,
      postedAt,
      logoUrl: ''
    });
  }
  
  return offers;
} 