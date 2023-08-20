import { verifyAuth } from "../../../auth/interop/verifyAuth"
import kv from "../../kv"

export default (_, { token }) => {
  const { userId } = verifyAuth(token)
  const todoIdWithUser = userId + '_'
  const allTodos = Array.from(kv.entries())
  return allTodos.filter(([key, _]) => key.startsWith(todoIdWithUser)).map(([_, todo]) => todo)
}