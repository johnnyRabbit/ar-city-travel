# 🧟 Melhorias no Sistema de Zombies

## Problemas Corrigidos

### ❌ Antes
- Zombies moviam-se em **linha reta** diretamente para o jogador
- Velocidade **fixa e muito rápida** (0.0002)
- Todos os zombies eram **idênticos**
- Movimento **artificial e previsível**

### ✅ Depois
- Movimento **errático e realista** com zigzag
- Velocidade **reduzida em 50%** (0.0001 base)
- **4 tipos diferentes** de zombies
- Variação individual de velocidade
- Animação de "cambaleante" visual
- Labels com nome do tipo de zombie

---

## 🎯 Mudanças Implementadas

### 1. Movimento Errático (Zigzag)

**Antes:**
```typescript
// Linha reta direta
lat: z.lat + (dLat / dist) * z.speed,
lng: z.lng + (dLng / dist) * z.speed,
```

**Depois:**
```typescript
// Direção base para o jogador
const baseDirLat = dLat / dist;
const baseDirLng = dLng / dist;

// Adicionar movimento errático (zigzag)
const wobbleAngle = (Math.random() - 0.5) * 0.8; // -0.4 a +0.4 radianos
const cosW = Math.cos(wobbleAngle);
const sinW = Math.sin(wobbleAngle);

// Rotação da direção base
const dirLat = baseDirLat * cosW - baseDirLng * sinW;
const dirLng = baseDirLat * sinW + baseDirLng * cosW;

// Variação de velocidade (80% a 120%)
const speedVariation = 0.8 + Math.random() * 0.4;
const currentSpeed = z.speed * speedVariation;
```

**Resultado:** Zombies agora desviam aleatoriamente enquanto perseguem o jogador, criando um movimento mais natural e imprevisível.

---

### 2. Velocidade Reduzida

**Antes:**
- Velocidade fixa: `0.0002`
- Todos os zombies à mesma velocidade

**Depois:**
- Velocidade base: `0.0001` (50% mais lento)
- Variação individual: ±20%
- Diferentes velocidades por tipo

**Impacto:**
- Jogador tem mais tempo para reagir
- Movimento mais realista
- Dificuldade mais equilibrada

---

### 3. Tipos de Zombies

#### 🧟 Zombie Normal (60% spawn rate)
- **Velocidade:** 0.0001
- **Vida:** 50 HP
- **Características:** Equilibrado

#### 🏃 Zombie Rápido (20% spawn rate)
- **Velocidade:** 0.00015 (50% mais rápido)
- **Vida:** 30 HP (mais fraco)
- **Características:** Rápido mas fácil de eliminar

#### 🐌 Zombie Lento (10% spawn rate)
- **Velocidade:** 0.00007 (30% mais lento)
- **Vida:** 80 HP (mais resistente)
- **Características:** Lento mas aguenta mais dano

#### 💪 Zombie Forte (10% spawn rate)
- **Velocidade:** 0.00012
- **Vida:** 100 HP (muito resistente)
- **Características:** Tanque - difícil de eliminar

---

### 4. Spawn Mais Longe

**Antes:**
```typescript
const distance = 0.005 + Math.random() * 0.01; // 50-150m
```

**Depois:**
```typescript
const distance = 0.008 + Math.random() * 0.012; // 80-200m
```

**Benefício:**
- Jogador tem mais tempo para ver o zombie a aproximar-se
- Menos "sustos" repentinos
- Melhor experiência de jogo

---

### 5. Visual Melhorado

**Antes:**
- Emoji simples com pulse
- Sem informação visual

**Depois:**
- Animação de "cambaleante" (zombie-walk)
- Label com nome do tipo
- Drop shadow vermelho mais intenso
- Tamanho maior (32x40px)

```typescript
html: `
  <div style="position: relative;">
    <div style="
      font-size: 24px; 
      animation: zombie-walk 0.8s ease-in-out infinite;
      filter: drop-shadow(0 2px 6px rgba(255,0,0,0.6));
    ">${emoji}</div>
    <div style="
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 8px;
      color: white;
      background: rgba(0,0,0,0.7);
      padding: 1px 4px;
      border-radius: 3px;
      white-space: nowrap;
      font-weight: bold;
    ">${name}</div>
  </div>
`
```

---

## 📊 Comparação de Gameplay

### Antes
| Aspecto | Valor |
|---------|-------|
| Velocidade | Muito rápida |
| Movimento | Linha reta |
| Variedade | 1 tipo |
| Distância spawn | 50-150m |
| Previsibilidade | Alta |
| Dificuldade | Frustrante |

### Depois
| Aspecto | Valor |
|---------|-------|
| Velocidade | Moderada (50% mais lenta) |
| Movimento | Errático/Zigzag |
| Variedade | 4 tipos |
| Distância spawn | 80-200m |
| Previsibilidade | Baixa |
| Dificuldade | Equilibrada |

---

## 🎮 Estratégias de Jogo

### Contra Zombie Normal 🧟
- **Estratégia:** Atacar diretamente
- **Dificuldade:** Fácil
- **Recompensa:** 50 pontos

### Contra Zombie Rápido 🏃
- **Estratégia:** Atacar rapidamente antes que chegue
- **Dificuldade:** Média (rápido mas fraco)
- **Recompensa:** 50 pontos
- **Dica:** Usa power-ups de velocidade

### Contra Zombie Lento 🐌
- **Estratégia:** Manter distância e atacar
- **Dificuldade:** Fácil (lento)
- **Recompensa:** 50 pontos
- **Dica:** Tens tempo para planear

### Contra Zombie Forte 💪
- **Estratégia:** Usar power-ups de dano
- **Dificuldade:** Alta (muita vida)
- **Recompensa:** 50 pontos
- **Dica:** Combina espadas e poções

---

## 🔧 Código Modificado

### Ficheiros Alterados
1. `src/store/gameStore.ts`
   - `updateZombies()` - Movimento errático
   - `spawnZombies()` - 4 tipos de zombies

2. `src/components/GameMap.tsx`
   - `createZombieIcon()` - Visual melhorado

### Linhas de Código
- **Adicionadas:** ~80 linhas
- **Modificadas:** ~30 linhas
- **Total:** ~110 linhas

---

## 🚀 Próximas Melhorias Sugeridas

### Alta Prioridade
1. **Pathfinding pelas ruas**
   - Usar streetGraph existente
   - Implementar algoritmo A*
   - Zombies seguem ruas reais

2. **Zombies Especiais**
   - Zombie Boss (aparece a cada 5 minutos)
   - Zombie Explosivo (explode ao morrer)
   - Zombie Curandeiro (cura outros zombies)

3. **Comportamento de Grupo**
   - Zombies formam grupos
   - Atacam em conjunto
   - Um chama os outros

### Média Prioridade
4. **Animações de Morte**
   - Efeito visual ao eliminar zombie
   - Partículas de sangue/sombra
   - Som de morte

5. **Zombies Noturnos**
   - Mais fortes à noite
   - Brilham no escuro
   - Mais rápidos

6. **Sistema de Ondas**
   - Waves de zombies
   - Dificuldade crescente
   - Recompensas por wave

---

## 📈 Métricas de Sucesso

### Objetivos
- [ ] Reduzir taxa de "Game Over" nos primeiros 2 minutos
- [ ] Aumentar tempo médio de sessão
- [ ] Melhorar satisfação do jogador (feedback)
- [ ] Reduzir frustração com zombies "impossíveis de evitar"

### Como Medir
- Analytics de mortes por minuto
- Tempo até primeira morte
- Número de zombies eliminados por sessão
- Feedback dos jogadores

---

## 🎯 Resultado Final

Os zombies agora são:
- ✅ **Mais lentos** - 50% mais lentos que antes
- ✅ **Mais realistas** - Movimento errático e imprevisível
- ✅ **Mais variados** - 4 tipos diferentes
- ✅ **Mais visuais** - Animação e labels
- ✅ **Mais equilibrados** - Dificuldade progressiva

O jogo está agora muito mais jogável e divertido!

---

**Data:** Janeiro 2026  
**Versão:** 1.2.0  
**Status:** ✅ Completo e testado
