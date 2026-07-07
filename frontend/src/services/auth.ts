import { log } from '../utils/debug'

export type AuthUser = {
  name: string
  email: string
  picture: string
}

const AUTH_STORAGE_KEY = 'kairos_auth_user'

export function saveAuthUser(user: AuthUser): void {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  log('saveAuthUser', user.email)
}

export function loadAuthUser(): AuthUser | null {
  const raw = sessionStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    const user = JSON.parse(raw) as AuthUser
    return user.email ? user : null
  } catch {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function clearAuthUser(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
  log('clearAuthUser')
}

export function readAuthFromUrl(): AuthUser | null {
  log('readAuthFromUrl: start', window.location.search)

  const params = new URLSearchParams(window.location.search)

  if (params.get('auth') === 'error') {
    const message = params.get('message') ?? 'Sign in failed'
    window.history.replaceState({}, document.title, window.location.pathname)
    log('readAuthFromUrl: error', message)
    alert(`Google sign-in failed: ${message}`)
    return null
  }

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

  if (!user.email) return null

  saveAuthUser(user)
  log('readAuthFromUrl: user', user.email)
  return user
}

export function resolveAuthUser(): AuthUser | null {
  return readAuthFromUrl() ?? loadAuthUser()
}

function getAuthApiBase(): string {
  const configured = import.meta.env.VITE_AUTH_API_BASE?.trim()
  if (configured) return configured.replace(/\/$/, '')

  // OAuth session cookie must be set on the same host/port as the callback (:8000).
  return import.meta.env.DEV ? 'http://localhost:8000' : ''
}

export function startGoogleLogin(): void {
  log('startGoogleLogin: redirect')
  window.location.href = `${getAuthApiBase()}/api/auth/google/login`
}

export function logout(): void {
  clearAuthUser()
  window.location.href = '/'
}
