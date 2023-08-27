import { verifyJwt } from '../../utils/verifyJwt'

export default (_: unknown, { token }: {readonly token: string}) => verifyJwt(token)
