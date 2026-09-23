import { useState, useEffect, useRef } from 'react';
import { useSimulatedPlayers } from './OtherPlayers';

interface ChatMessage {
  id: string;
  playerName: string;
  avatar: string;
  message: string;
  timestamp: number;
  isPlayer?: boolean;
}

export default function ChatSim() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const players = useSimulatedPlayers();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-generate messages from bots
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        const botMessages = [
          'Acabei de descobrir um local histórico!',
          'Cuidado com os zombies!',
          'Alguém quer fazer equipa?',
          'Encontrei um item raro!',
          'Esta cidade é incrível!',
          'Já sabem que os Romanos estiveram aqui?',
          'Vou para o Templo Romano!',
          'Os zombies estão a aproximar-se!',
          'Preciso de uma poção de cura...',
          'Que nível estás?',
        ];
        const msg: ChatMessage = {
          id: `msg-${Date.now()}`,
          playerName: randomPlayer.name,
          avatar: randomPlayer.avatar,
          message: botMessages[Math.floor(Math.random() * botMessages.length)],
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev.slice(-20), msg]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [players]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      playerName: 'Tu',
      avatar: '🧑‍🚀',
      message: input,
      timestamp: Date.now(),
      isPlayer: true,
    };
    setMessages((prev) => [...prev.slice(-20), msg]);
    setInput('');

    // Bot response
    setTimeout(() => {
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      const responses = [
        'Boa ideia!',
        'Concordo!',
        'Vou para aí!',
        'Cuidado!',
        'Obrigado pela dica!',
        '😄',
        'Vamos lá!',
      ];
      const response: ChatMessage = {
        id: `msg-${Date.now()}-resp`,
        playerName: randomPlayer.name,
        avatar: randomPlayer.avatar,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev.slice(-20), response]);
    }, 2000 + Math.random() * 3000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-32 right-2 z-[999] w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
      >
        <span className="text-xl">💬</span>
      </button>
    );
  }

  return (
    <div className="absolute top-40 right-4 z-[1000] bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl w-[280px] flex flex-col" style={{ height: '350px' }}>
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-bold text-gray-800 text-sm">💬 Chat Global</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">Ainda não há mensagens...</p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.isPlayer ? 'flex-row-reverse' : ''}`}>
            <span className="text-lg">{msg.avatar}</span>
            <div className={`max-w-[180px] ${msg.isPlayer ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg px-2 py-1`}>
              {!msg.isPlayer && <p className="text-[10px] font-bold text-gray-500">{msg.playerName}</p>}
              <p className="text-xs">{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t flex gap-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escreve uma mensagem..."
          className="flex-1 px-2 py-1 text-xs border rounded focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-bold hover:bg-blue-600"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
