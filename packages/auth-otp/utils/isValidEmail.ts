const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isValidEmail = (email: string) => emailRegex.test(email)
