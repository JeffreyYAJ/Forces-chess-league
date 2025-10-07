import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Player = {
  id: string;
  name: string;
  created_at: string;
};

export type Match = {
  id: string;
  day: number;
  match_number: number;
  white_player_id: string;
  black_player_id: string;
  white_score: number | null;
  black_score: number | null;
  status: 'scheduled' | 'completed';
  created_at: string;
};

export type Standing = {
  id: string;
  player_id: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  updated_at: string;
};
