import { GraphQLError } from 'graphql'

import { createSupabaseServerClient } from './clients/supabase'

export const decodeToken = async (token: string) => {
  const res = await createSupabaseServerClient().auth.getUser(token)
  const { data: { user } } = res

  if (!user) throw new GraphQLError('Authentication failed')

  return { payload: user }
}
