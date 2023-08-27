import { isValid } from '../../utils/isValid'

export default (_: unknown, { token }: {readonly token: string}) => isValid(token)
