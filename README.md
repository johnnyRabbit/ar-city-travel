# 🏛️ Évora Through Time

Jogo histórico de exploração com Realidade Aumentada onde descobres locais históricos enquanto enfrentas zombies!

## 🎮 Como Jogar

1. **Clica em "Começar Aventura"** para iniciar
2. **Move-te** pelo mapa de Évora (WASD/setas no PC, GPS no mobile)
3. **Descobre locais históricos** aproximando-te dos marcadores
4. **Elimina zombies** clicando neles
5. **Apanha power-ups** espalhados pelo mapa
6. **Ativa o AR** para ver zombies e locais na câmara real
7. **Completa missões** para ganhar recompensas
8. **Enfrenta bosses** históricos com habilidades especiais

## 🗺️ Características

### Core Gameplay
- **Mapa interativo** de Évora com Leaflet
- **8 locais históricos** reais da cidade
- **Zombies** que te perseguem pelas ruas
- **Filtro por era** (Romano, Visigodo, Mouro, Medieval, Renascimento, Moderno)
- **Sistema de pontos** e níveis com XP

### 📱 Realidade Aumentada (AR)
- **Câmara em tempo real** com overlay de jogo
- **Zombies em AR** posicionados no mundo real
- **Locais históricos** visíveis através da câmara
- **Indicadores de direção** para objetos fora do ecrã
- **Bússola e heading** para orientação

### 🎒 Sistema de Inventário
- **Power-ups** espalhados pelo mapa
- **Escudos** (Escudo Romano, Templário, Égide de Diana)
- **Espadas** (Gládio, Espada de Cavaleiro, Lâmina de Geraldo)
- **Poções** de cura e buffs temporários
- **Pergaminhos** para pontos bonus
- **Sistema de raridade** (Comum, Raro, Épico, Lendário)

### 📜 Missões e Quests
- **Missões diárias** que resetam a cada dia
- **Missões principais** com objetivos variados
- **Recompensas** em pontos e itens
- **Progress tracking** em tempo real

### 👹 Bosses Históricos
- **D. Sebastião** - O Rei Fantasma
- **General Junot** - O Invasor Napoleónico
- **Bispo de Évora** - O Inquisidor
- **Habilidades especiais** com cooldowns
- **Recompensas lendárias** ao derrotar

### 🏆 Conquistas
- **12 conquistas** para desbloquear
- **Explorador** - Descobre locais históricos
- **Caçador** - Elimina zombies
- **Colecionador** - Apanha itens
- **Mestre do Tempo** - Descobre tudo

### 🎨 Interface
- **Mini-mapa** com radar
- **Bússola** com direção
- **Setas de direção** dos zombies
- **Overlay de dano** visual
- **Dicas contextuais** inteligentes
- **Efeitos visuais** e animações
- **Sons procedurais** via Web Audio API
- **Banner de eventos sazonais**

### 🌍 Multi-cidade
- **Évora** (cidade principal)
- **Lisboa** (em desenvolvimento)
- **Porto** (em desenvolvimento)
- **Seletor de cidade** no jogo

## 📜 Locais Históricos

### Romano
- 🏛️ Templo Romano (século I)
- ♨️ Termas Romanas (século II)

### Medieval
- ⛪ Sé Catedral (1189-1250)
- 💀 Igreja de São Francisco (século XV)

### Renascimento
- 🎓 Universidade de Évora (1559)
- 🌊 Aqueduto da Água da Prata (1537)

### Moderno
- 🏪 Praça do Giraldo (século XVI)
- 💣 Cerco de Évora (1808)

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilos)
- **Leaflet** + **react-leaflet** (mapas)
- **Zustand** (state management)
- **Web Audio API** (sons procedurais)
- **Device Orientation API** (AR)
- **Geolocation API** (GPS)

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📱 Controlos

### Desktop
- **WASD** ou **Setas** - Mover jogador
- **Clica** nos markers - Interagir
- **Clica** nos zombies - Atacar

### Mobile
- **GPS** - Posição real
- **Toque** - Interagir com markers
- **AR** - Ativar realidade aumentada

## 🎯 Objetivos

- Descobrir todos os 8 locais históricos
- Eliminar zombies para ganhar pontos
- Apanhar power-ups e usar itens
- Completar missões diárias
- Derrotar bosses históricos
- Desbloquear todas as conquistas
- Alcançar o nível máximo!

## 📂 Estrutura do Projeto

```
src/
├── components/        # Componentes React
│   ├── ARView.tsx     # Realidade Aumentada
│   ├── BossHUD.tsx    # Interface de Boss
│   ├── GameLoop.tsx   # Loop principal do jogo
│   ├── GameMap.tsx    # Mapa completo
│   ├── Inventory.tsx  # Sistema de inventário
│   ├── QuestPanel.tsx # Missões
│   └── ...
├── data/             # Dados do jogo
│   ├── bosses.ts     # Definição de bosses
│   ├── items.ts      # Definição de itens
│   ├── quests.ts     # Definição de missões
│   └── evoraHistory.ts # Locais históricos
├── store/            # Estado (Zustand)
│   ├── gameStore.ts  # Estado principal
│   ├── inventoryStore.ts
│   ├── questStore.ts
│   └── bossStore.ts
├── types/            # Tipos TypeScript
└── utils/            # Utilitários
    └── sounds.ts     # Sistema de sons
```

## 🔮 Próximas Funcionalidades

- [ ] Multiplayer em tempo real
- [ ] Mais cidades (Lisboa, Porto completas)
- [ ] Sistema de crafting
- [ ] Leaderboard global
- [ ] Chat entre jogadores
- [ ] Eventos sazonais expandidos
- [ ] Modo história com narrativa
- [ ] Achievements expandidos

## 📄 Licença

MIT

---

**Feito com ❤️ em Évora, Portugal** 🇵🇹
