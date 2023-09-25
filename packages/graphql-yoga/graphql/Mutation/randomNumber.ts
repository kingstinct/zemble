import type { MutationResolvers } from '../schema.generated'

const randomNumber: MutationResolvers['randomNumber'] = (_, __, { pubsub }) => {
  const randomNumber = Math.floor(Math.random() * 1000)

  pubsub.publish('randomNumber', randomNumber)

  return randomNumber
}

export default randomNumber
