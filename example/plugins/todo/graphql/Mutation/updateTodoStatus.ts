import { verifyAuth } from "../../../auth/interop/verifyAuth"
import kv from "../../kv"

export default (_, { id, completed, token }) => {
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