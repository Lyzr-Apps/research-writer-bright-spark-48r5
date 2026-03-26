'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AuthProvider, ProtectedRoute } from 'lyzr-architect/client'
import { callAIAgent } from '@/lib/aiAgent'
import parseLLMJson from '@/lib/jsonParser'
import { Card, CardContent } from '@/components/ui/card'
import Header from './sections/Header'
import AuthScreen from './sections/AuthScreen'
import TopicInput from './sections/TopicInput'
import ArticleLibrary from './sections/ArticleLibrary'
import ArticleView from './sections/ArticleView'

const MANAGER_AGENT_ID = '69c500924f851c627e46ab69'

const THEME_VARS = {
  '--background': '0 0% 98%',
  '--foreground': '0 0% 8%',
  '--card': '0 0% 100%',
  '--card-foreground': '0 0% 8%',
  '--primary': '0 0% 8%',
  '--primary-foreground': '0 0% 98%',
  '--secondary': '0 0% 94%',
  '--secondary-foreground': '0 0% 12%',
  '--accent': '0 80% 45%',
  '--accent-foreground': '0 0% 98%',
  '--muted': '0 0% 92%',
  '--muted-foreground': '0 0% 40%',
  '--border': '0 0% 85%',
  '--input': '0 0% 80%',
  '--destructive': '0 80% 45%',
  '--ring': '0 0% 8%',
  '--radius': '0rem',
} as React.CSSProperties

const SAMPLE_ARTICLES = [
  { _id: 's1', title: 'The Future of Quantum Computing in Healthcare', topic: 'Quantum Computing Healthcare', summary: 'An in-depth exploration of how quantum computing is poised to revolutionize drug discovery, medical imaging, and personalized treatments.', word_count: 2450, status: 'completed', createdAt: '2026-03-18T10:30:00Z' },
  { _id: 's2', title: 'Sustainable Architecture: Building for the Next Century', topic: 'Green Architecture', summary: 'How architects and engineers are designing buildings that minimize environmental impact while maximizing human comfort and productivity.', word_count: 1890, status: 'completed', createdAt: '2026-03-17T14:00:00Z' },
  { _id: 's3', title: 'The Economics of Space Mining', topic: 'Space Mining Economics', summary: 'Analyzing the potential trillion-dollar asteroid mining industry, its technological requirements, and geopolitical implications.', word_count: 3100, status: 'completed', createdAt: '2026-03-15T09:00:00Z' },
]

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground text-sm">Try again</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

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

function parseAgentResponse(result: any) {
  try {
    let data = result?.response?.result
    if (data && typeof data === 'object' && (data.title || data.article_content || data.summary || data.sections)) {
      return {
        title: data.title ?? '',
        article_content: data.article_content ?? '',
        summary: data.summary ?? '',
        sources: Array.isArray(data.sources) ? data.sources : [],
        sections: Array.isArray(data.sections) ? data.sections : [],
        word_count: typeof data.word_count === 'number' ? data.word_count : 0,
      }
    }
    if (typeof data === 'string') {
      const parsed = parseLLMJson(data)
      if (parsed && typeof parsed === 'object' && !parsed.error) {
        return {
          title: parsed.title ?? '',
          article_content: parsed.article_content ?? '',
          summary: parsed.summary ?? '',
          sources: Array.isArray(parsed.sources) ? parsed.sources : [],
          sections: Array.isArray(parsed.sections) ? parsed.sections : [],
          word_count: typeof parsed.word_count === 'number' ? parsed.word_count : 0,
        }
      }
    }
    const raw = result?.raw_response
    if (raw) {
      const parsed = parseLLMJson(raw)
      if (parsed && typeof parsed === 'object' && !parsed.error) {
        const inner = parsed.result ?? parsed
        return {
          title: inner.title ?? '',
          article_content: inner.article_content ?? '',
          summary: inner.summary ?? '',
          sources: Array.isArray(inner.sources) ? inner.sources : [],
          sections: Array.isArray(inner.sections) ? inner.sections : [],
          word_count: typeof inner.word_count === 'number' ? inner.word_count : 0,
        }
      }
    }
    return null
  } catch {
    return null
  }
}

export default function Page() {
  const [view, setView] = useState<'home' | 'article'>('home')
  const [articles, setArticles] = useState<ArticleData[]>([])
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null)
  const [loadingArticles, setLoadingArticles] = useState(true)
  const [loadingArticle, setLoadingArticle] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [articlesError, setArticlesError] = useState<string | null>(null)
  const [genError, setGenError] = useState<string | null>(null)
  const [showSample, setShowSample] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)

  const fetchArticles = useCallback(async () => {
    try {
      setLoadingArticles(true)
      setArticlesError(null)
      const res = await fetch('/api/articles')
      const data = await res.json()
      if (data.success) {
        setArticles(Array.isArray(data.data) ? data.data : [])
      } else {
        setArticlesError(data.error || 'Failed to load articles')
      }
    } catch (err: any) {
      setArticlesError(err?.message || 'Failed to load articles')
    } finally {
      setLoadingArticles(false)
    }
  }, [])

  useEffect(() => { fetchArticles() }, [fetchArticles])

  const handleGenerate = async (topic: string) => {
    setIsGenerating(true)
    setGenError(null)
    let articleId = ''
    try {
      const createRes = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `Researching: ${topic}`, topic, status: 'generating' }),
      })
      const createData = await createRes.json()
      if (createData.success && createData.data?._id) {
        articleId = createData.data._id
        await fetchArticles()
      }

      setActiveAgentId(MANAGER_AGENT_ID)
      const result = await callAIAgent(`Research and write a comprehensive article about: ${topic}`, MANAGER_AGENT_ID)
      setActiveAgentId(null)

      if (result.success) {
        const parsed = parseAgentResponse(result)
        if (parsed) {
          const updateBody = {
            title: parsed.title || topic,
            content: parsed.article_content,
            summary: parsed.summary,
            sources: parsed.sources,
            sections: parsed.sections,
            word_count: parsed.word_count,
            status: 'completed',
          }
          if (articleId) {
            await fetch(`/api/articles/${articleId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updateBody),
            })
          }
          await fetchArticles()
        } else {
          if (articleId) {
            await fetch(`/api/articles/${articleId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'failed' }),
            })
          }
          setGenError('Could not parse the agent response. Please try again.')
          await fetchArticles()
        }
      } else {
        if (articleId) {
          await fetch(`/api/articles/${articleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'failed' }),
          })
        }
        setGenError(result.error || 'Article generation failed.')
        await fetchArticles()
      }
    } catch (err: any) {
      if (articleId) {
        try {
          await fetch(`/api/articles/${articleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'failed' }),
          })
        } catch {}
      }
      setGenError(err?.message || 'An unexpected error occurred.')
      await fetchArticles()
    } finally {
      setIsGenerating(false)
    }
  }

  const handleViewArticle = async (id: string) => {
    setLoadingArticle(true)
    setView('article')
    try {
      const res = await fetch(`/api/articles/${id}`)
      const data = await res.json()
      if (data.success) {
        setSelectedArticle(data.data)
      }
    } catch {} finally {
      setLoadingArticle(false)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a._id !== id))
      }
    } catch {}
  }

  const handleNavigateHome = () => {
    setView('home')
    setSelectedArticle(null)
  }

  const displayArticles = showSample ? SAMPLE_ARTICLES : articles

  const agents = [
    { id: MANAGER_AGENT_ID, name: 'Research Writer Manager', desc: 'Coordinates research and writing' },
    { id: '69c5007e1d83f69a4fdabce3', name: 'Web Research Agent', desc: 'Searches the web for sources' },
    { id: '69c5007e3c7ecc186a3e83c7', name: 'Content Writer Agent', desc: 'Crafts polished articles' },
  ]

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProtectedRoute unauthenticatedFallback={<div style={THEME_VARS}><AuthScreen /></div>}>
          <div style={THEME_VARS} className="min-h-screen bg-background text-foreground font-sans">
            <Header showSample={showSample} onToggleSample={setShowSample} onNavigateHome={handleNavigateHome} />

            {view === 'home' && (
              <>
                <TopicInput onGenerate={handleGenerate} isGenerating={isGenerating} />
                {genError && (
                  <div className="max-w-2xl mx-auto px-6 mb-4">
                    <Card className="border border-destructive shadow-none" style={{ borderRadius: 0 }}>
                      <CardContent className="p-4">
                        <p className="text-sm text-destructive">{genError}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
                <ArticleLibrary
                  articles={displayArticles as ArticleData[]}
                  loading={!showSample && loadingArticles}
                  error={showSample ? null : articlesError}
                  onView={handleViewArticle}
                  onDelete={handleDeleteArticle}
                />
              </>
            )}

            {view === 'article' && (
              <ArticleView article={selectedArticle} loading={loadingArticle} onBack={handleNavigateHome} />
            )}

            <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-border mt-8">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Powered by AI Agents</h4>
              <div className="flex flex-wrap gap-3">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-2 text-xs text-muted-foreground border border-border px-3 py-2">
                    <div className={`w-2 h-2 rounded-full ${activeAgentId === agent.id ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
                    <span className="font-medium text-foreground">{agent.name}</span>
                    <span className="hidden sm:inline">- {agent.desc}</span>
                  </div>
                ))}
              </div>
            </footer>
          </div>
        </ProtectedRoute>
      </AuthProvider>
    </ErrorBoundary>
  )
}
