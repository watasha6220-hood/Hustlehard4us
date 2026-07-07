"use client";

import { createClient } from "@supabase/supabase-js";

// ============================================================
//  SUPABASE CLIENT
//  1. Create a free project at https://supabase.com
//  2. Copy .env.local.example → .env.local and fill in:
//       NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//       NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
//  3. Run supabase/schema.sql in the Supabase SQL editor.
//
//  NO KEYS? No problem — the app automatically runs in
//  DEMO MODE using localStorage so everything still works.
// ============================================================

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
