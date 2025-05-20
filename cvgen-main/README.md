# Application de Création de CV et Recherche d'Emploi

## Structure du Projet

Ce projet est organisé selon une architecture orientée features (fonctionnalités), ce qui facilite la compréhension, la maintenance et l'évolution du code.

```
src/
├── core/                   # Éléments fondamentaux de l'application
│   ├── components/         # Composants partagés dans toute l'app
│   ├── services/           # Services de base (auth, etc.)
│   ├── types/              # Types et interfaces communs
│   └── i18n/               # Configuration et ressources d'internationalisation
│
├── features/               # Modules fonctionnels de l'application
│   ├── cv-builder/         # Fonctionnalité de création de CV
│   │   ├── components/     # Composants spécifiques au CV
│   │   └── types/          # Types spécifiques au CV
│   │
│   ├── job-search/         # Fonctionnalité de recherche d'emploi
│   │   ├── components/     # Composants de recherche d'emploi
│   │   ├── services/       # Services liés aux offres d'emploi
│   │   ├── data/           # Données et modèles d'offres d'emploi
│   │   └── pages/          # Pages de recherche d'emploi
│   │
│   └── training/           # Fonctionnalité de formation
│       └── pages/          # Pages de formation
│
├── shared/                 # Utilitaires et composants UI partagés
│   ├── ui/                 # Composants UI réutilisables
│   └── utils/              # Fonctions utilitaires (dates, validation, etc.)
│
├── App.tsx                 # Point d'entrée des routes de l'application
├── main.tsx                # Point d'entrée de l'application
└── index.css               # Styles globaux
```

## Guide de Nommage

Pour une meilleure lisibilité et compréhension du code :

- **Composants** : NomDuComposant.tsx (PascalCase)
- **Pages** : NomDeLaPage.tsx (PascalCase)
- **Services** : nom-du-service.service.ts (kebab-case)
- **Hooks** : useNomDuHook.ts (camelCase)
- **Types** : nom-du-type.types.ts (kebab-case)
- **Utils** : nom-de-fonction.util.ts (kebab-case)

## Comment Contribuer

1. Respectez la structure du projet lors de l'ajout de nouvelles fonctionnalités
2. Suivez les conventions de nommage
3. Documentez vos composants et fonctions
4. Testez votre code avant de soumettre des modifications

## Technologies Utilisées

- React
- TypeScript
- Vite
- TailwindCSS
- Shadcn UI
- i18next pour l'internationalisation