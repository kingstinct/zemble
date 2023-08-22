import { getQueues } from '@readapt/core/utils/setupQueues'

export default (_:any, { token }: { token: string }) => {
  const queues = getQueues()

  return queues
}
