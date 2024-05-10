/* eslint-disable functional/immutable-data */
import { createServerClient } from '@supabase/ssr'

import plugin from '../plugin'

import type { CookieOptions } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

const testSupabaseUrl = process.env['CI'] ? 'http://localhost:54321' : 'http://127.0.0.1:54321'
const testSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdHFtbWF4bXluYWhzZ2Z1dmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwMzc3MzEsImV4cCI6MjAxNDYxMzczMX0.TEyzdP13ogqp6NGhSQYwtzOkwmuJDMkXUjU3gUVmN1c'
const testConfig = {
  supabaseUrl: testSupabaseUrl,
  supabaseAnonKey: testSupabaseAnonKey,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createSupabaseServerClient = (): SupabaseClient<any, 'public', any> => {
  const { supabaseUrl, supabaseAnonKey } = process.env.NODE_ENV === 'test' ? testConfig : plugin.config

  return createServerClient(
    supabaseUrl as string,
    supabaseAnonKey as string,
    {
      cookies: {
        get(_: string) {
          return undefined
        },
        set(_: string, __: string, ___: CookieOptions) {
          // storage[name] = value
        },
        remove(_: string, __: CookieOptions) {
          // delete storage[name]
        },
      },
    },
  )
}
