'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FiArrowLeft, FiExternalLink, FiFileText, FiLoader } from 'react-icons/fi'

interface ArticleData {
  _id: string
  title: string
  topic: string
  content?: string
  summary?: string
  sources?: Array<{ title?: string; url?: string }>
  sections?: Array<{ heading?: string; content?: string }>
  word_count?: number
  status: string
  createdAt?: string
}

interface ArticleViewProps {
  article: ArticleData | null
  loading: boolean
  onBack: () => void
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-3 mb-1 font-serif">{line.slice(4)}</h4>
        if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-3 mb-1 font-serif">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-lg mt-4 mb-2 font-serif">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm leading-relaxed">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal text-sm leading-relaxed">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm leading-relaxed">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part)
}

export default function ArticleView({ article, loading, onBack }: ArticleViewProps) {
  if (loading) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-8">
        <Button variant="ghost" className="rounded-none mb-6 text-sm" onClick={onBack}>
          <FiArrowLeft className="w-4 h-4 mr-2" /> Back to Library
        </Button>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted w-3/4" />
          <div className="h-4 bg-muted w-1/3" />
          <div className="h-4 bg-muted w-full" />
          <div className="h-4 bg-muted w-full" />
          <div className="h-4 bg-muted w-2/3" />
        </div>
      </section>
    )
  }

  if (!article) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-8">
        <Button variant="ghost" className="rounded-none mb-6 text-sm" onClick={onBack}>
          <FiArrowLeft className="w-4 h-4 mr-2" /> Back to Library
        </Button>
        <p className="text-muted-foreground text-sm">Article not found.</p>
      </section>
    )
  }

  const sections = Array.isArray(article?.sections) ? article.sections : []
  const sources = Array.isArray(article?.sources) ? article.sources : []

  return (
    <section className="max-w-4xl mx-auto px-6 py-8">
      <Button variant="ghost" className="rounded-none mb-6 text-sm" onClick={onBack}>
        <FiArrowLeft className="w-4 h-4 mr-2" /> Back to Library
      </Button>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground leading-tight mb-3">{article.title || 'Untitled'}</h1>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Topic: {article.topic}</span>
            {(article.word_count ?? 0) > 0 && (
              <span className="flex items-center gap-1"><FiFileText className="w-3 h-3" /> {article.word_count} words</span>
            )}
            {article.createdAt && (
              <span>{new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            )}
          </div>
        </header>

        {article.summary && (
          <Card className="border border-border rounded-none shadow-none mb-8">
            <CardContent className="p-6">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Summary</h3>
              <p className="text-sm text-foreground leading-relaxed italic">{article.summary}</p>
            </CardContent>
          </Card>
        )}

        <Separator className="mb-8" />

        {sections.length > 0 ? (
          <div className="space-y-8 mb-8">
            {sections.map((section, idx) => (
              <div key={idx}>
                {section?.heading && (
                  <h2 className="text-xl font-serif font-bold mb-3 text-foreground">{section.heading}</h2>
                )}
                {section?.content && (
                  <div className="text-foreground/90">{renderMarkdown(section.content)}</div>
                )}
              </div>
            ))}
          </div>
        ) : article.content ? (
          <div className="mb-8 text-foreground/90">{renderMarkdown(article.content)}</div>
        ) : null}

        {sources.length > 0 && (
          <>
            <Separator className="mb-6" />
            <div className="mb-8">
              <h3 className="text-lg font-serif font-bold mb-4 text-foreground">Sources</h3>
              <div className="space-y-2">
                {sources.map((source, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <Badge variant="secondary" className="rounded-none text-xs mt-0.5 shrink-0">{idx + 1}</Badge>
                    <div>
                      <span className="text-foreground">{source?.title || 'Untitled source'}</span>
                      {source?.url && (
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 ml-2 text-[hsl(var(--accent))] hover:underline text-xs">
                          <FiExternalLink className="w-3 h-3" /> Visit
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </article>
    </section>
  )
}
