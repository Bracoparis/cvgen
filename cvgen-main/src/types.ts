import { z } from 'zod';

export type Section = 'personal' | 'experience' | 'education' | 'skills' | 'preview';

export const personalSchema = z.object({
  prenom: z.string().min(1, "Le prénom est requis."),
  nom: z.string().min(1, "Le nom est requis."),
  email: z.string().email("L'adresse email n'est pas valide.").min(1, "L'email est requis."),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  description: z.string().optional(),
  linkedin: z.string().url({ message: "L'URL LinkedIn n'est pas valide" }).optional().or(z.literal('')).optional(),
  github: z.string().url({ message: "L'URL GitHub n'est pas valide" }).optional().or(z.literal('')).optional(),
  portfolio: z.string().url({ message: "L'URL du portfolio n'est pas valide" }).optional().or(z.literal('')).optional(),
  titre: z.string().optional(),
});

export const experienceEntrySchema = z.object({
  poste: z.string().min(1, "Le poste est requis."),
  entreprise: z.string().min(1, "L'entreprise est requise."),
  debut: z.string().min(1, "La date de début est requise."),
  fin: z.string(),
  description: z.string().max(500, "La description ne peut pas dépasser 500 caractères.").optional(),
});

export const educationEntrySchema = z.object({
  diplome: z.string().min(1, "Le diplôme est requis."),
  ecole: z.string().min(1, "L'école est requise."),
  annee: z.string().optional(),
  etablissement: z.string().min(1, "L'établissement est requis."),
  debut: z.string().min(1, "La date de début est requise."),
  fin: z.string(),
  description: z.string().max(300, "La description ne peut pas dépasser 300 caractères.").optional(),
});

export const skillEntrySchema = z.object({
  nom: z.string().min(1, "Le nom de la compétence est requis."),
  niveau: z.enum(["Débutant", "Intermédiaire", "Avancé", "Expert"]).optional(),
});

export const skillsSchema = z.object({
  competences: z.array(z.string()),
  langues: z.array(z.string()),
});

export const cvDataSchema = z.object({
  personal: personalSchema,
  experience: z.array(experienceEntrySchema).optional(),
  education: z.array(educationEntrySchema).optional(),
  skills: skillsSchema,
});

export type SkillEntry = z.infer<typeof skillEntrySchema>;
export type PersonalData = z.infer<typeof personalSchema>;
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type SkillsData = z.infer<typeof skillsSchema>;
export type CVData = z.infer<typeof cvDataSchema>;

export const personalDataSchema = personalSchema;
export const personalInfoSchema = personalSchema;

/* Ancien code des interfaces (commenté/supprimé car types dérivés de Zod)
export interface ExperienceEntry {
  poste: string;
  entreprise: string;
  debut: string;
  fin: string;
  description: string;
}
export interface EducationEntry {
  diplome: string;
  ecole: string;
  annee: string;
}
export interface CVData {
  personal: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    description: string;
  };
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: {
    competences: string[];
    langues: string[];
  };
}
*/ 