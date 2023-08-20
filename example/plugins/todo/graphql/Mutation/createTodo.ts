import { verifyAuth } from "../../../auth/interop/verifyAuth"
import kv from "../../kv"

export default (_, { title, token }) => {
  const id = Math.random().toString(36).substring(7)
  const { userId } = verifyAuth(token)
  const todo = {title, id, completed: false}
  kv.set(userId + '_' + id, {title, id, completed: false})
  return todo
}