export function onPubSub<TKey extends keyof Zemble.PubSubTopics>(pubsub: Zemble.GraphQLContext['pubsub'], eventName: TKey, callback: (value: Zemble.PubSubTopics[TKey][0]) => void) {
  const subscribeKey = eventName as unknown as keyof Zemble.PubSubTopics
  const repeater = pubsub.subscribe(subscribeKey as unknown as string)
  let listening = true

  const listen = async () => {
    // eslint-disable-next-line no-restricted-syntax
    for await (const message of repeater) {
      if (!listening) {
        break
      }
      callback(message)
    }
  }

  void listen()

  return async () => {
    listening = false
    return repeater.return()
  }
}
