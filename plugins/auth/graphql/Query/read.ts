import { isValid } from "../../utils/isValid"

export default (_:unknown, {token}:{token: string}) => {
  return isValid(token)
}