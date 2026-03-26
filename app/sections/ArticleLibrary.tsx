'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FiTrash2, FiEye, FiClock, FiFileText, FiLoader } from 'react-icons/fi'

interface ArticleItem {
  _id: string
  title: string
  topic: string
  summary?: string
  word_count?: number
  status: string
  createdAt?: string
}

interface ArticleLibraryProps {
  articles: ArticleItem[]
  loading: boolean
  error: string | null
  onView: (id: string) => void
  onDelete: (id: string) => void
}

export default function ArticleLibrary({ articles, loading, error, onView, onDelete }: ArticleLibraryProps) {
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h3 className="text-xl font-serif font-bold mb-6 text-foreground">Your Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-border rounded-none shadow-none">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 bg-muted w-3/4" />
                  <div className="h-3 bg-muted w-1/2" />
                  <div className="h-3 bg-muted w-full" />
                  <div className="h-3 bg-muted w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h3 className="text-xl font-serif font-bold mb-4 text-foreground">Your Articles</h3>
        <Card className="border border-border rounded-none shadow-none">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (!articles.length) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h3 className="text-xl font-serif font-bold mb-4 text-foreground">Your Articles</h3>
        <Card className="border border-border rounded-none shadow-none">
          <CardContent className="p-10 text-center">
            <FiFileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No articles yet. Enter a topic above to generate your first article.</p>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <h3 className="text-xl font-serif font-bold mb-6 text-foreground">Your Articles ({articles.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <Card key={article._id} className="border border-border rounded-none shadow-none hover:border-foreground transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-serif leading-snug">{article.title || 'Untitled'}</CardTitle>
                <Badge variant={article.status === 'completed' ? 'default' : article.status === 'generating' ? 'secondary' : 'destructive'} className="rounded-none text-xs shrink-0">
                  {article.status === 'generating' && <FiLoader className="w-3 h-3 animate-spin mr-1" />}
                  {article.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-2">Topic: {article.topic}</p>
              {article.summary && (
                <p className="text-sm text-foreground/80 line-clamp-2 mb-3 leading-relaxed">{article.summary}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {(article.word_count ?? 0) > 0 && (
                    <span className="flex items-center gap-1"><FiFileText className="w-3 h-3" />{article.word_count} words</span>
                  )}
                  {article.createdAt && (
                    <span className="flex items-center gap-1"><FiClock className="w-3 h-3" />{new Date(article.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="flex gap-1">
                  {article.status === 'completed' && (
                    <Button variant="ghost" size="sm" className="rounded-none h-8 px-3 text-xs" onClick={() => onView(article._id)}>
                      <FiEye className="w-3 h-3 mr-1" /> Read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="rounded-none h-8 px-2 text-xs text-destructive hover:text-destructive" onClick={() => onDelete(article._id)}>
                    <FiTrash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
