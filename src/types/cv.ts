import { z } from "zod";

// Schéma Zod pour une entrée d'expérience
export const experienceEntrySchema = z.object({
  poste: z.string().min(1, { message: "experience.validation.positionRequired" }),
  entreprise: z.string().min(1, { message: "experience.validation.companyRequired" }),
  debut: z.string().min(1, { message: "experience.validation.startDateRequired" }),
  fin: z.string(),
  description: z.string().max(500, { message: "experience.validation.tasksMaxLength" })
});

// Schéma Zod pour une entrée d'éducation
export const educationEntrySchema = z.object({
  etablissement: z.string().min(1, { message: "education.validation.institutionRequired" }),
  diplome: z.string().min(1, { message: "education.validation.degreeRequired" }),
  debut: z.string().min(1, { message: "education.validation.startDateRequired" }),
  fin: z.string(),
  description: z.string().max(300, { message: "education.validation.descriptionMaxLength" })
});

// Schéma Zod pour une entrée de compétence (Utilisé dans le tableau `competences`)
export const skillEntrySchema = z.object({
  nom: z.string().min(1, { message: "skills.validation.skillRequired" }),
  niveau: z.enum(["Débutant", "Intermédiaire", "Avancé", "Expert"], { errorMap: () => ({ message: "skills.validation.levelInvalid" }) }).optional()
});

// Schéma Zod pour les informations personnelles (utilisé dans PersonalForm)
// Renommé temporairement en personalDataSchema pour correspondre à l'usage
export const personalDataSchema = z.object({
  nom: z.string().min(1, { message: "personalInfo.validation.lastNameRequired" }),
  prenom: z.string().min(1, { message: "personalInfo.validation.firstNameRequired" }),
  email: z.string().email({ message: "personalInfo.validation.emailInvalid" }).min(1, { message: "personalInfo.validation.emailRequired" }),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  linkedin: z.string().url({ message: "personalInfo.validation.linkedinInvalid" }).optional().or(z.literal('')),
  github: z.string().url({ message: "personalInfo.validation.githubInvalid" }).optional().or(z.literal('')),
  portfolio: z.string().url({ message: "personalInfo.validation.portfolioInvalid" }).optional().or(z.literal('')),
  titre: z.string().optional(),
  description: z.string().max(300, { message: "personalInfo.validation.descriptionMaxLength" }).optional()
});

// Types dérivés pour les entrées individuelles
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type SkillEntry = z.infer<typeof skillEntrySchema>;
export type PersonalData = z.infer<typeof personalDataSchema>; // Type pour le formulaire

// --- Schéma Global du CV (Adapté à la structure attendue par App.tsx) ---

// Schéma pour la section skills (compétences et langues)
// Langues reste un string[] pour l'instant car géré ainsi dans SkillsForm
export const skillsSchema = z.object({
    competences: z.array(z.string()),
    langues: z.array(z.string())
});

// Type pour les données du formulaire skills
export type SkillsData = z.infer<typeof skillsSchema>;

// Schéma global principal
export const cvSchema = z.object({
  personal: personalDataSchema, // Utilise `personal`
  experience: z.array(experienceEntrySchema).optional(), // Utilise `experience`
  education: z.array(educationEntrySchema).optional(),
  skills: skillsSchema // Utilise `skills` contenant competences et langues
});

// Type global du CV dérivé du schéma
export type CVData = z.infer<typeof cvSchema>;

// Exports renommés pour compatibilité (si d'anciens imports existent)
// L'alias de type PersonalInfoFormData est supprimé, utiliser PersonalData directement.
export const personalInfoSchema = personalDataSchema; // Alias Schéma
// Les autres alias de schémas sont supprimés car redondants.