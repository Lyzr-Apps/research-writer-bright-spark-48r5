'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FiSearch, FiLoader } from 'react-icons/fi'

interface TopicInputProps {
  onGenerate: (topic: string) => Promise<void>
  isGenerating: boolean
}

export default function TopicInput({ onGenerate, isGenerating }: TopicInputProps) {
  const [topic, setTopic] = useState('')

  const handleSubmit = async () => {
    const trimmed = topic.trim()
    if (!trimmed || isGenerating) return
    await onGenerate(trimmed)
    setTopic('')
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground mb-2">What would you like to research?</h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">Enter a topic and our AI agents will research the web, synthesize findings, and craft a polished article for you.</p>
      </div>
      <Card className="border border-border rounded-none shadow-none max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Input
              placeholder="e.g. The future of quantum computing in healthcare"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
              disabled={isGenerating}
              className="flex-1 rounded-none border-border text-sm"
            />
            <Button
              onClick={handleSubmit}
              disabled={!topic.trim() || isGenerating}
              className="rounded-none px-6 font-medium"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2"><FiLoader className="w-4 h-4 animate-spin" /> Generating...</span>
              ) : (
                <span className="flex items-center gap-2"><FiSearch className="w-4 h-4" /> Generate</span>
              )}
            </Button>
          </div>
          {isGenerating && (
            <div className="mt-4 p-4 bg-secondary border border-border">
              <p className="text-sm text-muted-foreground">Our agents are researching and writing your article. This may take a minute or two...</p>
              <div className="mt-2 h-1 bg-muted overflow-hidden">
                <div className="h-full bg-[hsl(var(--accent))] animate-pulse w-2/3" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
