import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Legal = () => {
  const location = useLocation()
  const navigate = useNavigate()

  type LegalDoc = {
    title: string
    intro?: string
    sections: { heading: string; paragraphs: string[] }[]
  }

  const [privacy, setPrivacy] = useState<LegalDoc | null>(null)
  const [terms, setTerms] = useState<LegalDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const initialTab = useMemo(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')
    return tab === 'regulamin' ? 'regulamin' : 'polityka'
  }, [location.search])

  function handleTabChange(value: string) {
    const search = new URLSearchParams(location.search)
    search.set('tab', value)
    navigate({ pathname: '/legal', search: `?${search.toString()}` }, { replace: true })
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const privacyUrl = '/polityka.json'
        const termsUrl = '/regulamin.json'
        const [pRes, tRes] = await Promise.all([fetch(privacyUrl), fetch(termsUrl)])
        if (!pRes.ok || !tRes.ok) throw new Error('Nie udało się pobrać dokumentów')
        const [pJson, tJson] = await Promise.all([pRes.json(), tRes.json()])

        // Normalize incoming JSON (public files use title/content keys)
        function normalize(doc: any): LegalDoc {
          const sections = Array.isArray(doc?.sections) ? doc.sections : []
          return {
            title: String(doc?.title || ''),
            intro: typeof doc?.intro === 'string' ? doc.intro : undefined,
            sections: sections.map((s: any) => ({
              heading: String(s?.heading ?? s?.title ?? ''),
              paragraphs: Array.isArray(s?.paragraphs)
                ? s.paragraphs.map((x: any) => String(x))
                : Array.isArray(s?.content)
                ? s.content.map((x: any) => String(x))
                : []
            }))
          }
        }

        const normalizedPrivacy = normalize(pJson)
        const normalizedTerms = normalize(tJson)
        if (!cancelled) {
          setPrivacy(normalizedPrivacy)
          setTerms(normalizedTerms)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Błąd ładowania danych')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-neutral-200">
      <h1 className="text-2xl font-bold mb-4">Informacje prawne</h1>
      <p className="text-neutral-400 mb-6">Poniżej znajdziesz dokumenty regulujące korzystanie z serwisu.</p>

      {loading && (
        <div className="text-neutral-400">Ładowanie…</div>
      )}
      {error && (
        <div className="text-red-400">{error}</div>
      )}

      {!loading && !error && (
      <Tabs value={initialTab} onValueChange={handleTabChange}>
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="polityka">Polityka prywatności</TabsTrigger>
          <TabsTrigger value="regulamin">Regulamin</TabsTrigger>
        </TabsList>

        <TabsContent value="polityka" className="mt-6 space-y-4">
          {privacy && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{privacy.title}</h2>
              {privacy.intro && <p className="text-neutral-300">{privacy.intro}</p>}
              {(privacy.sections ?? []).map((s, idx) => (
                <section key={`p-${idx}`}>
                  <h3 className="text-lg font-semibold mb-2">{s.heading}</h3>
                  {(s.paragraphs ?? []).map((p, i) => (
                    <p key={`p-${idx}-${i}`} className="text-neutral-300 mb-2">{p}</p>
                  ))}
                </section>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="regulamin" className="mt-6 space-y-4">
          {terms && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{terms.title}</h2>
              {terms.intro && <p className="text-neutral-300">{terms.intro}</p>}
              {(terms.sections ?? []).map((s, idx) => (
                <section key={`t-${idx}`}>
                  <h3 className="text-lg font-semibold mb-2">{s.heading}</h3>
                  {(s.paragraphs ?? []).map((p, i) => (
                    <p key={`t-${idx}-${i}`} className="text-neutral-300 mb-2">{p}</p>
                  ))}
                </section>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      )}
    </div>
  )
}

export default Legal


