import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PersonalData, personalSchema } from '@/types';

// Importer les composants Shadcn
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PersonalFormProps {
  initialData: PersonalData;
  onSave: (data: PersonalData) => void;
}

// Interface pour la ref
export interface PersonalFormRef {
  triggerSubmit: () => Promise<boolean>; // Retourne true si succès, false si échec
}

// Utiliser forwardRef pour passer la ref
const PersonalForm = forwardRef<PersonalFormRef, PersonalFormProps>(({ initialData, onSave }, ref) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
    defaultValues: initialData,
    mode: 'onChange',
  });

  // Ref pour stocker le résultat de la validation
  const validationResultRef = useRef<boolean | null>(null);

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  // Fonction interne pour soumission valide
  const handleValidSubmit = (data: PersonalData) => {
    onSave(data);
    validationResultRef.current = true; // Stocker succès
  };

  // Fonction interne pour soumission invalide
  const handleInvalidSubmit = () => {
    validationResultRef.current = false; // Stocker échec
  };

  // Exposer la fonction triggerSubmit
  useImperativeHandle(ref, () => ({
    triggerSubmit: async () => {
      validationResultRef.current = null; // Réinitialiser avant de soumettre
      await handleSubmit(handleValidSubmit, handleInvalidSubmit)();
      // Retourner la valeur stockée dans la ref
      return validationResultRef.current ?? false; 
    }
  }));

  // Note: Le <form> n'a plus besoin de son propre onSubmit ici,
  // car la soumission sera déclenchée par la ref depuis App.tsx.
  // On peut le garder si on veut un bouton Enregistrer DANS le formulaire.
  return (
    <form>
      <Card className="border-gray-200 shadow-md">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            {t('personalInfo.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="prenom">{t('personalInfo.firstName')}</Label>
              <Controller
                name="prenom"
                control={control}
                render={({ field }) => <Input id="prenom" {...field} />}
              />
              {errors.prenom && <p className="text-xs text-red-600 mt-1">{t(errors.prenom.message as string)}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nom">{t('personalInfo.lastName')}</Label>
              <Controller
                name="nom"
                control={control}
                render={({ field }) => <Input id="nom" {...field} />}
              />
              {errors.nom && <p className="text-xs text-red-600 mt-1">{t(errors.nom.message as string)}</p>}
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="titre">{t('personalInfo.jobTitle')}</Label>
              <Controller
                name="titre"
                control={control}
                render={({ field }) => <Input id="titre" {...field} placeholder={t('personalInfo.jobTitlePlaceholder', {defaultValue: "Ex: Développeur Web"})} /> }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t('personalInfo.email')}</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <Input id="email" type="email" {...field} />}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{t(errors.email.message as string)}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telephone">{t('personalInfo.phoneNumber')}</Label>
              <Controller
                name="telephone"
                control={control}
                render={({ field }) => <Input id="telephone" type="tel" {...field} />}
              />
              {errors.telephone && <p className="text-xs text-red-600 mt-1">{t(errors.telephone.message as string)}</p>}
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="adresse">{t('personalInfo.address')}</Label>
              <Controller
                name="adresse"
                control={control}
                render={({ field }) => <Input id="adresse" {...field} />}
              />
              {errors.adresse && <p className="text-xs text-red-600 mt-1">{t(errors.adresse.message as string)}</p>}
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="description">{t('personalInfo.description')}</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    className="resize-none"
                    placeholder={t('personalInfo.descriptionPlaceholder', { defaultValue: 'Décrivez-vous brièvement...' })}
                    rows={4}
                    {...field}
                  />
                )}
              />
              <p className="text-xs text-muted-foreground">
                {t('personalInfo.descriptionHelper')}
              </p>
              {errors.description && <p className="text-xs text-red-600 mt-1">{t(errors.description.message as string)}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
});

export default PersonalForm; 