
import { decodeToken } from "readapt-plugin-anonymous-auth/utils/typedToken"
import kv from "../../utils/kv"

export default (_:any, { id, completed, token }: { id: string, completed: boolean, token: string }) => {
  const { userId } = decodeToken(token)
  const todoIdWithUser = userId + '_' + id
  const previous = kv.get(todoIdWithUser)
  if(previous){ 
    const todo = {...previous, completed}
    kv.set(todoIdWithUser, todo)
    return todo
  }
  return null;
}