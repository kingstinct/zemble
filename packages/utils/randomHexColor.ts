export const randomHexColor = () => {
  let color = '#',
    i = 5
  do {
    color += '0123456789abcdef'.substr(Math.random() * 16, 1)
  } while (i--)
  return color
}

export default randomHexColor
