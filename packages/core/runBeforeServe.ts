export const runBeforeServe = async (app: Zemble.App) => {
  await app.runBeforeServe.reduce(async (prev, runner) => {
    await prev
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await runner()
  }, Promise.resolve())
}

export default runBeforeServe
