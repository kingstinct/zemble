import { verifyAuth } from "../../interop/verifyAuth"

export default (_, {token}) => {
  const {userId} = verifyAuth(token)
  return {userId}
}