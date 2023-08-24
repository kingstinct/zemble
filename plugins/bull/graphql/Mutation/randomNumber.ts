
import pubSub from '../../pubsub'
export default (_:any, { queue }: { queue: string }) => {
  const randomNumber = Math.floor(Math.random() * 1000)

  pubSub.publish('randomNumber', randomNumber)

  return randomNumber
}