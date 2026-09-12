import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
// Substitua estas variáveis pelas suas credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar se o Supabase está configurado
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://SEU_PROJETO.supabase.co' && 
  supabaseAnonKey !== 'SUA_CHAVE_ANONIMA');

// Criar cliente apenas se estiver configurado
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Tipos de dados
export interface Player {
  id: string;
  username: string;
  avatar: string;
  level: number;
  points: number;
  total_distance: number;
  zombies_killed: number;
  locations_discovered: number;
  bosses_defeated: number;
  created_at: string;
  last_active: string;
}

export interface ChatMessage {
  id: string;
  player_id: string;
  username: string;
  avatar: string;
  message: string;
  created_at: string;
}

export interface PlayerPosition {
  id: string;
  player_id: string;
  lat: number;
  lng: number;
  updated_at: string;
}

export interface Achievement {
  id: string;
  player_id: string;
  achievement_type: string;
  unlocked_at: string;
}

export interface GameSession {
  id: string;
  player_id: string;
  started_at: string;
  ended_at: string | null;
  score: number;
  zombies_killed: number;
  locations_discovered: number;
}
