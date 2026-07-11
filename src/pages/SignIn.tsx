import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function SignIn() {
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) {
    return <Navigate to="/account" replace />
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result =
      mode === 'signin' ? signIn(email, password) : signUp(name, email, password)
    if (result) {
      setError(result)
      return
    }
    navigate('/account')
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-ink">
        {mode === 'signin' ? 'Welcome back' : 'Create your profile'}
      </h1>
      <p className="mt-2 text-ink-soft">
        {mode === 'signin'
          ? 'Sign in to see your saved details and order history.'
          : 'Save your details for faster checkout next time.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        {mode === 'signup' && (
          <input
            required
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-gold"
          />
        )}
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-gold"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={4}
          className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-gold"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-gold"
        >
          {mode === 'signin' ? 'Sign in' : 'Create profile'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin')
          setError(null)
        }}
        className="mt-4 text-sm text-ink-soft hover:text-gold"
      >
        {mode === 'signin'
          ? "Don't have a profile? Create one"
          : 'Already have a profile? Sign in'}
      </button>
    </main>
  )
}
