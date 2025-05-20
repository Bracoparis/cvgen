import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ArrowLeft, BookOpen } from 'lucide-react';

const FormationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="flex items-center mb-8">
          <GraduationCap className="h-8 w-8 text-emerald-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Se Former</h1>
        </div>

        <p className="text-lg text-gray-700 mb-8">
          Découvrez des formations adaptées à votre profil et à vos objectifs professionnels.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Carte 1 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-emerald-50 border-b">
              <CardTitle className="text-emerald-700">Formations diplômantes</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                Obtenez un diplôme reconnu par l'État et valorisez vos compétences sur le marché du travail.
              </p>
              <Button className="w-full" onClick={() => window.open('https://candidat.francetravail.fr/formations/recherche;JSESSIONID_RECH_FORMATION=I3nuht-rhVrr22resdiX-9enWETJ6rN53zyEvg_r8ThW2umTkha5!-1253711698?range=0-9&tri=0', '_blank')}>
                <BookOpen className="mr-2 h-4 w-4" />
                Explorer
              </Button>
            </CardContent>
          </Card>

          {/* Carte 2 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="text-blue-700">Formations courtes</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                Perfectionnez vos compétences avec des formations spécialisées de courte durée.
              </p>
              <Button className="w-full" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Explorer
              </Button>
            </CardContent>
          </Card>

          {/* Carte 3 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-purple-50 border-b">
              <CardTitle className="text-purple-700">Reconversion professionnelle</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                Changez de métier avec des parcours adaptés à votre transition professionnelle.
              </p>
              <Button className="w-full" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Explorer
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Besoin d'aide pour choisir votre formation?</h2>
          <p className="text-gray-600 mb-6">
            Notre équipe de conseillers est disponible pour vous guider dans votre parcours de formation
            et vous aider à trouver la formation qui correspond le mieux à vos objectifs.
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => window.open('https://www.francetravail.fr/faq/candidat/assistance-technique/envoyer-mail-conseiller/envoyer-un-mail-a-mon-conseiller.html#:~:text=Si%20toutefois%20le%20nom%20de,d\'un%20appel%20local).', '_blank')}>
            Contacter un conseiller
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormationPage; 