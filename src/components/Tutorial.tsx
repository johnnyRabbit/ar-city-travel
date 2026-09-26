import { useState, useEffect } from 'react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  emoji: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Bem-vindo a Évora!',
    description: 'Vais explorar a cidade histórica enquanto foges de zombies temporais!',
    emoji: '🏛️',
  },
  {
    id: 2,
    title: 'Descobre Locais Históricos',
    description: 'Aproxima-te dos marcadores coloridos e clica neles para descobrir a história.',
    emoji: '📜',
  },
  {
    id: 3,
    title: 'Cuidado com os Zombies!',
    description: 'Os zombies perseguem-te! Clica neles para os eliminar e ganhar pontos.',
    emoji: '🧟',
  },
  {
    id: 4,
    title: 'Usa o Mini-Mapa',
    description: 'O mini-mapa no canto inferior esquerdo mostra a tua posição e os zombies.',
    emoji: '🗺️',
  },
  {
    id: 5,
    title: 'Filtra por Era',
    description: 'Usa o seletor de eras no topo para focar em períodos históricos específicos.',
    emoji: '⏰',
  },
  {
    id: 6,
    title: 'Estás Pronto!',
    description: 'Explora, descobre e sobrevive! Boa sorte, aventureiro!',
    emoji: '🚀',
  },
];

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar tutorial apenas na primeira vez
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 z-[4000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        {/* Emoji */}
        <div className="text-center mb-4">
          <div className="text-6xl mb-2">{step.emoji}</div>
          <div className="flex justify-center gap-1 mb-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-purple-500 w-8'
                    : index < currentStep
                    ? 'bg-purple-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{step.title}</h2>
          <p className="text-gray-600 text-sm">{step.description}</p>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all active:scale-95"
            >
              ← Anterior
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Começar!' : 'Próximo →'}
          </button>
        </div>

        {/* Skip */}
        {currentStep < tutorialSteps.length - 1 && (
          <button
            onClick={handleSkip}
            className="w-full mt-3 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            Saltar tutorial
          </button>
        )}
      </div>
    </div>
  );
}
