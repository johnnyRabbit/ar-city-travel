import { create } from 'zustand';
import { supabase, Player } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  player: Player | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
  loadPlayer: () => Promise<void>;
  updatePlayer: (updates: Partial<Player>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  player: null,
  loading: true,
  error: null,

  signUp: async (email, password, username) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create player record
        const { error: playerError } = await supabase
          .from('players')
          .insert({
            id: data.user.id,
            username,
            avatar: '🧑‍🚀',
            level: 1,
            points: 0,
            total_distance: 0,
            zombies_killed: 0,
            locations_discovered: 0,
            bosses_defeated: 0
          });

        if (playerError) throw playerError;

        set({ user: data.user, loading: false });
        await get().loadPlayer();
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      set({ user: data.user, loading: false });
      await get().loadPlayer();
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signInWithOAuth: async (provider) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({ user: null, player: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  loadPlayer: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      set({ player: data });
    } catch (error: any) {
      console.error('Error loading player:', error);
    }
  },

  updatePlayer: async (updates) => {
    const { user, player } = get();
    if (!user || !player) return;

    try {
      const { data, error } = await supabase
        .from('players')
        .update({ ...updates, last_active: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      set({ player: data });
    } catch (error: any) {
      console.error('Error updating player:', error);
    }
  }
}));

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    useAuthStore.setState({ user: session.user, loading: false });
    useAuthStore.getState().loadPlayer();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, player: null, loading: false });
  }
});
