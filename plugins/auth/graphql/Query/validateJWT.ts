import { verifyJwt } from '../../utils/verifyJwt'

const validate = async (_: unknown, { token }: {readonly token: string}) => {
  try {
    await verifyJwt(token)
    return true
  } catch (e) {
    return false
  }
}

export default validate
