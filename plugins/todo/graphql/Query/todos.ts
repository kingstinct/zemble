
import { verifyAuth } from "readapt-plugin-anonymous-auth/utils/verifyAuth"
import kv from "../../utils/kv"

export default (_:any, { token }: { token: string }) => {
  const { userId } = verifyAuth(token)
  const todoIdWithUser = userId + '_'
  const allTodos = Array.from(kv.entries())
  return allTodos.filter(([key, _]) => key.startsWith(todoIdWithUser)).map(([_, todo]) => todo)
}
