/* eslint-disable functional/immutable-data */

import { createClient } from '@supabase/supabase-js'

import plugin from './plugin'

const testSupabaseUrl = process.env['CI'] ? 'http://localhost:54321' : 'http://127.0.0.1:54321'
const testSupabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdHFtbWF4bXluYWhzZ2Z1dmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwMzc3MzEsImV4cCI6MjAxNDYxMzczMX0.TEyzdP13ogqp6NGhSQYwtzOkwmuJDMkXUjU3gUVmN1c'
const testConfig = {
  supabaseUrl: testSupabaseUrl,
  supabaseAnonKey: testSupabaseAnonKey,
}

const storage: Record<string, string> = {}

export const createSupabaseClient = () => {
  const { supabaseUrl, supabaseAnonKey } = process.env.NODE_ENV === 'test' ? testConfig : plugin.config

  return createClient(supabaseUrl as string, supabaseAnonKey as string, {
    auth: {
      storage: {
        getItem(name: string) {
          return storage[name] ?? null
        },
        setItem(name: string, value: string) {
          storage[name] = value
        },
        removeItem(name: string) {
          delete storage[name]
        },
      },
    },
  })
}

export async function signUpNewUser(email = 'example3@email.com', password = 'example-password') {
  const randomEmail = email.replace('3', (100 * Math.random()).toString())
  const res = await createSupabaseClient().auth.signUp({
    email: randomEmail,
    password,
    options: {},
  })

  if (res.error) {
    throw res.error
  }

  return res
}

export async function deleteAllUsers() {
  const { data } = await createSupabaseClient().auth.admin.listUsers()

  await Promise.all(
    data.users.map(async (user) => {
      const res = await createSupabaseClient().auth.admin.deleteUser(user.id)

      return res
    }),
  )
}
