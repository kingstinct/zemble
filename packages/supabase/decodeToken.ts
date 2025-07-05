import type { TokenContents } from '@zemble/core'
import { GraphQLError } from 'graphql'
import { createSupabaseServerClient } from './clients/createSupabaseServerClient'

export const decodeToken = async (token: string): Promise<TokenContents> => {
  const res = await createSupabaseServerClient().auth.getUser(token)
  createSupabaseServerClient().from('')
  const {
    data: { user },
  } = res

  if (!user) throw new GraphQLError('Authentication failed')

  return { ...user, sub: user.id }
}
