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

  // NOVOS ITENS - Escudos
  {
    id: 'shield_royal',
    name: 'Escudo Real de D. Afonso',
    description: 'Escudo do primeiro rei de Portugal. Absorve 70 de dano.',
    type: 'shield',
    rarity: 'epic',
    emoji: '🦁',
    era: 'medieval',
    duration: 30,
    effect: { shieldHP: 70 },
  },
  {
    id: 'shield_divino',
    name: 'Escudo Divino',
    description: 'Escudo abençoado pelo Papa. Absorve 60 de dano.',
    type: 'shield',
    rarity: 'rare',
    emoji: '✝️',
    era: 'medieval',
    duration: 28,
    effect: { shieldHP: 60 },
  },

  // NOVOS ITENS - Espadas
  {
    id: 'sword_viriato',
    name: 'Espada de Viriato',
    description: 'A espada do líder lusitano. Dano x4 por 18s.',
    type: 'sword',
    rarity: 'epic',
    emoji: '⚔️',
    era: 'romano',
    duration: 18,
    effect: { damageMultiplier: 4 },
  },
  {
    id: 'sword_inquisidor',
    name: 'Lâmina da Inquisição',
    description: 'Espada sagrada do Inquisidor. Dano x3.5 por 16s.',
    type: 'sword',
    rarity: 'rare',
    emoji: '⚖️',
    era: 'moderno',
    duration: 16,
    effect: { damageMultiplier: 3.5 },
  },
  {
    id: 'sword_roma',
    name: 'Gladius Imperial',
    description: 'Espada de um general romano. Dano x2.5 por 20s.',
    type: 'sword',
    rarity: 'rare',
    emoji: '🏛️',
    era: 'romano',
    duration: 20,
    effect: { damageMultiplier: 2.5 },
  },

  // NOVOS ITENS - Poções
  {
    id: 'potion_heal_max',
    name: 'Ambrosia dos Deuses',
    description: 'Bebida divina. Restaura 100% da vida.',
    type: 'potion_heal',
    rarity: 'legendary',
    emoji: '🏆',
    era: 'romano',
    duration: 0,
    effect: { healthRestore: 999 },
  },
  {
    id: 'potion_speed_max',
    name: 'Botas de Hermes',
    description: 'Velocidade x3 por 25s.',
    type: 'potion_speed',
    rarity: 'legendary',
    emoji: '👟',
    era: 'romano',
    duration: 25,
    effect: { speedMultiplier: 3 },
  },
  {
    id: 'potion_invisibility',
    name: 'Capa de Invisibilidade',
    description: 'Os zombies não te veem por 12s.',
    type: 'potion_speed',
    rarity: 'epic',
    emoji: '👻',
    era: 'mouro',
    duration: 12,
    effect: { zombieSlowdown: 1.0 },
  },

  // NOVOS ITENS - Relíquias
  {
    id: 'relic_coroa',
    name: 'Coroa de D. Sebastião',
    description: 'A coroa perdida do rei. +200 pontos.',
    type: 'scroll',
    rarity: 'legendary',
    emoji: '👑',
    era: 'moderno',
    duration: 0,
    effect: {}, // handled specially
  },
  {
    id: 'relic_dragao',
    name: 'Escama da Coca',
    description: 'Escama do dragão lendário. Os zombies fogem por 20s.',
    type: 'relic',
    rarity: 'legendary',
    emoji: '🐉',
    era: 'medieval',
    duration: 20,
    effect: { zombieSlowdown: 0.9 },
  },
  {
    id: 'relic_templario',
    name: 'Santo Graal',
    description: 'O cálice sagrado. Cura 50 HP e dá escudo de 50.',
    type: 'potion_heal',
    rarity: 'legendary',
    emoji: '🏆',
    era: 'medieval',
    duration: 0,
    effect: { healthRestore: 50 },
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
