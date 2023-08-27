import { verifyJwt } from '../../utils/verifyJwt'

const validate = (_: unknown, { token }: {readonly token: string}) => {
  try {
    verifyJwt(token)
    return true
  } catch (e) {
    return false
  }
}

export default validate
