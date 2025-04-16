import React from 'react';
import { useTranslation } from 'react-i18next';
import { CVData, ExperienceEntry, EducationEntry, SkillEntry } from '@/types';
import { Briefcase, GraduationCap, Award, Mail, Phone, MapPin, Globe } from 'lucide-react';

// Importer Card de Shadcn
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Utiliser Badge pour compétences/langues

interface PreviewCVProps {
  cvData: CVData;
}

const PreviewCV: React.FC<PreviewCVProps> = ({ cvData }) => {
  const { t } = useTranslation();

  // Utiliser les bons chemins d'accès aux données
  const personal = cvData.personal || {};
  const firstName = personal.prenom || t('preview.defaultFirstName');
  const lastName = personal.nom || t('preview.defaultLastName');
  const jobTitle = personal.titre || '';
  const email = personal.email || t('preview.defaultEmail');
  const phone = personal.telephone || t('preview.defaultPhone');
  const address = personal.adresse || t('preview.defaultAddress');
  const description = personal.description || '';

  const experiences = cvData.experience || [];
  const education = cvData.education || [];
  const skills = cvData.skills?.competences || []; 
  const languages = cvData.skills?.langues || [];

  return (
    // Utiliser Card comme conteneur principal
    <Card id="cv-preview-area" className="max-w-4xl mx-auto shadow-lg border-gray-200 print:shadow-none print:border-none bg-white text-gray-800">
      <CardHeader className="text-center border-b pb-6 md:pb-8 border-gray-200">
        <CardTitle className="text-3xl md:text-4xl font-bold">
          {firstName} {lastName}
        </CardTitle>
        {jobTitle && (
          <p className="text-indigo-600 font-medium text-lg mt-1">{jobTitle}</p>
        )}
        <div className="mt-4 text-muted-foreground space-y-2 text-sm md:text-base">
          {/* Contact Info */} 
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
            {email !== t('preview.defaultEmail') && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/>{email}</span>}
            {phone !== t('preview.defaultPhone') && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/>{phone}</span>}
            {address !== t('preview.defaultAddress') && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/>{address}</span>}
          </div>
        </div>
        {description && (
          <p className="mt-5 text-gray-700 max-w-2xl mx-auto text-sm md:text-base italic">
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-6 md:p-10 space-y-10 md:space-y-12">
        {/* Expérience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-indigo-700 mb-5 flex items-center gap-3">
              <Briefcase className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              {t('preview.experiences')}
            </h2>
            <div className="space-y-6 ml-2">
              {experiences.map((exp: ExperienceEntry, index: number) => (
                <div key={index} className="border-l-2 border-indigo-200 pl-6 pb-6 relative last:pb-0 last:border-transparent">
                  <span className="absolute -left-[11px] top-1 h-5 w-5 bg-indigo-600 rounded-full border-4 border-white"></span>
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                    <h3 className="font-semibold text-md md:text-lg text-gray-900">{exp.poste || t('preview.defaultPosition')}</h3>
                    <p className="text-gray-500 text-xs md:text-sm font-medium mt-1 sm:mt-0 flex-shrink-0 sm:ml-4">
                      {exp.debut || t('preview.defaultStartDate')} - {exp.fin || t('preview.defaultEndDate')}
                    </p>
                  </div>
                  <p className="text-sm md:text-base font-medium text-gray-600 mb-2">{exp.entreprise || t('preview.defaultCompany')}</p>
                  {exp.description && <p className="text-gray-600 text-sm md:text-sm leading-relaxed prose prose-sm max-w-none">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Éducation */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-teal-700 mb-5 flex items-center gap-3">
              <GraduationCap className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              {t('preview.education')}
            </h2>
            <div className="space-y-6 ml-2">
              {education.map((edu: EducationEntry, index: number) => (
                <div key={index} className="border-l-2 border-teal-200 pl-6 pb-6 relative last:pb-0 last:border-transparent">
                  <span className="absolute -left-[11px] top-1 h-5 w-5 bg-teal-600 rounded-full border-4 border-white"></span>
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                    <h3 className="font-semibold text-md md:text-lg text-gray-900">{edu.diplome || t('preview.defaultDegree')}</h3>
                    <p className="text-gray-500 text-xs md:text-sm font-medium mt-1 sm:mt-0 flex-shrink-0 sm:ml-4">
                      {edu.debut || ''} - {edu.fin || ''}
                    </p>
                  </div>
                  <p className="text-sm md:text-base font-medium text-gray-600 mb-2">{edu.etablissement || edu.ecole || ''}</p>
                  {edu.description && <p className="text-gray-600 text-sm md:text-sm leading-relaxed prose prose-sm max-w-none">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Compétences */}
        {skills.length > 0 && (
          <section>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
              <Award className="w-4 h-4 md:w-5 md:h-5" />
              {t('preview.skillsTitle', { defaultValue: "Technical Skills" })}
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="print:relative print:top-px">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Langues */}
        {languages.length > 0 && (
          <section className="mt-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
              <Globe className="w-4 h-4 md:w-5 md:h-5" />
              {t('preview.languagesTitle', { defaultValue: "Languages" })}
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {languages.map((language: string, index: number) => (
                <Badge key={index} variant="outline" className="border-blue-300 text-blue-700 print:relative print:top-px">
                  {language}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </CardContent>
       {/* CardFooter n'est pas forcément utile ici, le bouton Télécharger est dans App.tsx */}
    </Card>
  );
};

export default PreviewCV; 