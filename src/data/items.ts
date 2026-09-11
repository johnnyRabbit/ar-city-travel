import { ItemDef } from '../types/items';

export const itemDefinitions: ItemDef[] = [
  // Escudos (proteção)
  {
    id: 'shield_romano',
    name: 'Escudo Romano',
    description: 'Escudo de legião romano. Absorve 30 de dano.',
    type: 'shield',
    rarity: 'common',
    emoji: '🛡️',
    era: 'romano',
    duration: 20,
    effect: { shieldHP: 30 },
  },
  {
    id: 'shield_medieval',
    name: 'Escudo Templário',
    description: 'Escudo sagrado dos Templários. Absorve 50 de dano.',
    type: 'shield',
    rarity: 'rare',
    emoji: '⚔️',
    era: 'medieval',
    duration: 25,
    effect: { shieldHP: 50 },
  },
  {
    id: 'shield_lendario',
    name: 'Égide de Diana',
    description: 'Escudo lendário do Templo de Diana. Invencibilidade temporária!',
    type: 'shield',
    rarity: 'legendary',
    emoji: '✨',
    era: 'romano',
    duration: 8,
    effect: { invincibility: true, shieldHP: 999 },
  },

  // Espadas (dano)
  {
    id: 'sword_gladio',
    name: 'Gládio Romano',
    description: 'Espada curta romana. Dano duplicado por 15s.',
    type: 'sword',
    rarity: 'common',
    emoji: '🗡️',
    era: 'romano',
    duration: 15,
    effect: { damageMultiplier: 2 },
  },
  {
    id: 'sword_cavaleiro',
    name: 'Espada de Cavaleiro',
    description: 'Espada medieval afiada. Dano triplicado por 12s.',
    type: 'sword',
    rarity: 'rare',
    emoji: '⚔️',
    era: 'medieval',
    duration: 12,
    effect: { damageMultiplier: 3 },
  },
  {
    id: 'sword_geraldos',
    name: 'Lâmina de Geraldo Sem Pavor',
    description: 'A lendária espada do conquistador de Évora!',
    type: 'sword',
    rarity: 'legendary',
    emoji: '🔥',
    era: 'medieval',
    duration: 20,
    effect: { damageMultiplier: 5 },
  },

  // Poções (efeitos instantâneos ou temporários)
  {
    id: 'potion_heal',
    name: 'Poção de Cura',
    description: 'Ervas medicinais medievais. Restaura 40 de vida.',
    type: 'potion_heal',
    rarity: 'common',
    emoji: '🧪',
    era: 'medieval',
    duration: 0,
    effect: { healthRestore: 40 },
  },
  {
    id: 'potion_heal_grande',
    name: 'Elixir da Universidade',
    description: 'Fórmula alquímica da Universidade de Évora. Restaura 80 de vida.',
    type: 'potion_heal',
    rarity: 'rare',
    emoji: '⚗️',
    era: 'renascimento',
    duration: 0,
    effect: { healthRestore: 80 },
  },
  {
    id: 'potion_speed',
    name: 'Poção de Mercúrio',
    description: 'Acelera o movimento em 2x por 20s.',
    type: 'potion_speed',
    rarity: 'rare',
    emoji: '💨',
    era: 'renascimento',
    duration: 20,
    effect: { speedMultiplier: 2 },
  },
  {
    id: 'potion_slow',
    name: 'Poção de Lentidão',
    description: 'Os zombies ficam lentos por 15s.',
    type: 'potion_speed',
    rarity: 'epic',
    emoji: '🐌',
    era: 'mouro',
    duration: 15,
    effect: { zombieSlowdown: 0.5 },
  },

  // Relíquias (efeitos especiais)
  {
    id: 'relic_ossos',
    name: 'Relíquia da Capela dos Ossos',
    description: 'Os zombies têm medo e ficam lentos.',
    type: 'relic',
    rarity: 'epic',
    emoji: '💀',
    era: 'medieval',
    duration: 25,
    effect: { zombieSlowdown: 0.7 },
  },
  {
    id: 'relic_aqueduto',
    name: 'Água da Prata',
    description: 'Água sagrada do Aqueduto. Atrai itens próximos.',
    type: 'relic',
    rarity: 'epic',
    emoji: '🌊',
    era: 'renascimento',
    duration: 30,
    effect: { magnetRange: 0.005 },
  },
  {
    id: 'scroll_universidade',
    name: 'Pergaminho Antigo',
    description: 'Conhecimento da Universidade. +100 pontos.',
    type: 'scroll',
    rarity: 'rare',
    emoji: '📜',
    era: 'renascimento',
    duration: 0,
    effect: {}, // handled specially
  },
];

export const rarityColors: Record<string, string> = {
  common: '#9CA3AF',
  rare: '#3B82F6',
  epic: '#A855F7',
  legendary: '#F59E0B',
};

export const rarityNames: Record<string, string> = {
  common: 'Comum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
};

export function getItemDef(id: string): ItemDef | undefined {
  return itemDefinitions.find((i) => i.id === id);
}

export function getRandomItemDef(rarity?: string): ItemDef {
  let pool = itemDefinitions;
  if (rarity) {
    pool = itemDefinitions.filter((i) => i.rarity === rarity);
    if (pool.length === 0) pool = itemDefinitions;
  }
  // Weighted by rarity (legendary rarer)
  const weights: Record<string, number> = {
    common: 50,
    rare: 30,
    epic: 15,
    legendary: 5,
  };
  const weighted = pool.flatMap((item) =>
    Array(weights[item.rarity] || 10).fill(item)
  );
  return weighted[Math.floor(Math.random() * weighted.length)];
}
