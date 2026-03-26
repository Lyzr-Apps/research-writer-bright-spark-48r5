'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from './CustomAuthProvider'
import { FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi'

export default function CustomUserMenu() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 border border-border bg-card text-foreground text-sm hover:bg-secondary transition-colors"
      >
        <div className="w-7 h-7 bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold rounded-full">
          {(user.name || user.email)[0].toUpperCase()}
        </div>
        <span className="hidden sm:inline">{user.name || user.email}</span>
        <FiChevronDown className="w-3 h-3" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-card border border-border shadow-lg min-w-[160px] z-50">
          <div className="px-3 py-2 border-b border-border text-xs text-muted-foreground">
            {user.email}
          </div>
          <button
            onClick={async () => { await logout(); setIsOpen(false) }}
            className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-secondary transition-colors flex items-center gap-2 bg-transparent border-none cursor-pointer"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
