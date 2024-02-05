export const randomHexColor = () => {
  let color = '#',
      i = 5
  // eslint-disable-next-line no-plusplus
  do { color += '0123456789abcdef'.substr(Math.random() * 16, 1) } while (i--)
  return color
}

export const randomHexColorAlpha = (alpha = '55') => {
  const color = randomHexColor()

  return `${color}${alpha}`
}

export default randomHexColorAlpha
