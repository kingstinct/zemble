export const runBeforeServe = async (app: Zemble.App) => {
  await app.runBeforeServe.reduce(async (prev, runner) => {
    await prev
    await runner()
  }, Promise.resolve())
}

export default runBeforeServe
