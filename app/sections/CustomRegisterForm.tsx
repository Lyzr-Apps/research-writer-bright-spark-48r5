'use client'

import React, { useState } from 'react'
import { useAuth } from './CustomAuthProvider'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export default function CustomRegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setIsSubmitting(true)
    const result = await register(email, password, name || undefined)
    if (result.success) {
      onSuccess?.()
    } else {
      setError(result.error || 'Registration failed')
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
          <label htmlFor="reg-name" className="block text-sm mb-1 text-foreground">Name (optional)</label>
          <input
            id="reg-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full px-3 py-2 border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reg-email" className="block text-sm mb-1 text-foreground">Email</label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-3 py-2 border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="reg-password" className="block text-sm mb-1 text-foreground">Password (min 8 characters)</label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      {onSwitchToLogin && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-[hsl(var(--accent))] underline bg-transparent border-none cursor-pointer">
            Sign in
          </button>
        </p>
      )}
    </div>
  )
}
