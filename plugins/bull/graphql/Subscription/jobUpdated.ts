const jobUpdated = {
  // subscribe to the jobUpdated event
  subscribe: (_, __, {pubSub}) => {
    console.log('subscribing to jobUpdated');
    return pubSub.subscribe('jobUpdated');
  },
  resolve: (payload: unknown) => {
    console.log('resolving jobUpdated', payload);
    return payload
  }
}

export default jobUpdated