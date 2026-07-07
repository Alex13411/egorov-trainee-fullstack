export type AuthUser = {
  name: string
  email: string
  picture: string
}

export function readAuthFromUrl(): AuthUser | null {
  const params = new URLSearchParams(window.location.search)
  if (params.get('auth') !== 'success') {
    return null
  }

  const user: AuthUser = {
    name: params.get('name') ?? '',
    email: params.get('email') ?? '',
    picture: params.get('picture') ?? '',
  }

  window.history.replaceState({}, document.title, window.location.pathname)
  return user.email ? user : null
}

export function startGoogleLogin(): void {
  window.location.href = '/api/auth/google/login'
}
