export const authService = {
  login: (_c: { email: string; password: string }) => Promise.resolve({ access_token: '' as string }),
  logout: () => Promise.resolve(),
  refreshToken: () => Promise.resolve({ access_token: '' as string }),
  me: () => Promise.resolve(null),
}
