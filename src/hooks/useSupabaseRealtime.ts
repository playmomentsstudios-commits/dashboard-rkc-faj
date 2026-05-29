import { useEffect } from 'react';
import { supabase, supabaseConfigError } from '../lib/supabase';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

type UseSupabaseRealtimeOptions = {
  table: string;
  event?: RealtimeEvent;
  enabled?: boolean;
  onChange: () => void;
};

export function useSupabaseRealtime({ table, event = '*', enabled = true, onChange }: UseSupabaseRealtimeOptions) {
  useEffect(() => {
    if (!enabled || supabaseConfigError) return undefined;

    const channel = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes', { event, schema: 'public', table }, onChange)
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [enabled, event, onChange, table]);
}
