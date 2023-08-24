import { getQueues } from '../../utils/setupQueues'

export default (_:any, { token }: { token: string }) => {
  const queues = getQueues()

  return queues
}
