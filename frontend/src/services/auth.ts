import { log } from '../utils/debug'

export type AuthUser = {
  name: string
  email: string
  picture: string
}

export function readAuthFromUrl(): AuthUser | null {
  log('readAuthFromUrl: start', window.location.search)

  const params = new URLSearchParams(window.location.search)
  if (params.get('auth') !== 'success') {
    log('readAuthFromUrl: no auth params')
    return null
  }

  const user: AuthUser = {
    name: params.get('name') ?? '',
    email: params.get('email') ?? '',
    picture: params.get('picture') ?? '',
  }

  window.history.replaceState({}, document.title, window.location.pathname)
  log('readAuthFromUrl: user', user.email)
  return user.email ? user : null
}

export function startGoogleLogin(): void {
  log('startGoogleLogin: redirect')
  window.location.href = '/api/auth/google/login'
}
