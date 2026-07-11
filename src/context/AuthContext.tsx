import { createContext, useContext, useState, type ReactNode } from 'react'

type StoredUser = {
  name: string
  email: string
  password: string
}

type PublicUser = {
  name: string
  email: string
}

type AuthContextValue = {
  user: PublicUser | null
  signUp: (name: string, email: string, password: string) => string | null
  signIn: (email: string, password: string) => string | null
  signOut: () => void
}

const USERS_KEY = 'primebites_users'
const SESSION_KEY = 'primebites_session'

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUsers(): Record<string, StoredUser> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function saveUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function toPublicUser(user: StoredUser): PublicUser {
  return { name: user.name, email: user.email }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(() => {
    const email = localStorage.getItem(SESSION_KEY)
    if (!email) return null
    const stored = loadUsers()[email]
    return stored ? toPublicUser(stored) : null
  })

  const signUp = (name: string, email: string, password: string): string | null => {
    const normalizedEmail = email.trim().toLowerCase()
    const users = loadUsers()
    if (users[normalizedEmail]) {
      return 'An account with this email already exists.'
    }
    const newUser: StoredUser = { name, email: normalizedEmail, password }
    users[normalizedEmail] = newUser
    saveUsers(users)
    localStorage.setItem(SESSION_KEY, normalizedEmail)
    setUser(toPublicUser(newUser))
    return null
  }

  const signIn = (email: string, password: string): string | null => {
    const normalizedEmail = email.trim().toLowerCase()
    const users = loadUsers()
    const stored = users[normalizedEmail]
    if (!stored || stored.password !== password) {
      return 'Incorrect email or password.'
    }
    localStorage.setItem(SESSION_KEY, normalizedEmail)
    setUser(toPublicUser(stored))
    return null
  }

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
