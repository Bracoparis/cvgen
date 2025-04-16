import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react'; // Icône pour le bouton

// Mapping des codes de langue vers les noms affichés
const languages: { [key: string]: string } = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  // Récupérer les langues supportées configurées dans i18n.ts
  const supportedLanguages = i18n.options.supportedLngs || [];
  // Filtrer "cimode" qui est parfois ajouté par i18next
  const displayLanguages = supportedLanguages.filter(lng => lng !== 'cimode');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguageName = languages[i18n.language] || i18n.language;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Globe className="mr-2 h-4 w-4" />
          {currentLanguageName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {displayLanguages.map((lng) => (
          <DropdownMenuItem 
            key={lng} 
            onClick={() => changeLanguage(lng)}
            // Ajouter un style pour indiquer la langue active
            className={i18n.language === lng ? 'bg-accent' : ''} 
          >
            {languages[lng] || lng} 
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector; 