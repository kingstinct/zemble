import { PropsWithChildren, useContext } from "react"
import AuthContext from "../contexts/Auth"

export const ShowForUnauthenticated: React.FC<PropsWithChildren> = ({ children }) => {
  const { token } = useContext(AuthContext)
  return !token ? <>{children}</> : null
}

export default ShowForUnauthenticated