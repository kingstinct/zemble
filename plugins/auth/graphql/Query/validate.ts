import { isValid } from "../../utils/isValid"

export default (_:unknown, {token}:{token: string}) => {
  try {
    isValid(token)
    return true
  } catch (e) {
    return false
  }
}