const countdown = {
  // This will return the value on every 1 sec until it reaches 0
  subscribe: async function* (_: unknown, { from }: { from: number }) {
    for (let i = from; i >= 0; i--) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      yield { countdown: i }
    }
  },
  resolve: (payload: unknown) => {
    console.log('resolving countdown', payload);
    return (payload as { countdown: number}).countdown
  }
}

export default countdown