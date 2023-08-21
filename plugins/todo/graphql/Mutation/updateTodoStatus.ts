import { verifyAuth } from "../../../simple-anonymous-auth/interop/verifyAuth"
import kv from "../../utils/kv"

export default (_:any, { id, completed, token }: { id: string, completed: boolean, token: string }) => {
  const { userId } = verifyAuth(token)
  const todoIdWithUser = userId + '_' + id
  const previous = kv.get(todoIdWithUser)
  if(previous){ 
    const todo = {...previous, completed}
    kv.set(todoIdWithUser, todo)
    return todo
  }
  return null;
}