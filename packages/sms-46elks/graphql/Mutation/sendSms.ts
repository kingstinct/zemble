import plugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

export const sendSms: NonNullable<MutationResolvers['sendSms']> = async (
  _,
  data,
) => plugin.providers.sendSms(data)

export default sendSms
