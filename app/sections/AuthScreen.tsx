'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FiFeather } from 'react-icons/fi'
import CustomLoginForm from './CustomLoginForm'
import CustomRegisterForm from './CustomRegisterForm'

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <FiFeather className="w-10 h-10 text-[hsl(var(--accent))] mb-3" />
          <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">Research Writer Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">Research topics and generate polished articles</p>
        </div>
        <Card className="border border-border rounded-none shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-serif">{mode === 'login' ? 'Sign In' : 'Create Account'}</CardTitle>
          </CardHeader>
          <CardContent>
            {mode === 'login' ? (
              <CustomLoginForm onSwitchToRegister={() => setMode('register')} />
            ) : (
              <CustomRegisterForm onSwitchToLogin={() => setMode('login')} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
