import {verifyAuth} from 'readapt-plugin-anonymous-auth/utils/verifyAuth'
import kv from "../../utils/kv"

export default (_:any, { title, token }: { title: string, token: string }) => {
  const id = Math.random().toString(36).substring(7)
  const { userId } = verifyAuth(token)
  const todo = {title, id, completed: false}
  kv.set(userId + '_' + id, {title, id, completed: false})
  return todo
}