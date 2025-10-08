import { useState } from 'react'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

const initialState: FormState = { name: '', email: '', subject: '', message: '' }

const Contact = () => {
  const [form, setForm] = useState<FormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function validate(): string | null {
    if (!form.name.trim()) return 'Podaj imię i nazwisko'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Podaj poprawny adres email'
    if (!form.subject.trim()) return 'Podaj temat wiadomości'
    if (form.message.trim().length < 10) return 'Wiadomość musi mieć min. 10 znaków'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setSubmitting(true)
    try {
      // Placeholder: send to backend when available
      await new Promise(r => setTimeout(r, 800))
      setSuccess('Dziękujemy! Odezwiemy się wkrótce.')
      setForm(initialState)
    } catch {
      setError('Nie udało się wysłać formularza. Spróbuj ponownie.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-neutral-200">
      <h1 className="text-2xl font-bold mb-2">Kontakt</h1>
      <p className="text-neutral-400 mb-6">Masz pytania? Wypełnij formularz, a wrócimy do Ciebie.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-400">{error}</div>}
        {success && <div className="text-sm text-green-400">{success}</div>}

        <div>
          <label htmlFor="name" className="block text-sm mb-1">Imię i nazwisko</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-700 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-700"
            placeholder="Jan Kowalski"
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-700 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-700"
            placeholder="jan.kowalski@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm mb-1">Temat</label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={form.subject}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-700 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-700"
            placeholder="Pytanie dotyczące konta"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm mb-1">Wiadomość</label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={6}
            className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-700"
            placeholder="Opisz krótko sprawę..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-cyan-800 hover:bg-cyan-700 disabled:opacity-50 text-white font-medium"
        >
          {submitting ? 'Wysyłanie…' : 'Wyślij wiadomość'}
        </button>
      </form>
    </div>
  )
}

export default Contact


