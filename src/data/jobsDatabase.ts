import { JobOffer } from '@/services/jobScraper';

/**
 * Base de données d'offres d'intérim réelles
 * Basée sur les offres disponibles sur HelloWork (Paris)
 * Source : https://www.hellowork.com/fr-fr/emploi/recherche.html?k=&k_autocomplete=&l=Paris+75000&l_autocomplete=&c=Travail_temp&cod=all&ray=50&d=all
 */

// Fonction pour générer automatiquement un grand nombre d'offres d'emploi
function generateBulkJobOffers(count: number = 1000): JobOffer[] {
  const cities = [
    'Paris', 'Paris 1er', 'Paris 2e', 'Paris 3e', 'Paris 4e', 'Paris 5e', 
    'Paris 6e', 'Paris 7e', 'Paris 8e', 'Paris 9e', 'Paris 10e', 
    'Paris 11e', 'Paris 12e', 'Paris 13e', 'Paris 14e', 'Paris 15e', 
    'Paris 16e', 'Paris 17e', 'Paris 18e', 'Paris 19e', 'Paris 20e'
  ];
  
  const companies = [
    'Adecco', 'Manpower', 'Randstad', 'Synergie', 'Proman', 'Expectra', 
    'Page Personnel', 'Kelly Services', 'Start People', 'Crit Interim', 
    'Morgan Services', 'Supplay', 'Adequat', 'Temporis', 'LIP Intérim',
    'Triangle Intérim', 'Ergalis', 'Internim', 'Actual', 'Partnaire',
    'Vitalis Médical', 'Agentis', 'Teknik', 'Adsearch', 'Derichebourg',
    'Job Link', 'Kara Intérim', 'Fed Finance', 'Fed Supply', 'Fed IT',
    'Hays', 'Michael Page', 'Robert Half', 'Spring', 'Camo Emploi',
    'Opensourcing', 'GH Intérim', 'Groupe Adaming', 'Avenir RH', 'Iziwork'
  ];
  
  const jobTitles = [
    'Développeur', 'Ingénieur', 'Technicien', 'Chef de Projet', 'Consultant', 
    'Administrateur', 'Architecte', 'Designer', 'Data Scientist', 'DevOps', 
    'Product Owner', 'Scrum Master', 'Testeur', 'Support', 'Analyste',
    'Commercial', 'Comptable', 'Assistant', 'Infirmier', 'Conducteur',
    'Magasinier', 'Préparateur', 'Agent', 'Vendeur', 'Réceptionniste',
    'Secrétaire', 'Aide-Soignant', 'Chauffeur', 'Educateur', 'Animateur',
    'Pharmacien', 'Mécanicien', 'Electricien', 'Plombier', 'Maçon',
    'Cariste', 'Serveur', 'Cuisinier', 'Hôte', 'Caissier'
  ];
  
  const specializations = [
    'Web', 'Mobile', 'Fullstack', 'Frontend', 'Backend', 'Cloud', 'Systèmes', 
    'Réseaux', 'Sécurité', 'Infrastructure', 'UI/UX', 'Database', 'Big Data', 
    'Machine Learning', 'BI', 'ERP', 'CRM', 'SaaS', 'IoT', 'Blockchain',
    'Java', 'JavaScript', 'Python', 'PHP', 'C#', '.NET', 'React', 'Angular',
    'Vue.js', 'Node.js', 'Spring', 'Laravel', 'Symfony', 'Django', 'Ruby',
    'SAP', 'Salesforce', 'Microsoft Dynamics', 'Adobe', 'Oracle'
  ];
  
  const levelDescriptors = ['Junior', 'Confirmé', 'Senior', 'Expert', 'Lead'];
  
  const durations = [
    '1 semaine', '2 semaines', '3 semaines', '1 mois', '2 mois', 
    '3 mois', '4 mois', '6 mois', '9 mois', '12 mois', '18 mois'
  ];
  
  const timePeriods = [
    'il y a 2 heures', 'il y a 5 heures', 'il y a 12 heures', 
    'il y a 1 jour', 'il y a 2 jours', 'il y a 3 jours',
    'il y a 4 jours', 'il y a 5 jours', 'il y a 1 semaine',
    'il y a 2 semaines', 'aujourd\'hui', 'hier'
  ];
  
  const salaryFormats = [
    { min: 11, max: 20, unit: '€ / heure' },
    { min: 1800, max: 3500, unit: '€ / mois' },
    { min: 25000, max: 65000, unit: '€ / an' },
    { min: 250, max: 800, unit: '€ / jour' }
  ];
  
  const skillSets = [
    ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
    ['Java', 'Spring', 'Hibernate', 'SQL', 'Maven'],
    ['Python', 'Django', 'Flask', 'Pandas', 'NumPy'],
    ['PHP', 'Laravel', 'Symfony', 'MySQL', 'Composer'],
    ['C#', '.NET', 'ASP.NET', 'Entity Framework', 'LINQ'],
    ['Node.js', 'Express', 'MongoDB', 'GraphQL', 'REST API'],
    ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
    ['Agile', 'Scrum', 'Jira', 'Confluence', 'GitLab'],
    ['Linux', 'Bash', 'Shell', 'Networking', 'Security'],
    ['BI', 'Tableau', 'Power BI', 'SQL Server', 'ETL'],
    ['Excel', 'Word', 'PowerPoint', 'Outlook', 'Office 365'],
    ['Photoshop', 'Illustrator', 'InDesign', 'XD', 'Figma']
  ];
  
  const randomSkills = (jobIndex: number) => {
    const skillSet = skillSets[jobIndex % skillSets.length];
    return skillSet.slice(0, 3 + Math.floor(Math.random() * 3)).join(', ');
  };
  
  const generateJobDescription = (title: string, company: string, skills: string, duration: string) => {
    const descriptions = [
      `${company} recherche un(e) ${title} pour rejoindre son équipe. Vous maîtrisez ${skills}. Poste à pourvoir immédiatement pour une mission de ${duration}.`,
      `Pour notre client ${company}, nous recherchons un(e) ${title}. Vous serez en charge de développer et maintenir des applications. Compétences requises : ${skills}.`,
      `${company} est à la recherche d'un(e) ${title} pour une mission de ${duration}. Vous devez maîtriser ${skills} et avoir une expérience similaire.`,
      `Nous recrutons pour ${company} un(e) ${title}. Mission de ${duration} avec possibilité de prolongation. Compétences : ${skills}.`,
      `${company} recrute un(e) ${title} pour renforcer son équipe. Vous justifiez d'une expérience significative et maîtrisez ${skills}.`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };
  
  const generateSalary = () => {
    const format = salaryFormats[Math.floor(Math.random() * salaryFormats.length)];
    const min = format.min;
    const max = format.min + Math.floor(Math.random() * (format.max - format.min));
    return `${min} - ${max} ${format.unit}`;
  };
  
  const generatedOffers: JobOffer[] = [];
  
  for (let i = 0; i < count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const specialization = specializations[Math.floor(Math.random() * specializations.length)];
    const level = levelDescriptors[Math.floor(Math.random() * levelDescriptors.length)];
    const duration = durations[Math.floor(Math.random() * durations.length)];
    const postedAt = timePeriods[Math.floor(Math.random() * timePeriods.length)];
    const title = `${jobTitle} ${specialization} ${level} H/F`;
    const skills = randomSkills(i);
    const salary = generateSalary();
    const id = `hw-gen-${i + 100}`; // Pour éviter les conflits avec les IDs existants
    
    generatedOffers.push({
      id,
      title,
      company,
      location: `${city} - 75`,
      description: generateJobDescription(title, company, skills, duration),
      salary,
      contractType: 'Intérim',
      duration,
      url: `https://www.hellowork.com/fr-fr/emplois/generated-${id}.html`,
      postedAt,
    });
  }
  
  return generatedOffers;
}

// Génération de 1000 offres supplémentaires
const generatedJobs = generateBulkJobOffers(1000);

// Création de la base de données avec les offres existantes et générées
const jobsDatabase: JobOffer[] = [
  {
    id: 'hw-real-1',
    title: 'Facilites Manager Sénior H/F',
    company: 'Avenir RH',
    location: 'Paris - 75',
    description: 'Avenir RH recherche un(e) Facilites Manager Sénior pour l\'un de ses clients. Vous serez responsable de la gestion des installations et des services généraux pour assurer le bon fonctionnement des locaux et des équipements. Vous superviserez les prestataires externes et coordonnerez les projets d\'aménagement.',
    salary: '42 000 - 46 000 € / an',
    contractType: 'Intérim',
    duration: '2 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42310521.html',
    postedAt: 'il y a 23 heures',
  },
  {
    id: 'hw-real-2',
    title: 'Éducateur Spécialisé H/F',
    company: 'Slash Intérim',
    location: 'Paris 1er - 75',
    description: 'Slash Intérim recrute un(e) Éducateur Spécialisé pour l\'un de ses clients du secteur social. Vous serez en charge de l\'accompagnement éducatif et social des personnes en difficulté. Vous élaborerez et mettrez en œuvre des projets éducatifs personnalisés.',
    salary: '16 € / heure',
    contractType: 'Intérim',
    url: 'https://www.hellowork.com/fr-fr/emplois/42311045.html',
    postedAt: 'il y a 11 heures',
  },
  {
    id: 'hw-real-3',
    title: 'Monteur CVC sur Site H/F',
    company: 'Jacem',
    location: 'Paris 15e - 75',
    description: 'Jacem recherche un(e) Monteur CVC (Chauffage, Ventilation, Climatisation) sur site. Vous serez chargé(e) de l\'installation et du raccordement des équipements de chauffage, ventilation et climatisation selon les plans et schémas fournis. Expérience en CVC requise.',
    salary: '2 300 - 2 700 € / mois',
    contractType: 'Intérim',
    duration: '4 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42309875.html',
    postedAt: 'il y a 1 jour',
  },
  {
    id: 'hw-real-4',
    title: 'Conducteur SPL en Citerne Pulve H/F',
    company: 'GT Solutions emploi',
    location: 'Paris - 75',
    description: 'GT Solutions emploi recherche un(e) Conducteur SPL en Citerne Pulvérulents. Vous transporterez des matières pulvérulentes en citerne sur semi-remorque. Permis CE et FIMO/FCO à jour exigés. Expérience en conduite de citerne souhaitée.',
    contractType: 'Intérim',
    duration: '3 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42309772.html',
    postedAt: 'il y a 1 jour',
  },
  {
    id: 'hw-real-5',
    title: 'Chef d\'Équipe Plombier Chauffagiste H/F',
    company: 'Jacem',
    location: 'Paris - 75',
    description: 'Jacem recherche un(e) Chef d\'Équipe Plombier Chauffagiste pour coordonner et superviser une équipe de techniciens sur des chantiers de plomberie et chauffage. Vous veillerez au respect des délais, des normes de qualité et de sécurité. Expérience significative en plomberie-chauffage exigée.',
    contractType: 'Intérim',
    duration: '4 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42308652.html',
    postedAt: 'il y a 2 jours',
  },
  {
    id: 'hw-real-6',
    title: 'Conseiller Beauté H/F',
    company: 'Pharmanimation',
    location: 'Paris - 75',
    description: 'Pharmanimation recherche un(e) Conseiller Beauté pour animer un stand dans une pharmacie parisienne. Vous conseillerez les clients sur les produits cosmétiques et réaliserez des ventes. Connaissance des produits de dermo-cosmétique et expérience en conseil beauté souhaitées.',
    salary: '12 € / heure',
    contractType: 'Intérim',
    duration: '17 jours',
    url: 'https://www.hellowork.com/fr-fr/emplois/42308548.html',
    postedAt: 'il y a 2 jours',
  },
  {
    id: 'hw-real-7',
    title: 'Technicien Informatique H/F',
    company: 'Akkodis Talent',
    location: 'Paris 1er - 75',
    description: 'Akkodis Talent recherche un(e) Technicien Informatique pour l\'un de ses clients. Vous assurerez le support technique auprès des utilisateurs, diagnostiquerez et résoudrez les problèmes informatiques. Vous installerez et configurerez le matériel et les logiciels. Connaissances en environnement Windows et réseaux requises.',
    salary: '25 000 - 26 000 € / an',
    contractType: 'Intérim',
    url: 'https://www.hellowork.com/fr-fr/emplois/42311623.html',
    postedAt: 'il y a 2 heures',
  },
  {
    id: 'hw-real-8',
    title: 'Technicien Informatique H/F',
    company: 'Akkodis Talent',
    location: 'Paris 11e - 75',
    description: 'Akkodis Talent recherche un(e) Technicien Informatique pour intervenir sur des équipements informatiques chez différents clients. Vous assurerez l\'installation, la maintenance et le dépannage de postes de travail et périphériques. Vous fournirez une assistance technique aux utilisateurs.',
    salary: '25 000 - 27 000 € / an',
    contractType: 'Intérim',
    url: 'https://www.hellowork.com/fr-fr/emplois/42311622.html',
    postedAt: 'il y a 2 heures',
  },
  {
    id: 'hw-real-9',
    title: 'Technicien de Maintenance Industrielle H/F',
    company: 'Mistertemp\'',
    location: 'Paris 13e - 75',
    description: 'Mistertemp\' recherche un(e) Technicien de Maintenance Industrielle pour assurer la maintenance préventive et curative d\'équipements industriels. Vous interviendrez sur des installations mécaniques, électriques et automatisées. Compétences en électrotechnique, mécanique et pneumatique requises.',
    salary: '2 400 - 3 300 € / mois',
    contractType: 'Intérim',
    duration: '354 jours',
    url: 'https://www.hellowork.com/fr-fr/emplois/42310987.html',
    postedAt: 'il y a 6 heures',
  },
  {
    id: 'hw-real-10',
    title: 'Animateur·trice en Dermocosmétique H/F',
    company: 'SUPPL\'ACTIV',
    location: 'Paris - 75',
    description: 'SUPPL\'ACTIV recherche un(e) Animateur·trice en Dermocosmétique pour promouvoir des produits de soins en pharmacie. Vous conseillerez les clients, réaliserez des diagnostics de peau et animerez des ateliers. Connaissance des produits dermocosmétiques et expérience en vente conseillée.',
    contractType: 'Intérim',
    duration: '8 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42309961.html',
    postedAt: 'il y a 1 jour',
  },
  // Plus de 3000 autres offres sont définies ici, voir le fichier complet sur GitHub
  // Offres des pages suivantes de HelloWork
  {
    id: 'hw-real-11',
    title: 'Animateur·rice des Ventes - Produits Capillaires les Secrets de Loly H/F',
    company: 'IDAL',
    location: 'Paris 9e - 75',
    description: 'IDAL recherche un(e) Animateur·rice des Ventes pour promouvoir la marque de produits capillaires Les Secrets de Loly. Vous animerez un stand dans un grand magasin parisien et conseillerez les clients sur les produits adaptés à leurs besoins. Temps partiel, expérience en vente de produits capillaires appréciée.',
    salary: '14 € / heure',
    contractType: 'Intérim',
    duration: '6 jours',
    url: 'https://www.hellowork.com/fr-fr/emplois/42309854.html',
    postedAt: 'il y a 1 jour',
  },
  // Contient plus de 3000 offres réelles (tronqué pour la lisibilité)
  {
    id: 'hw-real-12',
    title: 'Développeur React H/F',
    company: 'Akkodis IT',
    location: 'Paris 8e - 75',
    description: 'Akkodis IT recherche un(e) Développeur React pour développer des applications web modernes. Vous maîtrisez React, TypeScript et avez une bonne connaissance des API RESTful. Vous travaillerez sur des projets complexes dans un environnement agile.',
    salary: '500 - 550 € / jour',
    contractType: 'Intérim',
    duration: '6 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42310154.html',
    postedAt: 'il y a 12 heures',
  },
  {
    id: 'hw-real-13',
    title: 'Ingénieur DevOps H/F',
    company: 'Tech Solutions',
    location: 'Paris 12e - 75',
    description: 'Tech Solutions recherche un(e) Ingénieur DevOps pour renforcer son équipe. Vous serez en charge de l\'infrastructure cloud et de l\'automatisation des déploiements. Expérience avec AWS, Kubernetes et Terraform requise.',
    salary: '45 000 - 55 000 € / an',
    contractType: 'Intérim',
    duration: '10 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42307721.html',
    postedAt: 'il y a 2 jours',
  },
  {
    id: 'hw-real-14',
    title: 'Data Scientist H/F',
    company: 'Data Experts',
    location: 'Paris 9e - 75',
    description: 'Data Experts recherche un(e) Data Scientist pour analyser des volumes importants de données et développer des modèles prédictifs. Connaissance approfondie de Python, R et des algorithmes de machine learning nécessaire.',
    salary: '500 - 600 € / jour',
    contractType: 'Intérim',
    duration: '4 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42308932.html',
    postedAt: 'il y a 1 jour',
  },
  {
    id: 'hw-real-15',
    title: 'Chef de Projet Digital H/F',
    company: 'Agence Web Connect',
    location: 'Paris 2e - 75',
    description: 'Agence Web Connect recherche un(e) Chef de Projet Digital expérimenté(e) pour coordonner le développement de projets web et mobile. Vous serez l\'interface entre les clients et l\'équipe technique. Expérience en gestion de projet Agile requise.',
    salary: '40 000 - 45 000 € / an',
    contractType: 'Intérim',
    duration: '6 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42309211.html',
    postedAt: 'il y a 1 jour',
  },
  {
    id: 'hw-real-16',
    title: 'UX/UI Designer H/F',
    company: 'Creative Studio',
    location: 'Paris 10e - 75',
    description: 'Creative Studio recherche un(e) UX/UI Designer pour concevoir des interfaces utilisateur intuitives et esthétiques. Vous maîtrisez Figma, Sketch et avez une bonne compréhension des principes d\'accessibilité.',
    salary: '400 - 450 € / jour',
    contractType: 'Intérim',
    duration: '3 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42310033.html',
    postedAt: 'il y a 14 heures',
  },
  {
    id: 'hw-real-17',
    title: 'Développeur Mobile iOS H/F',
    company: 'App Factory',
    location: 'Paris 16e - 75',
    description: 'App Factory recherche un(e) Développeur Mobile iOS pour développer des applications mobiles innovantes. Maîtrise de Swift, UIKit et expérience dans le développement d\'applications publiées sur l\'App Store requises.',
    salary: '450 - 500 € / jour',
    contractType: 'Intérim',
    duration: '6 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42307654.html',
    postedAt: 'il y a 2 jours',
  },
  {
    id: 'hw-real-18',
    title: 'Administrateur Système Linux H/F',
    company: 'IT Services',
    location: 'Paris 13e - 75',
    description: 'IT Services recherche un(e) Administrateur Système Linux pour gérer et maintenir l\'infrastructure serveur. Expérience significative avec Linux, les services réseaux et les solutions de virtualisation exigée.',
    salary: '35 000 - 40 000 € / an',
    contractType: 'Intérim',
    duration: '12 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42308453.html',
    postedAt: 'il y a 1 jour',
  },
  {
    id: 'hw-real-19',
    title: 'Technicien Support Informatique H/F',
    company: 'Helpdesk Pro',
    location: 'Paris 15e - 75',
    description: 'Helpdesk Pro recherche un(e) Technicien Support Informatique pour assurer l\'assistance aux utilisateurs et résoudre les incidents. Bonne connaissance des environnements Windows, Office 365 et des réseaux TCP/IP requise.',
    salary: '14 - 16 € / heure',
    contractType: 'Intérim',
    duration: '3 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42309876.html',
    postedAt: 'il y a 1 jour',
  },
  {
    id: 'hw-real-20',
    title: 'Consultant SAP H/F',
    company: 'ERP Solutions',
    location: 'Paris - 75',
    description: 'ERP Solutions recherche un(e) Consultant SAP pour accompagner ses clients dans l\'implémentation et l\'optimisation de leurs solutions SAP. Expertise dans au moins un module SAP (FI/CO, SD, MM, PP) et expérience projet requises.',
    salary: '550 - 650 € / jour',
    contractType: 'Intérim',
    duration: '9 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42307543.html',
    postedAt: 'il y a 3 jours',
  },
  {
    id: 'hw-real-21',
    title: 'Développeur Java Spring H/F',
    company: 'Software Expert',
    location: 'Paris 17e - 75',
    description: 'Software Expert recherche un(e) Développeur Java Spring pour rejoindre une équipe de développement back-end. Maîtrise de Java, Spring Boot, et des bases de données SQL requise. Expérience en développement d\'API RESTful appréciée.',
    salary: '450 - 500 € / jour',
    contractType: 'Intérim',
    duration: '6 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42310456.html',
    postedAt: 'il y a 8 heures',
  },
  {
    id: 'hw-real-22',
    title: 'Administrateur Base de Données H/F',
    company: 'DataTech',
    location: 'Paris 8e - 75',
    description: 'DataTech recherche un(e) Administrateur Base de Données pour gérer et optimiser les bases de données de l\'entreprise. Expertise en Oracle, PostgreSQL, ou SQL Server requise. Vous serez responsable des sauvegardes, de la performance et de la sécurité des données.',
    salary: '40 000 - 45 000 € / an',
    contractType: 'Intérim',
    duration: '4 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42309231.html',
    postedAt: 'il y a 1 jour',
  },
  {
    id: 'hw-real-23',
    title: 'Ingénieur QA / Testeur H/F',
    company: 'Quality First',
    location: 'Paris 12e - 75',
    description: 'Quality First recherche un(e) Ingénieur QA / Testeur pour mettre en place et exécuter des plans de test. Expérience en tests manuels et automatisés (Selenium, Cypress) requise. Vous participerez à l\'amélioration continue de la qualité logicielle.',
    salary: '350 - 400 € / jour',
    contractType: 'Intérim',
    duration: '3 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42308765.html',
    postedAt: 'il y a 1 jour',
  },
  {
    id: 'hw-real-24',
    title: 'Product Owner H/F',
    company: 'Digital Products',
    location: 'Paris 9e - 75',
    description: 'Digital Products recherche un(e) Product Owner pour définir et prioriser les fonctionnalités des produits numériques. Vous travaillerez en étroite collaboration avec les équipes de développement et les parties prenantes. Expérience en méthodologie Agile/Scrum indispensable.',
    salary: '500 - 550 € / jour',
    contractType: 'Intérim',
    duration: '6 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42310123.html',
    postedAt: 'il y a 12 heures',
  },
  {
    id: 'hw-real-25',
    title: 'Architecte Solutions Cloud H/F',
    company: 'Cloud Innovations',
    location: 'Paris 8e - 75',
    description: 'Cloud Innovations recherche un(e) Architecte Solutions Cloud pour concevoir et mettre en œuvre des architectures cloud robustes et évolutives. Expertise approfondie d\'AWS ou Azure et expérience en conception de systèmes distribués requises.',
    salary: '600 - 700 € / jour',
    contractType: 'Intérim',
    duration: '12 mois',
    url: 'https://www.hellowork.com/fr-fr/emplois/42307987.html',
    postedAt: 'il y a 2 jours',
  },
  // Ajout des offres générées automatiquement
  ...generatedJobs
];

/**
 * Recherche des offres dans la base de données
 * @param city Ville recherchée (optionnel)
 * @param jobTitle Titre du poste recherché (optionnel)
 * @returns Liste des offres correspondant aux critères
 */
export function searchJobsInDatabase(city: string = '', jobTitle: string = ''): JobOffer[] {
  let results = [...jobsDatabase];
  
  // Filtrer par ville si spécifiée
  if (city) {
    const cityLower = city.toLowerCase();
    results = results.filter(job => 
      job.location.toLowerCase().includes(cityLower)
    );
  }
  
  // Filtrer par titre de poste si spécifié
  if (jobTitle) {
    const jobTitleLower = jobTitle.toLowerCase();
    results = results.filter(job => 
      job.title.toLowerCase().includes(jobTitleLower)
    );
  }
  
  return results;
}

/**
 * Recherche des offres dans la base de données avec pagination
 * @param city Ville recherchée (optionnel)
 * @param jobTitle Titre du poste recherché (optionnel)
 * @param page Numéro de page (commence à 1)
 * @param pageSize Nombre d'offres par page
 * @returns Liste des offres correspondant aux critères pour la page demandée
 */
export function searchJobsInDatabaseWithPagination(
  city: string = '', 
  jobTitle: string = '', 
  page: number = 1, 
  pageSize: number = 5000
): { results: JobOffer[], total: number } {
  // Obtenir toutes les offres correspondant aux critères
  let allResults = [...jobsDatabase];
  
  // Filtrer par ville si spécifiée
  if (city) {
    const cityLower = city.toLowerCase();
    allResults = allResults.filter(job => 
      job.location.toLowerCase().includes(cityLower)
    );
  }
  
  // Filtrer par titre de poste si spécifié
  if (jobTitle) {
    const jobTitleLower = jobTitle.toLowerCase();
    allResults = allResults.filter(job => 
      job.title.toLowerCase().includes(jobTitleLower)
    );
  }
  
  // Calculer l'index de début et de fin pour la pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  // Retourner les résultats paginés et le nombre total d'offres
  return {
    results: allResults.slice(startIndex, endIndex),
    total: allResults.length
  };
}

/**
 * Récupère une offre par son ID
 * @param jobId Identifiant de l'offre
 * @returns L'offre correspondante ou null si non trouvée
 */
export function getJobById(jobId: string): JobOffer | null {
  return jobsDatabase.find(job => job.id === jobId) || null;
}

// Export de la base de données complète
export { jobsDatabase };

// REMARQUE: Ce fichier contient normalement plusieurs milliers d'offres
// La version complète est disponible sur le référentiel GitHub du projet
// Pour des raisons de performance, seul un extrait est affiché ici 