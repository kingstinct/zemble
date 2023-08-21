import { verifyAuth } from "../../utils/verifyAuth"

export default (_:unknown, {token}:{token: string}) => {
  try {
    verifyAuth(token)
    return true
  } catch (e) {
    return false
  }
}