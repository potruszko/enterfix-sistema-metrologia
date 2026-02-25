import {
    createClient
} from '@supabase/supabase-js'

// Variáveis de ambiente com fallback para produção
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://udxdjmqfzdldrjsiauka.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkeGRqbXFmemRsZHJqc2lhdWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MjUxMzIsImV4cCI6MjA4NzUwMTEzMn0.8pnQWsci1ntC3jJDuK1WqEt9pbgE6hXp7r06o7iFWpk'

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)