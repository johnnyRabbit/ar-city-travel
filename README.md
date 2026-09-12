# 🏛️ Évora Through Time

**Explora a história de Évora enquanto foges de zombies temporais!**

Um jogo web que combina gamificação, história, realidade aumentada e multiplayer para descobrir os locais históricos de Évora, Portugal.

![Évora Through Time](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

---

## 🎮 Funcionalidades

### 🗺️ Mapa Interativo
- Mapa real de Évora com OpenStreetMap
- 13 locais históricos reais (Romanos → Moderno)
- Seletor de eras temporais
- Mini-mapa com posições em tempo real

### 🧟 Mecânica de Jogo
- Zombies que perseguem o jogador **pelas ruas** (pathfinding A*)
- Sistema de vida, pontos e níveis
- Power-ups e itens colecionáveis (13 tipos)
- Bosses históricos (D. Sebastião, Coca de Évora, Viriato, Moura Encantada)

### 📜 Sistema de Missões
- 12 missões principais (descoberta, combate, coleção, sobrevivência)
- 3 missões diárias
- Recompensas: pontos, itens, badges

### 🎒 Inventário e Itens
- **Escudos**: Escudo Romano, Templário, Égide de Diana
- **Espadas**: Gládio, Espada de Cavaleiro, Lâmina de Geraldo
- **Poções**: Cura, Velocidade, Lentidão
- **Relíquias**: Capela dos Ossos, Água da Prata
- **Pergaminhos**: +100 pontos instantâneos

### 👥 Multiplayer Real (Supabase)
- Autenticação (Email, Google, GitHub)
- Jogadores veem uns aos outros no mapa
- Chat global em tempo real
- Leaderboard global
- Progresso guardado na cloud

### 📱 Realidade Aumentada
- Modo AR com câmara do dispositivo
- Zombies visíveis em AR
- Funciona em mobile

### 🔊 Sons e Efeitos
- Sons procedurais (Web Audio API)
- Efeitos para todas as ações
- Sem necessidade de ficheiros de áudio

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilos)
- **Leaflet** + **react-leaflet** (mapas)
- **Zustand** (state management)

### Backend
- **Supabase** (BaaS - Backend as a Service)
  - PostgreSQL (base de dados)
  - Authentication (login/registo)
  - Realtime (sincronização em tempo real)
  - Row Level Security (segurança)

### Deploy
- **Vercel** (hosting)
- **Supabase** (backend)

---

## 🚀 Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/TEU_USERNAME/evora-through-time.git
cd evora-through-time
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Supabase

#### 3.1 Criar Projeto no Supabase
1. Vai a [supabase.com](https://supabase.com)
2. Cria um novo projeto
3. Guarda a password da base de dados

#### 3.2 Executar o Schema SQL
1. Vai a **SQL Editor** no Supabase
2. Copia o conteúdo de `supabase/schema.sql`
3. Cola e executa

#### 3.3 Obter Credenciais
1. Vai a **Settings** → **API**
2. Copia:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`

#### 3.4 Configurar Variáveis de Ambiente

Cria um ficheiro `.env` na raiz:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

#### 3.5 Configurar Authentication (Opcional)

**Google OAuth:**
1. [Google Cloud Console](https://console.cloud.google.com)
2. Cria OAuth credentials
3. Redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
4. Cola Client ID e Secret no Supabase

**GitHub OAuth:**
1. [GitHub Developer Settings](https://github.com/settings/developers)
2. Cria OAuth App
3. Callback URL: `https://xxxxx.supabase.co/auth/v1/callback`
4. Cola Client ID e Secret no Supabase

### 4. Executar Localmente

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

### 5. Build para Produção

```bash
npm run build
```

### 6. Deploy no Vercel

1. Push para GitHub
2. Importa o projeto no [Vercel](https://vercel.com)
3. Adiciona as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy! 🚀

---

## 📖 Guia de Configuração Detalhado

Ver [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para instruções passo-a-passo.

---

## 🎯 Como Jogar

### Controlos (Desktop)
- **WASD / Setas** — Mover no mapa
- **Clica nos markers** — Descobrir história
- **Clica nos zombies** — Eliminar
- **Clica nos itens** — Apanhar power-ups

### Controlos (Mobile)
- **GPS** — Posição real
- **Toque** — Interagir com markers
- **Câmara** — Modo AR

### Objetivos
1. Explora os 13 locais históricos de Évora
2. Elimina zombies que te perseguem pelas ruas
3. Apanha power-ups e itens
3. Derrota bosses históricos
4. Completa missões para ganhar recompensas
5. Compete no leaderboard global!

---

## 🗺️ Locais Históricos

1. 🏛️ **Templo Romano** (séc. I-II d.C.)
2. 🧱 **Muralhas Romanas** (séc. I a.C.)
3. ♨️ **Termas Romanas** (séc. II d.C.)
4. ✝️ **Sé Visigoda** (séc. VI)
5. 🕌 **Alcáçova Moura** (séc. VIII-XII)
6. ⚔️ **Conquista por Geraldo Sem Pavor** (1166)
7. ⛪ **Sé Catedral** (1189-1250)
8. 💀 **Igreja de São Francisco** (séc. XV)
9. 🎓 **Universidade de Évora** (1559)
10. 🌊 **Aqueduto da Água da Prata** (1537)
11. 👑 **Paço dos Duques de Bragança** (séc. XVI)
12. 🏪 **Praça do Giraldo** (séc. XVI)
13. 💣 **Cerco de Évora** (1808)

---

## 👹 Bosses Históricos

| Boss | HP | Spawn | Recompensa |
|------|-----|-------|------------|
| 👑 D. Sebastião | 500 | 5 min | 2000 pts + Égide |
| 🐉 Coca de Évora | 800 | 10 min | 3500 pts + Lâmina |
| ⚔️ Viriato | 600 | 7 min | 2800 pts + Escudo |
| 🧙‍♀️ Moura Encantada | 400 | 6 min | 2200 pts + Relíquia |

---

## 📊 Estrutura do Projeto

```
evora-through-time/
├── src/
│   ├── components/       # Componentes React
│   │   ├── GameMap.tsx
│   │   ├── GameHUD.tsx
│   │   ├── Inventory.tsx
│   │   ├── QuestPanel.tsx
│   │   ├── BossHUD.tsx
│   │   ├── AuthScreen.tsx
│   │   └── ...
│   ├── store/           # Zustand stores
│   │   ├── gameStore.ts
│   │   ├── inventoryStore.ts
│   │   ├── questStore.ts
│   │   ├── bossStore.ts
│   │   ├── authStore.ts
│   │   └── multiplayerStore.ts
│   ├── data/            # Dados do jogo
│   │   ├── evoraHistory.ts
│   │   ├── streetGraph.ts
│   │   ├── items.ts
│   │   ├── quests.ts
│   │   └── bosses.ts
│   ├── lib/             # Configurações
│   │   └── supabase.ts
│   ├── utils/           # Utilitários
│   │   └── sounds.ts
│   ├── types/           # Tipos TypeScript
│   └── App.tsx          # Componente principal
├── supabase/
│   └── schema.sql       # Schema da base de dados
├── public/              # Assets estáticos
├── .env.example         # Exemplo de variáveis de ambiente
├── SUPABASE_SETUP.md    # Guia de configuração
└── README.md            # Este ficheiro
```

---

## 🌐 Próximas Funcionalidades

### Fase 3 — Mobile App
- [ ] React Native + Expo
- [ ] AR real (ARKit/ARCore)
- [ ] Modelos 3D de zombies
- [ ] Notificações push
- [ ] Publicar nas App Stores

### Fase 4 — Expandir Conteúdo
- [ ] Mais cidades (Porto, Lisboa, Braga)
- [ ] Mais tipos de zombies
- [ ] Criaturas míticas (Coca, Mouras)
- [ ] Eventos sazonais

### Fase 5 — Monetização
- [ ] Battle Pass
- [ ] Skins exclusivas
- [ ] Parcerias com turismo
- [ ] Versão educativa

---

## 🤝 Contribuir

Contribuições são bem-vindas! 

1. Fork o projeto
2. Cria uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Abre um Pull Request

---

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

---

## 🙏 Agradecimentos

- **OpenStreetMap** — Dados do mapa
- **Supabase** — Backend as a Service
- **Leaflet** — Biblioteca de mapas
- **Comunidade de Évora** — Inspiração histórica

---

## 📞 Contacto

- **Website**: [evora-through-time.vercel.app](https://evora-through-time.vercel.app)
- **GitHub**: [github.com/TEU_USERNAME/evora-through-time](https://github.com/TEU_USERNAME/evora-through-time)
- **Email**: teu-email@exemplo.com

---

**Feito com ❤️ em Évora, Portugal** 🇵🇹
