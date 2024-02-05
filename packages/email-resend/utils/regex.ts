function escapeRegExp(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

export const regexMatchingEmail = (email: string): RegExp => {
  const escapedEmail = escapeRegExp(email)
  return new RegExp(`^${escapedEmail}$`, 'i')
}

export default { regexMatchingEmail }
