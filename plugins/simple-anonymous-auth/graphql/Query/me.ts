import { verifyAuth } from "../../interop/verifyAuth"

export default (_:unknown, {token}:{token: string}) => {
  const {userId} = verifyAuth(token)
  return {userId}
}