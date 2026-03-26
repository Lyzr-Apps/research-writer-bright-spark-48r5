'use client'

import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { FiFeather } from 'react-icons/fi'
import CustomUserMenu from './CustomUserMenu'

interface HeaderProps {
  showSample: boolean
  onToggleSample: (v: boolean) => void
  onNavigateHome: () => void
}

export default function Header({ showSample, onToggleSample, onNavigateHome }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={onNavigateHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <FiFeather className="w-6 h-6 text-[hsl(var(--accent))]" />
          <h1 className="text-xl font-serif font-bold tracking-tight text-foreground">Research Writer Hub</h1>
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch id="sample-toggle" checked={showSample} onCheckedChange={onToggleSample} />
            <Label htmlFor="sample-toggle" className="text-sm text-muted-foreground cursor-pointer">Sample Data</Label>
          </div>
          <CustomUserMenu />
        </div>
      </div>
    </header>
  )
}
