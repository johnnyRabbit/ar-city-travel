import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  emoji: string;
  action?: string;
  highlight?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo a Évora!',
    description: 'Vais explorar a cidade enquanto foges de zombies históricos. Vamos aprender a jogar!',
    emoji: '🏛️',
  },
  {
    id: 'move',
    title: 'Como Mover',
    description: 'No telemóvel: move-te fisicamente! O GPS deteta a tua posição. No PC: usa WASD ou setas.',
    emoji: '🚶',
  },
  {
    id: 'map',
    title: 'O Mapa',
    description: 'Os círculos coloridos são locais históricos. Aproxima-te e clica para descobrir a sua história!',
    emoji: '🗺️',
  },
  {
    id: 'zombies',
    title: 'Cuidado com os Zombies!',
    description: 'Os zombies perseguem-te pelas ruas. Clica neles para os eliminar e ganhar pontos!',
    emoji: '🧟',
  },
  {
    id: 'items',
    title: 'Apanha Itens',
    description: 'Itens brilhantes aparecem no mapa. Apanha-os para ganhar power-ups como escudos e poções!',
    emoji: '🎒',
  },
  {
    id: 'quests',
    title: 'Completa Missões',
    description: 'Clica no botão 📜 para ver missões. Completa-as para ganhar recompensas!',
    emoji: '📜',
  },
  {
    id: 'ar',
    title: 'Modo AR',
    description: 'Clica no botão 📱 AR para ver zombies e locais históricos em Realidade Aumentada!',
    emoji: '📱',
  },
  {
    id: 'ready',
    title: 'Estás Pronto!',
    description: 'Explora Évora, descobre a sua história e sobrevive aos zombies! Boa sorte!',
    emoji: '🚀',
  },
];

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const { gameActive, startGame } = useGameStore();

  useEffect(() => {
    // Check if user has seen tutorial before
    const seen = localStorage.getItem('evora_tutorial_seen');
    if (!seen) {
      setIsVisible(true);
    } else {
      setHasSeenTutorial(true);
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
    setIsVisible(false);
    localStorage.setItem('evora_tutorial_seen', 'true');
    setHasSeenTutorial(true);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsVisible(true);
  };

  if (!isVisible) {
    // Show small button to restart tutorial
    if (hasSeenTutorial && !gameActive) {
      return (
        <button
          onClick={handleRestart}
          className="absolute bottom-44 left-1/2 -translate-x-1/2 z-[999] bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg text-xs text-gray-600 hover:bg-white transition-all active:scale-95"
        >
          ❓ Tutorial
        </button>
      );
    }
    return null;
  }

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-[4000] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-200">
          <div 
            className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Emoji */}
          <div className="text-6xl mb-4 animate-bounce">{step.emoji}</div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h2>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">{step.description}</p>

          {/* Step indicator */}
          <div className="flex justify-center gap-1.5 mb-6">
            {tutorialSteps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'bg-purple-500 w-6'
                    : idx < currentStep
                    ? 'bg-purple-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
              >
                ← Voltar
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95 shadow-lg"
            >
              {currentStep === tutorialSteps.length - 1 ? '🚀 Começar!' : 'Próximo →'}
            </button>
          </div>

          {/* Skip */}
          {currentStep < tutorialSteps.length - 1 && (
            <button
              onClick={handleSkip}
              className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Saltar tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
