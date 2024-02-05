export const ERROR_CODE = 'NOT_FOUND'

type Extensions = {
  readonly code: 'NOT_FOUND';
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.extensions = { code: ERROR_CODE }
    this.code = ERROR_CODE
    this.statusCode = 404
  }

  readonly extensions: Extensions

  readonly code: typeof ERROR_CODE

  readonly statusCode: number
}

export default NotFoundError
