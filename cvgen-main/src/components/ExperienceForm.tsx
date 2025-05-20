import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ExperienceEntry, experienceEntrySchema } from '@/types';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

// Importer les composants Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Schéma Zod pour le formulaire complet
const experienceFormSchema = z.object({
  experience: z.array(experienceEntrySchema),
});

// Type dérivé pour les données du formulaire
type ExperienceFormData = z.infer<typeof experienceFormSchema>;

// Interface pour les props
interface ExperienceFormProps {
  initialData: ExperienceEntry[];
  onSave: (data: ExperienceEntry[]) => void;
}

// Interface Ref
export interface ExperienceFormRef {
    triggerSubmit: () => Promise<boolean>;
}

const ExperienceForm = forwardRef<ExperienceFormRef, ExperienceFormProps>(({ initialData, onSave }, ref) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: { experience: initialData }, 
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience"
  });

  const validationResultRef = useRef<boolean | null>(null);

  useEffect(() => {
    reset({ experience: initialData });
  }, [initialData, reset]);

  const handleValidSubmit = (data: ExperienceFormData) => {
    onSave(data.experience);
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

  const handleAddNewExperience = () => {
    append({ poste: '', entreprise: '', debut: '', fin: '', description: '' });
  };

  return (
    <form>
      <Card className="border-gray-200 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="space-y-1.5">
            <CardTitle className="text-xl flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              {t('experience.title')}
            </CardTitle>
            <CardDescription>{t('experience.description')}</CardDescription>
          </div>
          <Button size="sm" type="button" onClick={handleAddNewExperience}>
            <Plus className="mr-2 w-4 h-4" /> {t('experience.add')}
          </Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {fields.length === 0 && (
            <p className="text-muted-foreground italic text-center py-4">{t('experience.noExperience')}</p>
          )}
          {fields.map((field, index) => (
            <Card key={field.id} className="bg-gray-50/80 border-gray-200/80 relative group overflow-hidden transition-all duration-150 ease-in-out hover:shadow-md hover:border-gray-300">
              <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 h-7 w-7 text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-150"
                  aria-label={t('experience.removeExperienceAria')}
                >
                  <Trash2 className="w-4 h-4" />
              </Button>
              <CardHeader className="pb-2">
                 <CardTitle className="text-base">{t('experience.experienceCardTitle', { index: index + 1 })}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor={`experience-${index}-poste`}>{t('experience.position')}</Label>
                    <Controller
                      name={`experience.${index}.poste`}
                      control={control}
                      render={({ field }) => (
                        <Input id={`experience-${index}-poste`} {...field} />
                      )}
                    />
                    {errors.experience?.[index]?.poste && <p className="text-xs text-red-600 mt-1">{t(errors.experience[index]?.poste?.message as string)}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`experience-${index}-entreprise`}>{t('experience.company')}</Label>
                    <Controller
                      name={`experience.${index}.entreprise`}
                      control={control}
                      render={({ field }) => (
                        <Input id={`experience-${index}-entreprise`} {...field} />
                      )}
                    />
                     {errors.experience?.[index]?.entreprise && <p className="text-xs text-red-600 mt-1">{t(errors.experience[index]?.entreprise?.message as string)}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`experience-${index}-debut`}>{t('experience.startDate')}</Label>
                    <Controller
                      name={`experience.${index}.debut`}
                      control={control}
                      render={({ field }) => (
                        <Input id={`experience-${index}-debut`} placeholder={t('experience.startDatePlaceholder')} {...field} />
                      )}
                    />
                    {errors.experience?.[index]?.debut && <p className="text-xs text-red-600 mt-1">{t(errors.experience[index]?.debut?.message as string)}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`experience-${index}-fin`}>{t('experience.endDate')}</Label>
                    <Controller
                      name={`experience.${index}.fin`}
                      control={control}
                      render={({ field }) => (
                        <Input id={`experience-${index}-fin`} placeholder={t('experience.endDatePlaceholder')} {...field} />
                      )}
                    />
                     {errors.experience?.[index]?.fin && <p className="text-xs text-red-600 mt-1">{t(errors.experience[index]?.fin?.message as string)}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <Label htmlFor={`experience-${index}-description`}>{t('experience.tasks')}</Label>
                    <Controller
                      name={`experience.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          id={`experience-${index}-description`}
                          rows={4}
                          className="resize-none"
                          placeholder={t('experience.tasksPlaceholder')}
                          {...field}
                        />
                      )}
                    />
                     {errors.experience?.[index]?.description && <p className="text-xs text-red-600 mt-1">{t(errors.experience[index]?.description?.message as string)}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </form>
  );
});

export default ExperienceForm; 