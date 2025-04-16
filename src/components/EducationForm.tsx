import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Education, educationEntrySchema } from '@/types';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Schéma Zod pour le formulaire
const educationFormSchema = z.object({
  education: z.array(educationEntrySchema),
});

// Type dérivé
type EducationFormData = z.infer<typeof educationFormSchema>;

// Interface props
interface EducationFormProps {
  initialData: Education[];
  onSave: (data: Education[]) => void;
}

// Interface Ref
export interface EducationFormRef {
    triggerSubmit: () => Promise<boolean>;
}

const EducationForm = forwardRef<EducationFormRef, EducationFormProps>(({ initialData, onSave }, ref) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<EducationFormData>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: { education: initialData },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education"
  });

  const validationResultRef = useRef<boolean | null>(null);

  useEffect(() => {
    reset({ education: initialData });
  }, [initialData, reset]);

  const handleValidSubmit = (data: EducationFormData) => {
    onSave(data.education);
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

  const handleAddNewEducation = () => {
    append({ etablissement: '', diplome: '', debut: '', fin: '', description: '' });
  };

  return (
    <form>
      <Card className="border-gray-200 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="space-y-1.5">
            <CardTitle className="text-xl flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              {t('education.title')}
            </CardTitle>
            <CardDescription>{t('education.description')}</CardDescription>
          </div>
          <Button size="sm" type="button" onClick={handleAddNewEducation}>
            <Plus className="mr-2 w-4 h-4" /> {t('education.add')}
          </Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {fields.length === 0 && (
            <p className="text-muted-foreground italic text-center py-4">{t('education.noEducation')}</p>
          )}
          {fields.map((field, index) => (
            <Card key={field.id} className="bg-gray-50/80 border-gray-200/80 relative group overflow-hidden transition-all duration-150 ease-in-out hover:shadow-md hover:border-gray-300">
              <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 h-7 w-7 text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-150"
                  aria-label={t('education.removeEducationAria')}
                >
                  <Trash2 className="w-4 h-4" />
              </Button>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('education.educationCardTitle', { index: index + 1 })}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor={`education-${index}-etablissement`}>{t('education.institution')}</Label>
                    <Controller
                      name={`education.${index}.etablissement`}
                      control={control}
                      render={({ field }) => (
                        <Input id={`education-${index}-etablissement`} {...field} />
                      )}
                    />
                    {errors.education?.[index]?.etablissement && <p className="text-xs text-red-600 mt-1">{t(errors.education[index]?.etablissement?.message as string)}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`education-${index}-diplome`}>{t('education.degree')}</Label>
                    <Controller
                      name={`education.${index}.diplome`}
                      control={control}
                      render={({ field }) => (
                        <Input id={`education-${index}-diplome`} {...field} />
                      )}
                    />
                    {errors.education?.[index]?.diplome && <p className="text-xs text-red-600 mt-1">{t(errors.education[index]?.diplome?.message as string)}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`education-${index}-debut`}>{t('education.startDate')}</Label>
                    <Controller
                      name={`education.${index}.debut`}
                      control={control}
                      render={({ field }) => (
                        <Input id={`education-${index}-debut`} placeholder={t('education.startDatePlaceholder')} {...field} />
                      )}
                    />
                    {errors.education?.[index]?.debut && <p className="text-xs text-red-600 mt-1">{t(errors.education[index]?.debut?.message as string)}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`education-${index}-fin`}>{t('education.endDate')}</Label>
                    <Controller
                      name={`education.${index}.fin`}
                      control={control}
                      render={({ field }) => (
                        <Input id={`education-${index}-fin`} placeholder={t('education.endDatePlaceholder')} {...field} />
                      )}
                    />
                    {errors.education?.[index]?.fin && <p className="text-xs text-red-600 mt-1">{t(errors.education[index]?.fin?.message as string)}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <Label htmlFor={`education-${index}-description`}>{t('education.details')}</Label>
                    <Controller
                      name={`education.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          id={`education-${index}-description`}
                          rows={3}
                          className="resize-none"
                          placeholder={t('education.detailsPlaceholder')}
                          {...field}
                        />
                      )}
                    />
                     {errors.education?.[index]?.description && <p className="text-xs text-red-600 mt-1">{t(errors.education[index]?.description?.message as string)}</p>}
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

export default EducationForm; 