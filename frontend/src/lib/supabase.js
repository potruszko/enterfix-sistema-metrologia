import {
    createClient
} from '@supabase/supabase-js'

const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL || 'https://bxvmakbndinmrghnmyyr.supabase.co'
const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4dm1ha2JuZGlubXJnaG5teXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTk5NDIsImV4cCI6MjA4OTU5NTk0Mn0.LGXBQnegPDSJsBY1KCOoZYCGCi9yLdZs4zJhbvU9LFM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)