import { PropsWithChildren, useContext } from "react"
import AuthContext from "../contexts/Auth"

export const ShowForAuthenticated: React.FC<PropsWithChildren> = ({ children }) => {
  const { token } = useContext(AuthContext)
  return token ? <>{children}</> : null
}
