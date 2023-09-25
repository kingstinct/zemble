import { verifyJwt } from '../../utils/verifyJwt'

export default async (_: unknown, { token }: {readonly token: string}) => verifyJwt(token)
