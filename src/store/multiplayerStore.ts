import { create } from 'zustand';
import { supabase, Player, ChatMessage, PlayerPosition } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface MultiplayerState {
  onlinePlayers: Player[];
  playerPositions: Record<string, PlayerPosition>;
  chatMessages: ChatMessage[];
  channel: RealtimeChannel | null;
  connected: boolean;
  
  // Actions
  connect: (playerId: string) => void;
  disconnect: () => void;
  updatePosition: (playerId: string, lat: number, lng: number) => Promise<void>;
  sendChatMessage: (playerId: string, username: string, avatar: string, message: string) => Promise<void>;
  loadOnlinePlayers: () => Promise<void>;
  loadChatHistory: () => Promise<void>;
}

export const useMultiplayerStore = create<MultiplayerState>((set, get) => ({
  onlinePlayers: [],
  playerPositions: {},
  chatMessages: [],
  channel: null,
  connected: false,

  connect: (playerId) => {
    const { channel: existingChannel } = get();
    if (existingChannel) return;

    // Subscribe to realtime channels
    const channel = supabase
      .channel('game-room')
      // Player positions
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'player_positions',
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const position = payload.new as PlayerPosition;
            set((state) => ({
              playerPositions: {
                ...state.playerPositions,
                [position.player_id]: position
              }
            }));
          } else if (payload.eventType === 'DELETE') {
            const position = payload.old as PlayerPosition;
            set((state) => {
              const newPositions = { ...state.playerPositions };
              delete newPositions[position.player_id];
              return { playerPositions: newPositions };
            });
          }
        }
      )
      // Chat messages
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const message = payload.new as ChatMessage;
          set((state) => ({
            chatMessages: [...state.chatMessages.slice(-49), message]
          }));
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          set({ connected: true });
          console.log('[Multiplayer] ✅ Connected to realtime');
        }
      });

    set({ channel });

    // Update presence
    supabase
      .from('player_positions')
      .upsert({
        player_id: playerId,
        lat: 38.5702,
        lng: -7.9095,
        updated_at: new Date().toISOString()
      });

    // Load initial data
    get().loadOnlinePlayers();
    get().loadChatHistory();
  },

  disconnect: () => {
    const { channel } = get();
    if (channel) {
      supabase.removeChannel(channel);
      set({ channel: null, connected: false, onlinePlayers: [], playerPositions: {} });
    }
  },

  updatePosition: async (playerId, lat, lng) => {
    try {
      await supabase
        .from('player_positions')
        .upsert({
          player_id: playerId,
          lat,
          lng,
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating position:', error);
    }
  },

  sendChatMessage: async (playerId, username, avatar, message) => {
    try {
      await supabase
        .from('chat_messages')
        .insert({
          player_id: playerId,
          username,
          avatar,
          message
        });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },

  loadOnlinePlayers: async () => {
    try {
      // Get players active in last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .gte('last_active', fiveMinutesAgo)
        .order('points', { ascending: false })
        .limit(50);

      if (error) throw error;

      set({ onlinePlayers: data || [] });
    } catch (error) {
      console.error('Error loading online players:', error);
    }
  },

  loadChatHistory: async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      set({ chatMessages: (data || []).reverse() });
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }
}));
