-- ============================================
-- Évora Through Time - Schema SQL para Supabase
-- ============================================
-- Execute este SQL no SQL Editor do Supabase
-- Dashboard → SQL Editor → New Query

-- ============================================
-- 1. Tabela de Jogadores (Players)
-- ============================================
CREATE TABLE players (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar TEXT DEFAULT '🧑‍🚀',
  level INTEGER DEFAULT 1,
  points INTEGER DEFAULT 0,
  total_distance REAL DEFAULT 0,
  zombies_killed INTEGER DEFAULT 0,
  locations_discovered INTEGER DEFAULT 0,
  bosses_defeated INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Tabela de Posições dos Jogadores
-- ============================================
CREATE TABLE player_positions (
  player_id UUID PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. Tabela de Mensagens de Chat
-- ============================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar TEXT DEFAULT '🧑‍🚀',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. Tabela de Conquistas (Achievements)
-- ============================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, achievement_type)
);

-- ============================================
-- 5. Tabela de Sessões de Jogo
-- ============================================
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  score INTEGER DEFAULT 0,
  zombies_killed INTEGER DEFAULT 0,
  locations_discovered INTEGER DEFAULT 0
);

-- ============================================
-- 6. Tabela de Inventário
-- ============================================
CREATE TABLE player_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  acquired_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. Tabela de Missões Completadas
-- ============================================
CREATE TABLE player_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  completed_at TIMESTAMPTZ,
  UNIQUE(player_id, quest_id)
);

-- ============================================
-- 8. Índices para Performance
-- ============================================
CREATE INDEX idx_players_points ON players(points DESC);
CREATE INDEX idx_players_last_active ON players(last_active DESC);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_player_positions_updated_at ON player_positions(updated_at DESC);
CREATE INDEX idx_achievements_player ON achievements(player_id);
CREATE INDEX idx_game_sessions_player ON game_sessions(player_id);

-- ============================================
-- 9. Row Level Security (RLS)
-- ============================================

-- Ativar RLS em todas as tabelas
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_quests ENABLE ROW LEVEL SECURITY;

-- Players: Todos podem ver, apenas o dono pode editar
CREATE POLICY "Players are viewable by everyone" ON players
  FOR SELECT USING (true);

CREATE POLICY "Players can update own data" ON players
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Players can insert own data" ON players
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Player Positions: Todos podem ver, apenas o dono pode editar
CREATE POLICY "Positions are viewable by everyone" ON player_positions
  FOR SELECT USING (true);

CREATE POLICY "Players can update own position" ON player_positions
  FOR UPDATE USING (auth.uid() = player_id);

CREATE POLICY "Players can insert own position" ON player_positions
  FOR INSERT WITH CHECK (auth.uid() = player_id);

-- Chat Messages: Todos podem ver e inserir (se autenticados)
CREATE POLICY "Chat messages are viewable by everyone" ON chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = player_id);

-- Achievements: Todos podem ver, apenas o dono pode editar
CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "Players can manage own achievements" ON achievements
  FOR ALL USING (auth.uid() = player_id);

-- Game Sessions: Todos podem ver, apenas o dono pode editar
CREATE POLICY "Game sessions are viewable by everyone" ON game_sessions
  FOR SELECT USING (true);

CREATE POLICY "Players can manage own sessions" ON game_sessions
  FOR ALL USING (auth.uid() = player_id);

-- Inventory: Apenas o dono pode ver e editar
CREATE POLICY "Players can view own inventory" ON player_inventory
  FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "Players can manage own inventory" ON player_inventory
  FOR ALL USING (auth.uid() = player_id);

-- Quests: Apenas o dono pode ver e editar
CREATE POLICY "Players can view own quests" ON player_quests
  FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "Players can manage own quests" ON player_quests
  FOR ALL USING (auth.uid() = player_id);

-- ============================================
-- 10. Funções e Triggers
-- ============================================

-- Função para atualizar last_active automaticamente
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar last_active em players
CREATE TRIGGER update_player_last_active
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_last_active();

-- Função para limpar posições antigas (> 5 min)
CREATE OR REPLACE FUNCTION cleanup_old_positions()
RETURNS void AS $$
BEGIN
  DELETE FROM player_positions
  WHERE updated_at < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 11. Realtime (para sincronização)
-- ============================================

-- Publicar tabelas para Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE player_positions;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- ============================================
-- 12. Views úteis
-- ============================================

-- Leaderboard global
CREATE VIEW leaderboard AS
SELECT 
  p.id,
  p.username,
  p.avatar,
  p.level,
  p.points,
  p.zombies_killed,
  p.locations_discovered,
  p.bosses_defeated,
  RANK() OVER (ORDER BY p.points DESC) as rank
FROM players p
ORDER BY p.points DESC;

-- Jogadores online (ativos nos últimos 5 minutos)
CREATE VIEW online_players AS
SELECT 
  p.*,
  pp.lat,
  pp.lng
FROM players p
LEFT JOIN player_positions pp ON p.id = pp.player_id
WHERE p.last_active > NOW() - INTERVAL '5 minutes'
ORDER BY p.points DESC;

-- ============================================
-- FIM DO SCHEMA
-- ============================================
-- Após executar este SQL:
-- 1. Configure as variáveis de ambiente no Vercel:
--    VITE_SUPABASE_URL = https://seu-projeto.supabase.co
--    VITE_SUPABASE_ANON_KEY = sua-chave-anonima
-- 2. Ative o Realtime no Supabase Dashboard
-- 3. Configure Authentication (Google, GitHub, Email)
