import { create } from 'zustand';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isLocalMode: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  isLocalMode: !isSupabaseConfigured,

  initialize: async () => {
    // Se o Supabase não está configurado, entrar automaticamente em modo local
    if (!isSupabaseConfigured || !supabase) {
      console.log('[Auth] Supabase não configurado — modo local');
      set({ loading: false, isLocalMode: true });
      return;
    }

    try {
      // Verificar sessão atual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        set({ user: session.user, loading: false });
      } else {
        set({ loading: false });
      }

      // Ouvir mudanças de autenticação
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          set({ user: session.user, loading: false });
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, loading: false });
        }
      });
    } catch (error) {
      console.error('[Auth] Erro ao inicializar:', error);
      set({ loading: false, isLocalMode: true });
    }
  },

  signInAsGuest: () => {
    set({ isLocalMode: true, loading: false, user: null });
  },

  signOut: async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // Ignorar erros
      }
    }
    set({ user: null });
  },
}));
