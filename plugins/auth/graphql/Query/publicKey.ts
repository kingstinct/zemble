import plugin from "../../"

const { PUBLIC_KEY } = plugin.config

export default () => {
  return PUBLIC_KEY
}