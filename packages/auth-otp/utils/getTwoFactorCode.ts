const getTwoFactorCode = () => {
  if (process.env.NODE_ENV === 'test') {
    return '000000'
  }
  const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString()

  return twoFactorCode
}

export default getTwoFactorCode
