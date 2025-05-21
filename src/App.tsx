import React, { useState, useEffect, useRef, lazy, Suspense, useMemo } from 'react';
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Importer seulement les références aux types et les composants légers
import { PersonalFormRef } from '@/components/PersonalForm';
import { ExperienceFormRef } from '@/components/ExperienceForm';
import { EducationFormRef } from '@/components/EducationForm';
import { SkillsFormRef } from '@/components/SkillsForm';
import LanguageSelector from '@/components/LanguageSelector';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import html2pdf from 'html2pdf.js';

// Lazy load des composants lourds
const PersonalForm = lazy(() => import('@/components/PersonalForm'));
const ExperienceForm = lazy(() => import('@/components/ExperienceForm'));
const EducationForm = lazy(() => import('@/components/EducationForm'));
const SkillsForm = lazy(() => import('@/components/SkillsForm'));
const PreviewCV = lazy(() => import('@/components/PreviewCV'));

// Sections (label sera traduit)
const sections: { id: Section; icon: React.ElementType }[] = [
  { id: 'personal', icon: User },
  { id: 'experience', icon: Briefcase },
  { id: 'education', icon: GraduationCap },
  { id: 'skills', icon: Award },
  { id: 'preview', icon: Eye },
];

const LOCAL_STORAGE_KEY = 'cv-creator-data-v2'; // Changer la clé si la structure change

// Valeur initiale pour CVData
const initialCVData: CVData = {
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
  } as PersonalData,
    experience: [],
    education: [],
    skills: {
      competences: [],
    langues: []
  },
};

// Composant de navigation mémorisé
const SidebarSection = React.memo(({ 
  section, 
  isActive, 
  onClick 
}: { 
  section: { id: Section; icon: React.ElementType }; 
  isActive: boolean; 
  onClick: () => void 
}) => {
  const { t } = useTranslation();
  const Icon = section.icon;

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start h-10 md:h-11"
      onClick={onClick}
    >
      <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
      {t(`sidebar.${section.id}`)}
      {section.id !== 'preview' && (
         <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
});

SidebarSection.displayName = 'SidebarSection';

// Composant pour les boutons de raccourcis
const ShortcutButton = React.memo(({ 
  icon: Icon, 
  path, 
  label 
}: { 
  icon: React.ElementType; 
  path: string; 
  label: string 
}) => {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="outline"
      className="w-full justify-start h-10 md:h-11"
      onClick={() => navigate(path)}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
});

ShortcutButton.displayName = 'ShortcutButton';

function App() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<Section>('personal');
  
  const [cvData, setCVData] = useState<CVData>(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData && parsedData.personal && parsedData.skills) {
           return parsedData as CVData;
        }
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    return initialCVData;
  });

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

  const [openAIResult, setOpenAIResult] = useState<string | null>(null);
  const [loadingOpenAI, setLoadingOpenAI] = useState(false);

  // Sauvegarde localStorage optimisée
  useEffect(() => {
    const saveToStorage = () => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cvData));
      } catch (error) {
        console.error("Erreur sauvegarde localStorage:", error);
      }
    };
    
    let idleCallbackId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    
    if (typeof window.requestIdleCallback === 'function') {
      idleCallbackId = window.requestIdleCallback(saveToStorage);
    } else {
      timeoutId = setTimeout(saveToStorage, 500);
    }
    
    return () => {
      if (idleCallbackId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [cvData]);

  const updatePersonal = (data: PersonalData) => {
    setCVData(prevData => ({ ...prevData, personal: data }));
    toast.success(t('saveSuccess.personal', { ns: 'common', defaultValue: "Informations personnelles enregistrées" }));
  };

  const saveExperiences = (data: ExperienceEntry[]) => {
    setCVData(prevData => ({ ...prevData, experience: data }));
    toast.success(t('saveSuccess.experience', { ns: 'common', defaultValue: "Expériences enregistrées" }));
  };

  const saveEducations = (data: EducationEntry[]) => {
    setCVData(prevData => ({ ...prevData, education: data }));
    toast.success(t('saveSuccess.education', { ns: 'common', defaultValue: "Formations enregistrées" }));
  };

  const saveSkills = (data: SkillsData) => {
    setCVData(prevData => ({ ...prevData, skills: data }));
    toast.success(t('saveSuccess.skills', { ns: 'common', defaultValue: "Compétences & Langues enregistrées" }));
  };

  const handleNavigate = async (targetSection: Section) => {
    if (targetSection === currentSection) return;
    const currentFormRef = formRefs[currentSection];
    if (currentFormRef?.current?.triggerSubmit) {
      const success = await currentFormRef.current.triggerSubmit();
      if (!success) {
        toast.error(t('errors.unsavedChanges', { ns: 'common', defaultValue: "Veuillez corriger les erreurs avant de continuer." }));
        return;
      }
    }
    // Appel OpenAI si on va vers Aperçu
    if (targetSection === 'preview') {
      setLoadingOpenAI(true);
      setOpenAIResult(null);
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: "Tu es un expert de la rédaction de CV. En utilisant les données suivantes, crée moi un CV professionel suivant les normes de France Travail, ainsi que des lettres de motivation types pour des offres d'emplois et des questions qui pourraient apparaitre lors d'entretiens basée sur les informations données."
              },
              {
                role: 'user',
                content: JSON.stringify(cvData, null, 2)
              }
            ]
          },
          {
            headers: {
              'Authorization': 'Bearer /',
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.data && response.data.choices && response.data.choices[0]) {
          setOpenAIResult(response.data.choices[0].message.content);
        } else {
          throw new Error('Format de réponse OpenAI invalide');
        }
      } catch (error) {
        console.error('Erreur OpenAI:', error);
        if (axios.isAxiosError(error)) {
          setOpenAIResult(`Erreur lors de la génération du CV: ${error.response?.data?.error?.message || error.message}`);
        } else {
          setOpenAIResult('Erreur lors de la génération du CV par OpenAI.');
        }
      } finally {
        setLoadingOpenAI(false);
      }
    }
    setCurrentSection(targetSection);
  };

  const renderSection = useMemo(() => (
    <Suspense fallback={<LoadingSpinner size="large" />}>
      {(() => {
        switch (currentSection) {
          case 'personal':
            return <PersonalForm ref={personalFormRef} initialData={cvData.personal} onSave={updatePersonal} />;
          case 'experience':
            return <ExperienceForm ref={experienceFormRef} initialData={cvData.experience || []} onSave={saveExperiences} />;
          case 'education':
            return <EducationForm ref={educationFormRef} initialData={cvData.education || []} onSave={saveEducations} />;
          case 'skills':
            return <SkillsForm ref={skillsFormRef} initialData={cvData.skills} onSave={saveSkills} />;
          case 'preview':
            return <PreviewCV cvData={cvData} openAIResult={openAIResult} loadingOpenAI={loadingOpenAI} />;
          default:
            return null;
        }
      })()}
    </Suspense>
  ), [currentSection, cvData, updatePersonal, saveExperiences, saveEducations, saveSkills, openAIResult, loadingOpenAI]);

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

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
  }, [i18n, i18n.language]);

  const sidebarNavigation = useMemo(() => (
    <nav className="space-y-1 flex-grow">
      {sections.map((section) => (
        <SidebarSection
          key={section.id}
          section={section}
          isActive={currentSection === section.id}
          onClick={() => handleNavigate(section.id)}
        />
      ))}
    </nav>
  ), [currentSection]);

  const shortcuts = useMemo(() => (
    <div className="space-y-2">
      <ShortcutButton 
        icon={Briefcase} 
        path="/offres-emploi" 
        label={t('sidebar.jobOffers', 'Offres d\'emploi')}
      />
      <ShortcutButton 
        icon={GraduationCap} 
        path="/formation" 
        label={t('sidebar.training', 'Se former')}
                  />
                </div>
  ), [t]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        <aside className="w-full md:w-72 bg-white p-4 md:p-6 shadow-lg flex flex-col border-r border-gray-200">
          <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-indigo-600 flex items-center gap-2 px-2">
            {t('header.title')} {/* Clé ajustée */}
          </h1>
          {sidebarNavigation}
          <Button
            onClick={handleDownloadPDF}
            className="mt-6 w-full h-10 md:h-11"
          >
            <Download className="mr-2 h-4 w-4" />
            {t('ui.download')} {/* Clé ajustée */}
          </Button>
          
          {/* Raccourcis vers les autres pages */}
          <div className="mt-8 border-t border-gray-200 pt-4">
            <h2 className="text-sm font-semibold text-gray-500 mb-3 px-2">
              {t('sidebar.shortcuts', 'Raccourcis')}
            </h2>
            {shortcuts}
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => { localStorage.removeItem(LOCAL_STORAGE_KEY); window.location.reload(); }}
            >
              Réinitialiser le CV
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-10 overflow-y-auto relative">
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
            <LanguageSelector />
          </div>
          {renderSection}
        </main>
      </div>
      <Toaster richColors position="bottom-right" />
    </>
  );
}

// Éviter les re-renders inutiles
export default React.memo(App);