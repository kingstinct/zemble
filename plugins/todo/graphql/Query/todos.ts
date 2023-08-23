
import { decodeToken } from "readapt-plugin-anonymous-auth/utils/typedToken"
import kv from "../../utils/kv"

export default (_:any, { token }: { token: string }) => {
  const { userId } = decodeToken(token)
  const todoIdWithUser = userId + '_'
  const allTodos = Array.from(kv.entries())
  return allTodos.filter(([key, _]) => key.startsWith(todoIdWithUser)).map(([_, todo]) => todo)
}
