import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Charger les traductions depuis /locales/[lang]/translation.json
  .use(Backend) 
  // Détecter la langue de l'utilisateur
  .use(LanguageDetector)
  // Passer l'instance i18n à react-i18next
  .use(initReactI18next) 
  // Initialiser i18next
  .init({
    debug: true, // Mettre à false en production
    fallbackLng: 'fr', // Langue par défaut si la langue détectée n'est pas dispo
    supportedLngs: ['fr', 'en', 'ar'], // Langues supportées
    interpolation: {
      escapeValue: false, // Pas nécessaire pour React car il échappe déjà
    },
    backend: {
      // Chemin vers les fichiers de traduction (dans le dossier public)
      loadPath: '/locales/{{lng}}/translation.json', 
    },
    // Options pour LanguageDetector (ordre de détection)
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'], // Où sauvegarder la langue choisie
    }
  });

export default i18n; 