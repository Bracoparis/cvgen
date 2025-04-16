import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Download, User, Briefcase, GraduationCap, /* Languages, */ Award, Eye } from 'lucide-react';
// Importer les types depuis @/types (qui exporte maintenant tous les types)
import { 
  CVData, 
  Section, 
  ExperienceEntry, 
  EducationEntry, 
  PersonalData, 
  SkillsData 
} from '@/types';
import PreviewCV from '@/components/PreviewCV';
import PersonalForm, { PersonalFormRef } from '@/components/PersonalForm';
import ExperienceForm, { ExperienceFormRef } from '@/components/ExperienceForm';
import EducationForm, { EducationFormRef } from '@/components/EducationForm';
// SkillsForm props devront être ajustées
import SkillsForm, { SkillsFormRef } from '@/components/SkillsForm';
import LanguageSelector from '@/components/LanguageSelector';
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import html2pdf from 'html2pdf.js';

// Sections (label sera traduit)
const sections: { id: Section; icon: React.ElementType }[] = [
  { id: 'personal', icon: User },
  { id: 'experience', icon: Briefcase },
  { id: 'education', icon: GraduationCap },
  { id: 'skills', icon: Award },
  { id: 'preview', icon: Eye },
];

const LOCAL_STORAGE_KEY = 'cv-creator-data-v2'; // Changer la clé si la structure change

// Valeur initiale explicitement typée avec CVData
const initialCVData = {
  personal: { 
    nom: '', 
    prenom: '', 
    email: '', 
    telephone: '', 
    adresse: '', 
    linkedin: '', 
    github: '', 
    portfolio: '', 
    titre: '', 
    description: '' 
  } as any, // Contourner temporairement l'erreur de type
  experience: [],
  education: [],
  skills: { 
    competences: [], 
    langues: []
  },
} as CVData; // Assertion de type pour l'objet entier

function App() {
  const { t, i18n } = useTranslation();
  const [currentSection, setCurrentSection] = useState<Section>('personal');
  
  // Utiliser directement initialCVData pour l'état initial par défaut
  const [cvData, setCVData] = useState<CVData>(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // TODO: Valider avec Zod (cvSchema.parse(parsedData))
        // Pour l'instant, on assume que c'est correct
        // Vérifier si les clés attendues sont présentes, sinon retourner initialCVData
        if (parsedData && parsedData.personal && parsedData.skills) {
           return parsedData as CVData;
        } else {
           console.warn("Données localStorage invalides, retour à l'état initial.");
           localStorage.removeItem(LOCAL_STORAGE_KEY);
           return initialCVData;
        }
      }
    } catch (error) {
      console.error("Erreur lecture localStorage:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    return initialCVData; // Retourner l'objet initial bien typé
  });

  // Refs (inchangé)
  const personalFormRef = useRef<PersonalFormRef>(null);
  const experienceFormRef = useRef<ExperienceFormRef>(null);
  const educationFormRef = useRef<EducationFormRef>(null);
  const skillsFormRef = useRef<SkillsFormRef>(null);

  const formRefs = {
    personal: personalFormRef,
    experience: experienceFormRef,
    education: educationFormRef,
    skills: skillsFormRef,
    preview: null
  };

  // Sauvegarde localStorage (inchangé)
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cvData));
    } catch (error) {
      console.error("Erreur sauvegarde localStorage:", error);
    }
  }, [cvData]);

  // --- Fonctions de mise à jour avec les clés personal, experience, skills --- 
  const updatePersonal = (data: PersonalData) => {
    setCVData(prevData => ({
      ...prevData,
      personal: data, // Utiliser `personal`
    }));
    toast.success(t('saveSuccess.personal', { ns: 'common', defaultValue: "Informations personnelles enregistrées" }));
  };

  const saveExperiences = (data: ExperienceEntry[]) => {
    setCVData(prevData => ({
      ...prevData,
      experience: data, // Utiliser `experience`
    }));
    toast.success(t('saveSuccess.experience', { ns: 'common', defaultValue: "Expériences enregistrées" }));
  };

  const saveEducations = (data: EducationEntry[]) => {
    setCVData(prevData => ({
      ...prevData,
      education: data,
    }));
    toast.success(t('saveSuccess.education', { ns: 'common', defaultValue: "Formations enregistrées" }));
  };

  // saveSkills reçoit et sauvegarde directement SkillsData
  const saveSkills = (data: SkillsData) => {
    setCVData(prevData => ({
      ...prevData,
      skills: data, // Utiliser `skills`
    }));
    toast.success(t('saveSuccess.skills', { ns: 'common', defaultValue: "Compétences & Langues enregistrées" }));
  };

  // Navigation (inchangé)
  const handleNavigate = async (targetSection: Section) => {
    if (targetSection === currentSection) return;
    const currentFormRef = formRefs[currentSection];
    if (currentFormRef?.current?.triggerSubmit) {
      console.log(`Tentative de sauvegarde section: ${currentSection}`);
      const success = await currentFormRef.current.triggerSubmit();
      if (!success) {
          toast.error(t('errors.unsavedChanges', { ns: 'common', defaultValue: "Veuillez corriger les erreurs avant de continuer." }));
          return;
      }
       console.log(`Sauvegarde section ${currentSection} réussie.`);
    }
    setCurrentSection(targetSection);
  };

  // Rendu des sections avec les props initialData correspondantes
  const renderSection = () => {
    switch (currentSection) {
      case 'personal':
        return <PersonalForm ref={personalFormRef} initialData={cvData.personal} onSave={updatePersonal} />;

      case 'experience':
        return <ExperienceForm ref={experienceFormRef} initialData={cvData.experience || []} onSave={saveExperiences} />;

      case 'education':
        return <EducationForm ref={educationFormRef} initialData={cvData.education || []} onSave={saveEducations} />;

      case 'skills':
        // Passer cvData.skills directement
        return <SkillsForm ref={skillsFormRef} initialData={cvData.skills} onSave={saveSkills} />;

      case 'preview':
        // Passer cvData complet
        return <PreviewCV cvData={cvData} />;

      default:
        return null;
    }
  };

  // Téléchargement PDF (utiliser cvData.personal)
  const handleDownloadPDF = () => {
    if (currentSection !== 'preview') {
      toast.warning(t('errors.navigateToPreview', { ns: 'common', defaultValue: "Veuillez aller dans l'Aperçu pour télécharger." }));
      return;
    }
    const element = document.getElementById('cv-preview-area');
    if (!element) {
      toast.error(t('errors.previewAreaNotFound', { ns: 'common', defaultValue: "Erreur: Zone d'aperçu introuvable." }));
      return;
    }
    const opt = {
      margin: 0.5,
      filename: `CV_${cvData.personal.prenom || 'Prenom'}_${cvData.personal.nom || 'Nom'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    const promise = html2pdf().from(element).set(opt).save();
    toast.promise(promise, {
      loading: t('pdf.generating', { ns: 'common', defaultValue: 'Génération PDF...' }),
      success: t('pdf.success', { ns: 'common', defaultValue: 'PDF téléchargé !' }),
      error: t('pdf.error', { ns: 'common', defaultValue: 'Erreur génération PDF.' }),
    });
  };

  // Gestion dir RTL (inchangé)
  useEffect(() => {
    document.documentElement.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        <aside className="w-full md:w-72 bg-white p-4 md:p-6 shadow-lg flex flex-col border-r border-gray-200">
          <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-indigo-600 flex items-center gap-2 px-2">
            {t('header.title')} {/* Clé ajustée */}
          </h1>
          <nav className="space-y-1 flex-grow">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={currentSection === section.id ? "secondary" : "ghost"}
                className="w-full justify-start h-10 md:h-11"
                onClick={() => handleNavigate(section.id)}
              >
                <section.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                {/* Traduire le label de section */} 
                {t(`sidebar.${section.id}`)}
                {section.id !== 'preview' && (
                   <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            ))}
          </nav>
          <Button
            onClick={handleDownloadPDF}
            className="mt-6 w-full h-10 md:h-11"
          >
            <Download className="mr-2 h-4 w-4" />
            {t('ui.download')} {/* Clé ajustée */}
          </Button>
        </aside>

        <main className="flex-1 p-4 md:p-10 overflow-y-auto relative">
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
            <LanguageSelector />
          </div>
          {renderSection()}
        </main>
      </div>
      <Toaster richColors position="bottom-right" />
    </>
  );
}

export default App;