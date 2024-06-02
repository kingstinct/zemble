import getTokens from '../../utils/getTokens'
import { isValidE164Number } from '../../utils/isValidE164Number'

import type {
  MutationResolvers,
} from '../schema.generated'

export const smsLoginConfirm: NonNullable<MutationResolvers['smsLoginConfirm']> = async (_, {
  phoneNum: phoneNumIn, code,
}, { honoContext }) => {
  const phoneNum = phoneNumIn.trim()

  if (!isValidE164Number(phoneNum)) {
    return { __typename: 'PhoneNumNotValidError', message: 'Phone number is not valid' }
  }

  const { bearerToken, refreshToken } = await getTokens(code, phoneNum, honoContext)

  if (!bearerToken || !refreshToken) {
    return { __typename: 'CodeNotValidError', message: 'Code not valid' }
  }

  return {
    __typename: 'LoginConfirmSuccessfulResponse',
    bearerToken,
    refreshToken,
  }
}

export default smsLoginConfirm
