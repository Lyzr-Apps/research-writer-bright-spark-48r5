'use client'

import React, { useState } from 'react'
import { useAuth } from './CustomAuthProvider'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export default function CustomLoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    const result = await login(email, password)
    if (result.success) {
      onSuccess?.()
    } else {
      setError(result.error || 'Login failed')
    }
    setIsSubmitting(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="text-destructive text-sm mb-4">{error}</div>
        )}
        <div className="mb-4">
          <label htmlFor="login-email" className="block text-sm mb-1 text-foreground">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-3 py-2 border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="login-password" className="block text-sm mb-1 text-foreground">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-3 py-2 border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      {onSwitchToRegister && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-[hsl(var(--accent))] underline bg-transparent border-none cursor-pointer">
            Sign up
          </button>
        </p>
      )}
    </div>
  )
}
