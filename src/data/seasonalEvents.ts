import { HistoricalEvent, Zombie } from '../types';
import { ItemDef } from '../types/items';

export type SeasonId = 'halloween' | 'natal' | 'pascoa' | 'saojoao';

export interface SeasonalEvent {
  id: SeasonId;
  name: string;
  description: string;
  emoji: string;
  startDate: string; // MM-DD
  endDate: string; // MM-DD
  zombies: SeasonalZombie[];
  items: SeasonalItem[];
  quests: SeasonalQuest[];
  locations: HistoricalEvent[];
}

export interface SeasonalZombie {
  id: string;
  name: string;
  emoji: string;
  speed: number;
  health: number;
  description: string;
}

export interface SeasonalItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  duration: number;
  effect: {
    healthRestore?: number;
    damageMultiplier?: number;
    speedMultiplier?: number;
    shieldHP?: number;
    zombieSlowdown?: number;
  };
}

export interface SeasonalQuest {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  reward: { points: number; item?: string };
}

export const seasonalEvents: SeasonalEvent[] = [
  // 🎃 HALLOWEEN (31 Outubro - 2 Novembro)
  {
    id: 'halloween',
    name: 'Halloween em Évora',
    description: 'Os mortos voltam à vida! Zombies temáticos e itens assustadores.',
    emoji: '🎃',
    startDate: '10-31',
    endDate: '11-02',
    zombies: [
      {
        id: 'zombie-abobora',
        name: 'Zombie Abóbora',
        emoji: '🎃',
        speed: 0.00025,
        health: 60,
        description: 'Uma abóbora possuída que rola em tua direção!',
      },
      {
        id: 'zombie-bruxa',
        name: 'Bruxa Morta-Viva',
        emoji: '🧙‍♀️',
        speed: 0.0003,
        health: 80,
        description: 'Uma bruxa que lança maldições!',
      },
      {
        id: 'zombie-vampiro',
        name: 'Vampiro de Évora',
        emoji: '🧛',
        speed: 0.00035,
        health: 100,
        description: 'Um vampiro ancestral que drena a tua vida!',
      },
      {
        id: 'zombie-fantasma',
        name: 'Fantasma da Capela',
        emoji: '👻',
        speed: 0.0004,
        health: 50,
        description: 'Um espírito que atravessa paredes!',
      },
    ],
    items: [
      {
        id: 'halloween-candy',
        name: 'Doces de Halloween',
        description: 'Doces assombrados que restauram vida.',
        emoji: '🍬',
        rarity: 'common',
        duration: 0,
        effect: { healthRestore: 30 },
      },
      {
        id: 'halloween-potion',
        name: 'Poção do Bruxo',
        description: 'Uma poção misteriosa que duplica o dano.',
        emoji: '🧪',
        rarity: 'rare',
        duration: 20,
        effect: { damageMultiplier: 2 },
      },
      {
        id: 'halloween-cloak',
        name: 'Capa da Invisibilidade',
        description: 'Torna-te invisível aos zombies por 15s.',
        emoji: '🧥',
        rarity: 'epic',
        duration: 15,
        effect: { zombieSlowdown: 1.0 },
      },
      {
        id: 'halloween-scythe',
        name: 'Foice da Morte',
        description: 'A arma definitiva contra os mortos-vivos!',
        emoji: '⚰️',
        rarity: 'legendary',
        duration: 25,
        effect: { damageMultiplier: 5 },
      },
    ],
    quests: [
      {
        id: 'halloween-kill-20',
        title: 'Caçador de Monstros',
        description: 'Elimina 20 zombies de Halloween',
        emoji: '🎃',
        target: 20,
        reward: { points: 500, item: 'halloween-potion' },
      },
      {
        id: 'halloween-kill-50',
        title: 'Exterminador Sobrenatural',
        description: 'Elimina 50 zombies de Halloween',
        emoji: '💀',
        target: 50,
        reward: { points: 1500, item: 'halloween-scythe' },
      },
      {
        id: 'halloween-survive-10min',
        title: 'Noite de Terror',
        description: 'Sobrevive 10 minutos na noite de Halloween',
        emoji: '🌙',
        target: 600,
        reward: { points: 1000, item: 'halloween-cloak' },
      },
    ],
    locations: [
      {
        id: 'halloween-cemetery',
        title: 'Cemitério Assombrado',
        description: 'Um cemitério antigo onde os mortos não descansam...',
        year: 1800,
        era: 'moderno',
        lat: 38.5710,
        lng: -7.9080,
        icon: '🪦',
        discovered: false,
        points: 150,
      },
      {
        id: 'halloween-crypt',
        title: 'Cripta da Sé',
        description: 'A cripta secreta debaixo da Sé de Évora...',
        year: 1300,
        era: 'medieval',
        lat: 38.5705,
        lng: -7.9102,
        icon: '⚰️',
        discovered: false,
        points: 200,
      },
    ],
  },

  // 🎄 NATAL (20 Dezembro - 6 Janeiro)
  {
    id: 'natal',
    name: 'Natal em Évora',
    description: 'Zombies de natal com presentes e espírito festivo!',
    emoji: '🎄',
    startDate: '12-20',
    endDate: '01-06',
    zombies: [
      {
        id: 'zombie-pai-natal',
        name: 'Pai Natal Zombie',
        emoji: '🎅',
        speed: 0.0002,
        health: 70,
        description: 'Um Pai Natal que não traz presentes...',
      },
      {
        id: 'zombie-elfo',
        name: 'Elfo Louco',
        emoji: '🧝',
        speed: 0.00035,
        health: 40,
        description: 'Um elfo que enlouqueceu na oficina!',
      },
      {
        id: 'zombie-boneco-neve',
        name: 'Boneco de Neve',
        emoji: '⛄',
        speed: 0.00015,
        health: 90,
        description: 'Um boneco de neve que ganhou vida!',
      },
      {
        id: 'zombie-reno',
        name: 'Reno Zombie',
        emoji: '🦌',
        speed: 0.0004,
        health: 60,
        description: 'Um reno possuído que corre muito!',
      },
    ],
    items: [
      {
        id: 'natal-cookie',
        name: 'Biscoito de Natal',
        description: 'Biscoitos deliciosos que restauram vida.',
        emoji: '🍪',
        rarity: 'common',
        duration: 0,
        effect: { healthRestore: 25 },
      },
      {
        id: 'natal-gift',
        name: 'Presente Misterioso',
        description: 'Um presente que pode conter qualquer coisa!',
        emoji: '🎁',
        rarity: 'rare',
        duration: 0,
        effect: { healthRestore: 50 },
      },
      {
        id: 'natal-star',
        name: 'Estrela de Natal',
        description: 'Uma estrela que protege contra zombies.',
        emoji: '⭐',
        rarity: 'epic',
        duration: 30,
        effect: { shieldHP: 80 },
      },
      {
        id: 'natal-sleigh',
        name: 'Sleigh do Pai Natal',
        description: 'O trenó mágico que te dá super velocidade!',
        emoji: '🛷',
        rarity: 'legendary',
        duration: 20,
        effect: { speedMultiplier: 3 },
      },
    ],
    quests: [
      {
        id: 'natal-kill-15',
        title: 'Ajudante do Pai Natal',
        description: 'Elimina 15 zombies natalícios',
        emoji: '🎄',
        target: 15,
        reward: { points: 400, item: 'natal-gift' },
      },
      {
        id: 'natal-kill-40',
        title: 'Guardião do Natal',
        description: 'Elimina 40 zombies natalícios',
        emoji: '🎅',
        target: 40,
        reward: { points: 1200, item: 'natal-star' },
      },
      {
        id: 'natal-collect-10',
        title: 'Colecionador de Presentes',
        description: 'Apanha 10 presentes de natal',
        emoji: '🎁',
        target: 10,
        reward: { points: 800, item: 'natal-sleigh' },
      },
    ],
    locations: [
      {
        id: 'natal-market',
        title: 'Mercado de Natal',
        description: 'Um mercado festivo cheio de surpresas natalícias!',
        year: 2023,
        era: 'moderno',
        lat: 38.5702,
        lng: -7.9100,
        icon: '🎄',
        discovered: false,
        points: 100,
      },
      {
        id: 'natal-tree',
        title: 'Árvore de Natal Gigante',
        description: 'A maior árvore de natal de Évora!',
        year: 2023,
        era: 'moderno',
        lat: 38.5714,
        lng: -7.9073,
        icon: '🎄',
        discovered: false,
        points: 120,
      },
    ],
  },

  // 🐣 PÁSCOA (Março/Abril - 10 dias)
  {
    id: 'pascoa',
    name: 'Páscoa em Évora',
    description: 'Ovos de páscoa mágicos e coelhos zombie!',
    emoji: '🐣',
    startDate: '03-28',
    endDate: '04-07',
    zombies: [
      {
        id: 'zombie-coelho',
        name: 'Coelho Zombie',
        emoji: '🐰',
        speed: 0.0003,
        health: 50,
        description: 'Um coelho da páscoa que saltou para a realidade!',
      },
      {
        id: 'zombie-ovo',
        name: 'Ovo Possuído',
        emoji: '🥚',
        speed: 0.00025,
        health: 70,
        description: 'Um ovo de páscoa que rolou para o lado negro!',
      },
      {
        id: 'zombie-chocolate',
        name: 'Coelho de Chocolate',
        emoji: '🍫',
        speed: 0.00035,
        health: 60,
        description: 'Um coelho de chocolate que ganhou vida!',
      },
    ],
    items: [
      {
        id: 'pascoa-egg',
        name: 'Ovo de Páscoa',
        description: 'Um ovo mágico que restaura vida.',
        emoji: '🥚',
        rarity: 'common',
        duration: 0,
        effect: { healthRestore: 35 },
      },
      {
        id: 'pascoa-chocolate',
        name: 'Chocolate Mágico',
        description: 'Chocolate que dá energia extra!',
        emoji: '🍫',
        rarity: 'rare',
        duration: 15,
        effect: { speedMultiplier: 1.5 },
      },
      {
        id: 'pascoa-basket',
        name: 'Cesto de Páscoa',
        description: 'Um cesto que atrai itens próximos.',
        emoji: '🧺',
        rarity: 'epic',
        duration: 25,
        effect: { zombieSlowdown: 0.6 },
      },
      {
        id: 'pascoa-golden-egg',
        name: 'Ovo Dourado',
        description: 'O ovo dourado lendário com poderes mágicos!',
        emoji: '🌟',
        rarity: 'legendary',
        duration: 0,
        effect: { healthRestore: 100 },
      },
    ],
    quests: [
      {
        id: 'pascoa-kill-10',
        title: 'Caçador de Coelhos',
        description: 'Elimina 10 zombies de páscoa',
        emoji: '🐰',
        target: 10,
        reward: { points: 300, item: 'pascoa-egg' },
      },
      {
        id: 'pascoa-collect-15',
        title: 'Colecionador de Ovos',
        description: 'Apanha 15 ovos de páscoa',
        emoji: '🥚',
        target: 15,
        reward: { points: 600, item: 'pascoa-basket' },
      },
      {
        id: 'pascoa-kill-30',
        title: 'Mestre da Páscoa',
        description: 'Elimina 30 zombies de páscoa',
        emoji: '🐣',
        target: 30,
        reward: { points: 1000, item: 'pascoa-golden-egg' },
      },
    ],
    locations: [
      {
        id: 'pascoa-garden',
        title: 'Jardim dos Ovos',
        description: 'Um jardim mágico cheio de ovos escondidos!',
        year: 2023,
        era: 'moderno',
        lat: 38.5698,
        lng: -7.9115,
        icon: '🌷',
        discovered: false,
        points: 100,
      },
    ],
  },

  // 🎆 SÃO JOÃO (20-24 Junho)
  {
    id: 'saojoao',
    name: 'São João',
    description: 'Festa popular com zombies festivos!',
    emoji: '🎆',
    startDate: '06-20',
    endDate: '06-24',
    zombies: [
      {
        id: 'zombie-fogueira',
        name: 'Espírito da Fogueira',
        emoji: '🔥',
        speed: 0.0003,
        health: 65,
        description: 'Um espírito que saiu da fogueira!',
      },
      {
        id: 'zombie-manjerico',
        name: 'Manjerico Possuído',
        emoji: '🌿',
        speed: 0.00025,
        health: 55,
        description: 'Uma planta que ganhou vida!',
      },
      {
        id: 'zombie-marcha',
        name: 'Marchador Zombie',
        emoji: '🎭',
        speed: 0.00035,
        health: 70,
        description: 'Um participante das marchas populares!',
      },
    ],
    items: [
      {
        id: 'saojoao-sardinha',
        name: 'Sardinha Assada',
        description: 'Uma sardinha que restaura vida!',
        emoji: '🐟',
        rarity: 'common',
        duration: 0,
        effect: { healthRestore: 30 },
      },
      {
        id: 'saojoao-martelo',
        name: 'Martelo do São João',
        description: 'O martelo tradicional que dá dano extra!',
        emoji: '🔨',
        rarity: 'rare',
        duration: 18,
        effect: { damageMultiplier: 2.5 },
      },
      {
        id: 'saojoao-fogueira',
        name: 'Brasa da Fogueira',
        description: 'Uma brasa mágica que protege contra zombies.',
        emoji: '🔥',
        rarity: 'epic',
        duration: 25,
        effect: { shieldHP: 70 },
      },
      {
        id: 'saojoao-coroa',
        name: 'Coroa de São João',
        description: 'A coroa lendária do rei da festa!',
        emoji: '👑',
        rarity: 'legendary',
        duration: 30,
        effect: { damageMultiplier: 4, speedMultiplier: 1.5 },
      },
    ],
    quests: [
      {
        id: 'saojoao-kill-12',
        title: 'Festeiro Valente',
        description: 'Elimina 12 zombies festivos',
        emoji: '🎆',
        target: 12,
        reward: { points: 350, item: 'saojoao-martelo' },
      },
      {
        id: 'saojoao-survive-8min',
        title: 'Noite de São João',
        description: 'Sobrevive 8 minutos na noite de São João',
        emoji: '🔥',
        target: 480,
        reward: { points: 900, item: 'saojoao-fogueira' },
      },
      {
        id: 'saojoao-kill-35',
        title: 'Rei da Festa',
        description: 'Elimina 35 zombies festivos',
        emoji: '👑',
        target: 35,
        reward: { points: 1300, item: 'saojoao-coroa' },
      },
    ],
    locations: [
      {
        id: 'saojoao-praca',
        title: 'Praça da Festa',
        description: 'O centro das festividades do São João!',
        year: 2023,
        era: 'moderno',
        lat: 38.5702,
        lng: -7.9100,
        icon: '🎆',
        discovered: false,
        points: 100,
      },
      {
        id: 'saojoao-fogueira',
        title: 'Fogueira Gigante',
        description: 'A fogueira tradicional do São João!',
        year: 2023,
        era: 'moderno',
        lat: 38.5714,
        lng: -7.9073,
        icon: '🔥',
        discovered: false,
        points: 120,
      },
    ],
  },
];

// Função para verificar se um evento sazonal está ativo
export function getActiveSeasonalEvent(): SeasonalEvent | null {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const currentDate = `${month}-${day}`;

  for (const event of seasonalEvents) {
    const start = event.startDate;
    const end = event.endDate;
    
    // Handle year wrap-around (e.g., Natal: 12-20 to 01-06)
    if (start > end) {
      if (currentDate >= start || currentDate <= end) {
        return event;
      }
    } else {
      if (currentDate >= start && currentDate <= end) {
        return event;
      }
    }
  }

  return null;
}

export function getSeasonalEvent(id: SeasonId): SeasonalEvent | undefined {
  return seasonalEvents.find(e => e.id === id);
}
