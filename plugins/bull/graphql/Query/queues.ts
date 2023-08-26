import { getQueues } from '../../utils/setupQueues'

export default (_, { token }: { readonly token: string }) => {
  const queues = getQueues()

  return queues
}
