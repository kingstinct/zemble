export class MigrationLockError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MigrationLockError'
  }
}
