# 🚀 Próximos Passos - Évora Through Time

## 📊 Estado Atual do Projeto

### ✅ Funcionalidades Implementadas
- Core gameplay (mapa, zombies, pontos)
- Sistema de inventário e power-ups
- Missões e conquistas
- Bosses históricos
- Realidade Aumentada (AR)
- Interface profissional com glassmorphism
- Sistema de notificações
- Mini-mapa e localização
- Multi-cidade (Évora, Lisboa, Porto)

### 🔧 Componentes Existentes mas Não Integrados
- `Leaderboard.tsx` - Sistema de ranking de jogadores
- `PlayerProfile.tsx` - Perfil detalhado do jogador
- `Compass.tsx` - Bússola com indicação de zombies
- `ActiveEffects.tsx` - Painel de efeitos ativos
- `CitySelector.tsx` - Seletor de cidade melhorado
- `SeasonalEventBanner.tsx` - Banner de eventos sazonais
- `ProximityIndicator.tsx` - Indicador de proximidade
- `ProgressBar.tsx` - Barra de progresso XP

---

## 🎯 Próximos Passos Prioritários

### 1️⃣ **Integração de Componentes Faltantes** (Alta Prioridade)

#### A. Sistema de Leaderboard
- [ ] Integrar `Leaderboard.tsx` no App.tsx
- [ ] Adicionar botão no HUD para abrir ranking
- [ ] Implementar ranking global com localStorage
- [ ] Adicionar filtros (diário, semanal, total)
- [ ] Animações de subida/descida no ranking

#### B. Bússola Melhorada
- [ ] Integrar `Compass.tsx` no App.tsx
- [ ] Adicionar indicação de locais históricos próximos
- [ ] Mostrar distância em metros
- [ ] Animação suave de rotação
- [ ] Modo noturno/diurno

#### C. Perfil do Jogador
- [ ] Integrar `PlayerProfile.tsx` no App.tsx
- [ ] Adicionar estatísticas detalhadas
- [ ] Histórico de conquistas
- [ ] Tempo de jogo total
- [ ] Gráfico de progresso

#### D. Efeitos Ativos
- [ ] Integrar `ActiveEffects.tsx` no App.tsx
- [ ] Mostrar ícones dos buffs ativos
- [ ] Timer visual para cada efeito
- [ ] Animação de expiração

---

### 2️⃣ **Melhorias de Gameplay** (Média Prioridade)

#### A. Sistema de Dificuldade Progressiva
- [ ] Zombies ficam mais rápidos com o tempo
- [ ] Mais zombies spawnam em níveis altos
- [ ] Bosses aparecem com mais frequência
- [ ] Recompensas escalonam com dificuldade

#### B. Sistema de Combate Melhorado
- [ ] Ataques especiais com cooldown
- [ ] Combos de ataque (múltiplos zombies)
- [ ] Efeitos visuais de ataque (partículas)
- [ ] Sons de combate mais variados
- [ ] Feedback tátil (vibração mobile)

#### C. Power-ups Especiais
- [ ] Power-up de velocidade temporária
- [ ] Power-up de dano em área (AOE)
- [ ] Power-up de invisibilidade
- [ ] Power-up de teletransporte
- [ ] Power-ups lendários com efeitos únicos

#### D. Sistema de Crafting
- [ ] Combinar itens para criar novos
- [ ] Receitas desbloqueáveis
- [ ] Interface de crafting
- [ ] Animações de combinação

---

### 3️⃣ **Eventos Sazonais** (Média Prioridade)

#### A. Halloween (Outubro)
- [ ] Zombies temáticos (fantasmas, bruxas)
- [ ] Locais históricos assombrados
- [ ] Power-ups especiais (poção de invisibilidade)
- [ ] Boss: O Fantasma do Conde

#### B. Natal (Dezembro)
- [ ] Zombies vestidos de Pai Natal
- [ ] Presentes espalhados pelo mapa
- [ ] Neve no mapa (efeito visual)
- [ ] Boss: O Grinch Histórico

#### C. Páscoa (Março/Abril)
- [ ] Ovos de Páscoa como power-ups
- [ ] Zombies coelhos
- [ ] Locais históricos com decoração
- [ ] Boss: O Coelho Templário

#### D. São João (Junho)
- [ ] Fogueiras no mapa
- [ ] Zombies com marchas populares
- [ ] Sardanhas como power-ups
- [ ] Boss: O Gigante de São João

---

### 4️⃣ **Multiplayer** (Baixa Prioridade - Futuro)

#### A. Sistema de Amigos
- [ ] Lista de amigos online
- [ ] Convites para jogar juntos
- [ ] Chat em tempo real
- [ ] Ver progresso dos amigos

#### B. Cooperação
- [ ] Missões em grupo
- [ ] Bosses cooperativos
- [ ] Partilha de itens
- [ ] Rankings de equipa

#### C. Competição
- [ ] Duelos 1v1
- [ ] Corridas de exploração
- [ ] Torneios semanais
- [ ] Prémios para vencedores

---

### 5️⃣ **Expansão de Conteúdo** (Média Prioridade)

#### A. Novas Cidades
- [ ] Lisboa completa (20+ locais)
- [ ] Porto completo (20+ locais)
- [ ] Coimbra (15+ locais)
- [ ] Braga (15+ locais)
- [ ] Sintra (10+ locais)

#### B. Novas Eras Históricas
- [ ] Pré-história (menires, dolmens)
- [ ] Idade do Bronze
- [ ] Período Islâmico expandido
- [ ] Era dos Descobrimentos
- [ ] República (século XX)

#### C. Mais Bosses
- [ ] Viriato - O Lusitano
- [ ] D. Afonso Henriques - O Conquistador
- [ ] Nuno Álvares Pereira - O Santo
- [ ] D. João II - O Perfeito
- [ ] Marquês de Pombal - O Reformador

---

### 6️⃣ **Melhorias Técnicas** (Alta Prioridade)

#### A. Performance
- [ ] Otimizar renderização do mapa
- [ ] Lazy loading de componentes
- [ ] Code splitting por rota
- [ ] Cache de assets (Service Worker)
- [ ] Compressão de imagens

#### B. Offline Support
- [ ] PWA completo
- [ ] Cache offline do mapa
- [ ] Sincronização quando online
- [ ] Indicador de status online/offline

#### C. Analytics
- [ ] Tracking de eventos
- [ ] Tempo de jogo médio
- [ ] Locais mais visitados
- [ ] Taxa de conclusão de missões
- [ ] Retenção de utilizadores

#### D. Testes
- [ ] Testes unitários (Jest)
- [ ] Testes de integração
- [ ] Testes E2E (Cypress)
- [ ] Testes de performance
- [ ] Testes de acessibilidade

---

### 7️⃣ **Acessibilidade** (Alta Prioridade)

#### A. Suporte Visual
- [ ] Modo alto contraste
- [ ] Tamanho de texto ajustável
- [ ] Modo daltónico
- [ ] Redução de animações
- [ ] Leitor de ecrã (ARIA labels)

#### B. Suporte Motor
- [ ] Controlos por voz
- [ ] Navegação por teclado completa
- [ ] Botões maiores (modo fácil)
- [ ] Tempo de reação ajustável

#### C. Suporte Cognitivo
- [ ] Tutorial interativo passo-a-passo
- [ ] Modo simplificado
- [ ] Dicas contextuais mais frequentes
- [ ] Interface personalizável

---

### 8️⃣ **Monetização** (Futuro - Baixa Prioridade)

#### A. Itens Cosméticos
- [ ] Skins de avatar
- [ ] Efeitos de ataque especiais
- [ ] Marcadores personalizados
- [ ] Temas de interface

#### B. Battle Pass
- [ ] Passe semanal/mensal
- [ ] Recompensas exclusivas
- [ ] Missões especiais
- [ ] Ranking exclusivo

#### C. Lojas
- [ ] Loja de itens cosméticos
- [ ] Loja de power-ups (opcional)
- [ ] Promoções sazonais
- [ ] Pacotes de desconto

---

## 📅 Roadmap Sugerido

### Mês 1: Integração e Polimento
- Semana 1: Integrar Leaderboard, Compass, PlayerProfile
- Semana 2: Integrar ActiveEffects, CitySelector, SeasonalEventBanner
- Semana 3: Melhorar sistema de combate
- Semana 4: Testes e correção de bugs

### Mês 2: Conteúdo e Eventos
- Semana 1: Implementar evento de Halloween
- Semana 2: Adicionar 5 novos bosses
- Semana 3: Expandir para Lisboa (10 locais)
- Semana 4: Sistema de dificuldade progressiva

### Mês 3: Multiplayer e Expansão
- Semana 1: Sistema de amigos e chat
- Semana 2: Missões cooperativas
- Semana 3: Evento de Natal
- Semana 4: Expandir para Porto (10 locais)

### Mês 4: Otimização e Acessibilidade
- Semana 1: PWA e offline support
- Semana 2: Otimizações de performance
- Semana 3: Acessibilidade completa
- Semana 4: Analytics e métricas

---

## 🎓 Aprendizagens e Melhorias de Código

### Arquitetura
- [ ] Migrar para Redux Toolkit (mais escalável)
- [ ] Implementar React Query para dados remotos
- [ ] Adicionar Error Boundaries
- [ ] Implementar Suspense para lazy loading

### Código
- [ ] Refatorar componentes grandes (>300 linhas)
- [ ] Adicionar mais TypeScript types
- [ ] Implementar custom hooks reutilizáveis
- [ ] Documentar funções complexas

### DevOps
- [ ] CI/CD com GitHub Actions
- [ ] Deploy automático para Vercel/Netlify
- [ ] Staging environment
- [ ] Monitoramento de erros (Sentry)

---

## 💡 Ideias Criativas

### Narrativa
- [ ] Modo história com cutscenes
- [ ] Diálogos com personagens históricos
- [ ] Missões com escolhas morais
- [ ] Finais alternativos

### Social
- [ ] Partilha de conquistas nas redes sociais
- [ ] Screenshots automáticos
- [ ] Replay de momentos épicos
- [ ] Clãs e guildas

### Gamificação
- [ ] Sistema de títulos
- [ ] Emotes e gestos
- [ ] Customização de base
- [ ] Colecionáveis raros

### Educação
- [ ] Quiz histórico após descobrir local
- [ ] Factos curiosos em popups
- [ ] Linha do tempo interativa
- [ ] Vídeos educativos curtos

---

## 📝 Notas Importantes

### Prioridades Atuais
1. **Alta**: Integração de componentes faltantes
2. **Alta**: Melhorias de acessibilidade
3. **Média**: Eventos sazonais
4. **Média**: Expansão de conteúdo
5. **Baixa**: Multiplayer
6. **Baixa**: Monetização

### Métricas de Sucesso
- Tempo médio de sessão > 10 minutos
- Taxa de retorno > 40%
- Conclusão de tutorial > 80%
- Descoberta de 5+ locais > 60%
- Rating na app store > 4.5 estrelas

### Riscos
- Performance em dispositivos antigos
- Bateria em modo AR
- Precisão do GPS em interiores
- Engajamento a longo prazo
- Conteúdo repetitivo

---

## 🔗 Recursos Úteis

### Documentação
- [React Docs](https://react.dev)
- [Leaflet Docs](https://leafletjs.com)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)

### Inspiração
- Pokémon GO (gameplay AR)
- Ingress (exploração urbana)
- Geocaching (descoberta de locais)
- Assassin's Creed Discovery Tour (história)

### Ferramentas
- Figma (design)
- Google Analytics (métricas)
- Sentry (erros)
- Lighthouse (performance)

---

**Última atualização**: Janeiro 2026
**Versão atual**: 1.0.0
**Próxima versão**: 1.1.0 (Integração de componentes)
