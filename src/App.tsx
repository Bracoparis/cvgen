import React, { useState } from 'react';
import { ChevronRight, Download, User, Briefcase, GraduationCap, Phone, Languages, Award, Plus, Trash2, Eye } from 'lucide-react';

type Section = 'personal' | 'experience' | 'education' | 'skills' | 'preview';

interface CVData {
  personal: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    description: string; // Nouveau champ
  };
  experience: {
    poste: string;
    entreprise: string;
    debut: string;
    fin: string;
    description: string;
  }[];
  education: {
    diplome: string;
    ecole: string;
    annee: string;
  }[];
  skills: {
    competences: string[];
    langues: string[];
  };
}

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('personal');
  const [cvData, setCVData] = useState<CVData>({
    personal: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      description: '', // Initialisation du nouveau champ
    },
    experience: [],
    education: [],
    skills: {
      competences: [],
      langues: [],
    },
  });
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const updatePersonal = (field: keyof CVData['personal'], value: string) => {
    setCVData({
      ...cvData,
      personal: {
        ...cvData.personal,
        [field]: value,
      },
    });
  };

  const addExperience = () => {
    setCVData({
      ...cvData,
      experience: [
        ...cvData.experience,
        {
          poste: '',
          entreprise: '',
          debut: '',
          fin: '',
          description: '',
        },
      ],
    });
  };

  const updateExperience = (index: number, field: keyof CVData['experience'][0], value: string) => {
    const newExperience = [...cvData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setCVData({ ...cvData, experience: newExperience });
  };

  const removeExperience = (index: number) => {
    setCVData({
      ...cvData,
      experience: cvData.experience.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setCVData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          diplome: '',
          ecole: '',
          annee: '',
        },
      ],
    });
  };

  const updateEducation = (index: number, field: keyof CVData['education'][0], value: string) => {
    const newEducation = [...cvData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setCVData({ ...cvData, education: newEducation });
  };

  const removeEducation = (index: number) => {
    setCVData({
      ...cvData,
      education: cvData.education.filter((_, i) => i !== index),
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setCVData({
        ...cvData,
        skills: {
          ...cvData.skills,
          competences: [...cvData.skills.competences, newSkill.trim()],
        },
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setCVData({
      ...cvData,
      skills: {
        ...cvData.skills,
        competences: cvData.skills.competences.filter((_, i) => i !== index),
      },
    });
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setCVData({
        ...cvData,
        skills: {
          ...cvData.skills,
          langues: [...cvData.skills.langues, newLanguage.trim()],
        },
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    setCVData({
      ...cvData,
      skills: {
        ...cvData.skills,
        langues: cvData.skills.langues.filter((_, i) => i !== index),
      },
    });
  };

  const renderPreview = () => {
    return (
      <div className="space-y-8 p-8 bg-white max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center border-b pb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            {cvData.personal.prenom} {cvData.personal.nom}
          </h1>
          <div className="mt-2 text-gray-600 space-y-1">
            <p>{cvData.personal.email}</p>
            <p>{cvData.personal.telephone}</p>
            <p>{cvData.personal.adresse}</p>
          </div>
          {cvData.personal.description && (
            <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
              {cvData.personal.description}
            </p>
          )}
        </div>

        {/* Expérience */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Expérience Professionnelle
          </h2>
          <div className="space-y-4">
            {cvData.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-indigo-600 pl-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-800">{exp.poste}</h3>
                  <p className="text-gray-600 text-sm">
                    {exp.debut} - {exp.fin}
                  </p>
                </div>
                <p className="text-gray-700 font-medium">{exp.entreprise}</p>
                <p className="text-gray-600 mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formation */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            Formation
          </h2>
          <div className="space-y-4">
            {cvData.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-indigo-600 pl-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-800">{edu.diplome}</h3>
                  <p className="text-gray-600 text-sm">{edu.annee}</p>
                </div>
                <p className="text-gray-700">{edu.ecole}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compétences et Langues */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Compétences
            </h2>
            <div className="flex flex-wrap gap-2">
              {cvData.skills.competences.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Languages className="w-6 h-6" />
              Langues
            </h2>
            <div className="flex flex-wrap gap-2">
              {cvData.skills.langues.map((langue, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
                >
                  {langue}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton de téléchargement */}
        <div className="flex justify-center mt-8">
          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Download className="w-5 h-5" />
            Télécharger le CV
          </button>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'personal':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Informations Personnelles
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom"
                className="p-2 border rounded"
                value={cvData.personal.nom}
                onChange={(e) => updatePersonal('nom', e.target.value)}
              />
              <input
                type="text"
                placeholder="Prénom"
                className="p-2 border rounded"
                value={cvData.personal.prenom}
                onChange={(e) => updatePersonal('prenom', e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="p-2 border rounded"
                value={cvData.personal.email}
                onChange={(e) => updatePersonal('email', e.target.value)}
              />
              <input
                type="tel"
                placeholder="Téléphone"
                className="p-2 border rounded"
                value={cvData.personal.telephone}
                onChange={(e) => updatePersonal('telephone', e.target.value)}
              />
              <input
                type="text"
                placeholder="Adresse"
                className="p-2 border rounded col-span-2"
                value={cvData.personal.adresse}
                onChange={(e) => updatePersonal('adresse', e.target.value)}
              />
              <textarea
                placeholder="Description personnelle (présentez-vous en quelques lignes)"
                className="p-2 border rounded col-span-2 h-32 resize-none"
                value={cvData.personal.description}
                onChange={(e) => updatePersonal('description', e.target.value)}
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Expérience Professionnelle
              </h2>
              <button
                onClick={addExperience}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="w-5 h-5" />
                Ajouter une expérience
              </button>
            </div>
            {cvData.experience.map((exp, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">Expérience {index + 1}</h3>
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Poste"
                    className="p-2 border rounded"
                    value={exp.poste}
                    onChange={(e) => updateExperience(index, 'poste', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Entreprise"
                    className="p-2 border rounded"
                    value={exp.entreprise}
                    onChange={(e) => updateExperience(index, 'entreprise', e.target.value)}
                  />
                  <input
                    type="month"
                    placeholder="Date de début"
                    className="p-2 border rounded"
                    value={exp.debut}
                    onChange={(e) => updateExperience(index, 'debut', e.target.value)}
                  />
                  <input
                    type="month"
                    placeholder="Date de fin"
                    className="p-2 border rounded"
                    value={exp.fin}
                    onChange={(e) => updateExperience(index, 'fin', e.target.value)}
                  />
                  <textarea
                    placeholder="Description des responsabilités"
                    className="p-2 border rounded col-span-2 h-24"
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                Formation
              </h2>
              <button
                onClick={addEducation}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="w-5 h-5" />
                Ajouter une formation
              </button>
            </div>
            {cvData.education.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">Formation {index + 1}</h3>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Diplôme"
                    className="p-2 border rounded"
                    value={edu.diplome}
                    onChange={(e) => updateEducation(index, 'diplome', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="École"
                    className="p-2 border rounded"
                    value={edu.ecole}
                    onChange={(e) => updateEducation(index, 'ecole', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Année"
                    className="p-2 border rounded col-span-2"
                    value={edu.annee}
                    onChange={(e) => updateEducation(index, 'annee', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Award className="w-6 h-6" />
                Compétences
              </h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Nouvelle compétence"
                  className="p-2 border rounded flex-1"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.competences.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Languages className="w-6 h-6" />
                Langues
              </h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Nouvelle langue"
                  className="p-2 border rounded flex-1"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                />
                <button
                  onClick={addLanguage}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.langues.map((langue, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{langue}</span>
                    <button
                      onClick={() => removeLanguage(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'preview':
        return renderPreview();

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-indigo-900">
            Créateur de CV Professionnel
          </h1>

          {/* Description Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
              Créez votre CV professionnel en quelques étapes simples
            </h2>
            <div className="prose prose-indigo">
              <p className="text-gray-600 mb-4">
                Notre outil de création de CV vous permet de créer facilement un CV professionnel et moderne. 
                Suivez les étapes ci-dessous pour générer votre CV :
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Remplissez vos informations personnelles</li>
                <li>Ajoutez vos expériences professionnelles</li>
                <li>Détaillez votre formation</li>
                <li>Listez vos compétences et langues</li>
                <li>Prévisualisez et téléchargez votre CV</li>
              </ol>
              <p className="text-gray-600 mt-4">
                Une fois terminé, vous pourrez télécharger votre CV au format PDF, prêt à être envoyé aux recruteurs.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex gap-4 mb-8 flex-wrap">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  currentSection === 'personal'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setCurrentSection('personal')}
              >
                <User className="w-5 h-5" />
                Personnel
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  currentSection === 'experience'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setCurrentSection('experience')}
              >
                <Briefcase className="w-5 h-5" />
                Expérience
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  currentSection === 'education'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setCurrentSection('education')}
              >
                <GraduationCap className="w-5 h-5" />
                Formation
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  currentSection === 'skills'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setCurrentSection('skills')}
              >
                <Award className="w-5 h-5" />
                Compétences
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  currentSection === 'preview'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setCurrentSection('preview')}
              >
                <Eye className="w-5 h-5" />
                Aperçu
              </button>
            </div>

            {renderSection()}

            <div className="flex justify-between mt-8">
              <button
                className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                onClick={() => {
                  const sections: Section[] = ['personal', 'experience', 'education', 'skills', 'preview'];
                  const currentIndex = sections.indexOf(currentSection);
                  if (currentIndex > 0) {
                    setCurrentSection(sections[currentIndex - 1]);
                  }
                }}
              >
                Précédent
              </button>
              <button
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                onClick={() => {
                  const sections: Section[] = ['personal', 'experience', 'education', 'skills', 'preview'];
                  const currentIndex = sections.indexOf(currentSection);
                  if (currentIndex < sections.length - 1) {
                    setCurrentSection(sections[currentIndex + 1]);
                  }
                }}
              >
                Suivant
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;