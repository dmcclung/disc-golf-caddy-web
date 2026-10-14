import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Server-side Supabase client helpers (Node scripts)
// Reads values from process.env (never expose service role to the client)

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getAnonClient() {
  const url = requireEnv('SUPABASE_URL');
  const anonKey = requireEnv('SUPABASE_PUBLISHABLE_KEY');
  return createClient<Database>(url, anonKey, {
    db: { schema: 'api' },
  });
}

export function getServiceRoleClient() {
  const url = requireEnv('SUPABASE_URL');
  const serviceKey = requireEnv('SUPABASE_SECRET_KEY');
  return createClient<Database>(url, serviceKey, {
    db: { schema: 'api' },
  });
}

export function getInsertClient(dryRun: boolean) {
  return dryRun ? getAnonClient() : getServiceRoleClient();
}


