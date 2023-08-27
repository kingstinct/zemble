import { isValid } from '../../utils/isValid'

const validate = (_: unknown, { token }: {readonly token: string}) => {
  try {
    isValid(token)
    return true
  } catch (e) {
    return false
  }
}

export default validate
