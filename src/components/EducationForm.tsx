import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

export interface EducationEntry {
  etablissement: string;
  diplome: string;
  debut: string;
  fin: string;
}

interface EducationFormProps {
  initialData: EducationEntry[];
  onSave: (data: EducationEntry[]) => void;
}

export interface EducationFormRef {
  triggerSubmit: () => Promise<boolean>;
}

const EducationForm = forwardRef<EducationFormRef, EducationFormProps>(({ initialData, onSave }, ref) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<{ education: EducationEntry[] }>({
    defaultValues: { education: initialData },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  // Reset le formulaire à chaque changement de initialData
  useEffect(() => {
    reset({ education: initialData });
  }, [initialData, reset]);

  // Pour la navigation (App.tsx), expose triggerSubmit
  const validationResultRef = useRef<boolean | null>(null);

  const handleValidSubmit = (data: { education: EducationEntry[] }) => {
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
    append({ etablissement: '', diplome: '', debut: '', fin: '' });
  };

  return (
    <form>
      <Card className="border-gray-200 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            Formations
          </CardTitle>
          <Button size="sm" type="button" onClick={handleAddNewEducation}>
            <Plus className="mr-2 w-4 h-4" /> Ajouter
          </Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {fields.length === 0 && (
            <p className="text-muted-foreground italic text-center py-4">Aucune formation ajoutée.</p>
          )}
          {fields.map((field, index) => (
            <Card key={field.id} className="bg-gray-50/80 border-gray-200/80 relative group overflow-hidden transition-all duration-150 ease-in-out hover:shadow-md hover:border-gray-300">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 h-7 w-7 text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-150"
                aria-label="Supprimer cette formation"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Formation #{index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1.5">
                    <Label>Établissement</Label>
                    <Controller
                      name={`education.${index}.etablissement`}
                      control={control}
                      render={({ field }) => <Input {...field} />}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Diplôme</Label>
                    <Controller
                      name={`education.${index}.diplome`}
                      control={control}
                      render={({ field }) => <Input {...field} />}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Date de début</Label>
                    <Controller
                      name={`education.${index}.debut`}
                      control={control}
                      render={({ field }) => <Input {...field} />}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Date de fin</Label>
                    <Controller
                      name={`education.${index}.fin`}
                      control={control}
                      render={({ field }) => <Input {...field} />}
                    />
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