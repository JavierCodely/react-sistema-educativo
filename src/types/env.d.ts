/// <reference types="vite/client" />

// Extend the existing ImportMetaEnv interface
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // Add other environment variables as needed
}

// Ensure import.meta.env has the correct type
interface ImportMeta {
  readonly env: ImportMetaEnv
}