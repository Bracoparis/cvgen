import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SkillsData, skillsSchema } from '@/types'; // Utiliser le schéma existant pour la structure globale
import { Award, Languages, Plus, Trash2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from 'sonner'; // Importer toast pour les messages locaux

// Adapter le schéma local pour utiliser SkillEntry
// Ce schéma gère la validation du formulaire entier, y compris les inputs temporaires
const skillsLocalFormSchema = z.object({
  // L'array de compétences/langues devrait utiliser le schéma d'entrée
  // Note: Le schéma original `skillsSchema` dans types/cv.ts est peut-être pour la donnée CV finale?
  // Ici, on suppose que les compétences sont des objets { nom: string, niveau?: string }
  // ou juste des strings comme géré actuellement.
  // *Ajustement* : Pour l'instant, on garde les compétences comme string[] pour matcher le code existant.
  // Si la structure doit changer pour { nom, niveau }, il faudra refactoriser la logique d'ajout/suppression.
  competences: z.array(z.string()).optional(),
  langues: z.array(z.string()).optional(),
  newSkillInput: z.string().optional(),
  newLanguageInput: z.string().optional(),
});
type SkillsLocalFormData = z.infer<typeof skillsLocalFormSchema>;

// Interface props - Ajuster pour utiliser SkillsData
interface SkillsFormProps {
  initialData: SkillsData; // Utiliser SkillsData pour initialData
  onSave: (data: SkillsData) => void; // Attendre SkillsData (non optionnel)
}

// Interface Ref
export interface SkillsFormRef {
    triggerSubmit: () => Promise<boolean>;
}

const SkillsForm = forwardRef<SkillsFormRef, SkillsFormProps>(({ initialData, onSave }, ref) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<SkillsLocalFormData>({
    resolver: zodResolver(skillsLocalFormSchema),
    defaultValues: {
      // Assurer que les valeurs initiales correspondent à SkillsData
      competences: initialData?.competences || [], 
      langues: initialData?.langues || [],
      newSkillInput: '',
      newLanguageInput: ''
    },
    mode: 'onChange',
  });

  const competences = watch('competences');
  const langues = watch('langues');
  const validationResultRef = useRef<boolean | null>(null);

  useEffect(() => {
    reset({
        competences: initialData?.competences ?? [],
        langues: initialData?.langues ?? [],
        newSkillInput: '',
        newLanguageInput: ''
    });
  }, [initialData, reset]);

  const handleValidSubmit = (data: SkillsLocalFormData) => {
    // Exclure les inputs temporaires avant de sauvegarder
    const { newSkillInput, newLanguageInput, ...skillsToSave } = data;
    onSave(skillsToSave);
    validationResultRef.current = true;
  };

  const handleInvalidSubmit = () => {
      validationResultRef.current = false;
  };

  useImperativeHandle(ref, () => ({
    triggerSubmit: async () => {
      validationResultRef.current = null;
      await handleSubmit(handleValidSubmit, handleInvalidSubmit)();
      return validationResultRef.current ?? false;
    }
  }));

  const handleAddSkill = () => {
    const newSkillValue = getValues("newSkillInput")?.trim();
    if (newSkillValue) {
      const currentSkills = getValues("competences") || [];
      if (!currentSkills.includes(newSkillValue)) {
        setValue("competences", [...currentSkills, newSkillValue], { shouldValidate: true, shouldDirty: true });
        setValue("newSkillInput", "");
        toast.success(t('skills.toast.skillAdded', { skill: newSkillValue }));
      } else {
         toast.info(t('skills.toast.skillExists', { skill: newSkillValue }));
         setValue("newSkillInput", "");
      }
    } else {
       toast.warning(t('skills.toast.skillEmpty'));
    }
  };

  const handleRemoveSkill = (index: number) => {
    const currentSkills = getValues("competences") || [];
    const skillToRemove = currentSkills[index];
    setValue("competences", currentSkills.filter((_, i) => i !== index), { shouldValidate: true, shouldDirty: true });
    if(skillToRemove) toast.info(t('skills.toast.skillRemoved', { skill: skillToRemove }));
  };

  const handleAddLanguage = () => {
    const newLangValue = getValues("newLanguageInput")?.trim();
    if (newLangValue) {
       const currentLangs = getValues("langues") || [];
      if (!currentLangs.includes(newLangValue)) {
        setValue("langues", [...currentLangs, newLangValue], { shouldValidate: true, shouldDirty: true });
        setValue("newLanguageInput", "");
         toast.success(t('skills.toast.languageAdded', { language: newLangValue }));
      } else {
         toast.info(t('skills.toast.languageExists', { language: newLangValue }));
         setValue("newLanguageInput", "");
      }
    } else {
       toast.warning(t('skills.toast.languageEmpty'));
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const currentLangs = getValues("langues") || [];
    const langToRemove = currentLangs[index];
    setValue("langues", currentLangs.filter((_, i) => i !== index), { shouldValidate: true, shouldDirty: true });
     if(langToRemove) toast.info(t('skills.toast.languageRemoved', { language: langToRemove }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };
   const handleLanguageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLanguage();
    }
  };

  return (
    <form>
      <Card className="border-gray-200 shadow-md">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
             {t('skills.title')}
          </CardTitle>
          <CardDescription>{t('skills.description')}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section Compétences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
               {t('skills.technicalSkills')}
            </h3>
            <div className="flex gap-2 items-center">
              <Controller
                name="newSkillInput"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder={t('skills.addSkillPlaceholder')}
                    onKeyDown={handleSkillKeyDown}
                    aria-label={t('skills.addPlaceholder')}
                   />
                )}
              />
              <Button size="sm" type="button" onClick={handleAddSkill}>
                <Plus className="mr-1.5 w-4 h-4" /> {t('skills.add')}
              </Button>
            </div>
            {(competences?.length ?? 0) > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {competences?.map((skill, index) => (
                  <Badge key={`${skill}-${index}`} variant="secondary" className="relative group pr-7">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="absolute -right-1 -top-1 rounded-full bg-gray-200 text-gray-500 hover:bg-red-200 hover:text-red-700 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={t('skills.removeSkillAria', { skill: skill })}
                    >
                       <Trash2 className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-sm">{t('skills.noSkills')}</p>
            )}
          </div>

          {/* Section Langues */}
          <div className="space-y-4 lg:border-l lg:pl-8">
             <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <Languages className="w-5 h-5" />
                 {t('skills.languages')}
             </h3>
            <div className="flex gap-2 items-center">
               <Controller
                name="newLanguageInput"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder={t('skills.addLanguagePlaceholder')}
                    onKeyDown={handleLanguageKeyDown}
                    aria-label={t('skills.addPlaceholder')}
                   />
                 )}
               />
              <Button size="sm" type="button" onClick={handleAddLanguage}>
                <Plus className="mr-1.5 w-4 h-4" /> {t('skills.add')}
              </Button>
            </div>
            {(langues?.length ?? 0) > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {langues?.map((langue, index) => (
                  <Badge key={`${langue}-${index}`} variant="outline" className="relative group pr-7 border-blue-300 text-blue-700">
                    {langue}
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(index)}
                      className="absolute -right-1 -top-1 rounded-full bg-blue-100 text-blue-500 hover:bg-red-200 hover:text-red-700 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={t('skills.removeLanguageAria', { language: langue })}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-sm">{t('skills.noLanguages')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
});

export default SkillsForm; 