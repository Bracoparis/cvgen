# Guide de Migration vers la Nouvelle Structure

Ce guide explique comment migrer vers la nouvelle architecture orientée features pour améliorer la clarté et la maintenabilité du code.

## Plan de Migration

Voici comment réorganiser les fichiers existants vers la nouvelle structure :

### 1. Fonctionnalité de Création de CV

**Avant** :
```
src/
  components/
    PersonalForm.tsx
    ExperienceForm.tsx
    EducationForm.tsx
    SkillsForm.tsx
    PreviewCV.tsx
```

**Après** :
```
src/features/cv-builder/
  components/
    personal/
      PersonalForm.tsx           # Formulaire d'informations personnelles
    experience/
      ExperienceForm.tsx         # Formulaire d'expériences professionnelles
      ExperienceItem.tsx         # Composant unitaire d'expérience
    education/
      EducationForm.tsx          # Formulaire d'éducation
      EducationItem.tsx          # Composant unitaire d'éducation
    skills/
      SkillsForm.tsx             # Formulaire de compétences
    preview/
      PreviewCV.tsx              # Aperçu du CV
      PdfExport.tsx              # Fonctionnalité d'export en PDF
  types/
    cv-builder.types.ts          # Types spécifiques à la création de CV
```

### 2. Fonctionnalité de Recherche d'Emploi

**Avant** :
```
src/
  pages/
    OffresEmploiPage.tsx
  services/
    jobScraper.ts
    browserAutomation.ts
  components/
    JobScraperWithAutomation.tsx
  data/
    jobsDatabase.ts
    databaseStats.ts
```

**Après** :
```
src/features/job-search/
  pages/
    JobOffersPage.tsx            # Page de recherche d'offres (ancien OffresEmploiPage)
    JobDetailPage.tsx            # Page de détail d'une offre
  components/
    JobSearchForm.tsx            # Formulaire de recherche
    JobList.tsx                  # Liste des offres
    JobCard.tsx                  # Carte d'offre unitaire
    JobScraperInterface.tsx      # Interface pour le scraper (ancien JobScraperWithAutomation)
  services/
    job-scraper.service.ts       # Service de scraping (ancien jobScraper)
    browser-automation.service.ts # Service d'automatisation (ancien browserAutomation)
  data/
    jobs-database.ts             # Base de données d'emplois
    database-stats.ts            # Statistiques sur la base
```

### 3. Fonctionnalité de Formation

**Avant** :
```
src/
  pages/
    FormationPage.tsx
```

**Après** :
```
src/features/training/
  pages/
    TrainingPage.tsx             # Page de formation (ancien FormationPage)
  components/
    TrainingCard.tsx             # Carte de formation unitaire
    CourseList.tsx               # Liste des cours disponibles
```

### 4. Éléments Fondamentaux

**Avant** :
```
src/
  types.ts
  i18n.ts
  components/
    LoadingSpinner.tsx
    LanguageSelector.tsx
```

**Après** :
```
src/core/
  components/
    LoadingSpinner.tsx           # Indicateur de chargement
    LanguageSelector.tsx         # Sélecteur de langue
  types/
    common.types.ts              # Types communs à toute l'application
  i18n/
    i18n.config.ts               # Configuration de l'internationalisation
```

### 5. Composants UI Partagés

**Avant** :
```
src/
  components/ui/
    button.tsx
    card.tsx
    etc...
```

**Après** :
```
src/shared/
  ui/
    button/
      Button.tsx                 # Composant bouton
    card/
      Card.tsx                   # Composant carte
      CardHeader.tsx
      CardContent.tsx
      CardFooter.tsx
    dialog/
      Dialog.tsx                 # Composant dialogue
    input/
      Input.tsx                  # Composant entrée
    etc...
```

## Convention de Nommage des Fichiers

Suivez ces conventions pour les futurs développements :

1. **Noms explicites** : Le nom du fichier doit clairement indiquer son contenu
2. **Kebab-case pour les dossiers** : Utilisez des tirets pour les noms de dossiers: `job-search/`
3. **PascalCase pour les composants React** : `JobSearchForm.tsx`
4. **Suffixe pour les types de fichiers** :
   - `.service.ts` pour les services
   - `.types.ts` pour les fichiers de types
   - `.util.ts` pour les utilitaires
   - `.hook.ts` pour les hooks personnalisés

## Étapes de Migration

1. Créer la nouvelle structure de dossiers
2. Copier les fichiers dans leur nouvel emplacement
3. Mettre à jour les imports dans tous les fichiers
4. Tester l'application pour s'assurer que tout fonctionne correctement
5. Supprimer les fichiers originaux une fois la migration validée

## Avantages de la Nouvelle Structure

- **Meilleure organisation** : Chaque fonctionnalité est isolée avec ses composants et services
- **Facilité de maintenance** : Les modifications peuvent être faites dans un contexte isolé
- **Meilleure compréhension** : Nouveaux développeurs peuvent rapidement comprendre l'architecture
- **Évolutivité** : Ajout facile de nouvelles fonctionnalités sans perturber l'existant 