import { fetchWithAuth } from './fetchWithAuth'

export interface PromotionForUser {
  id: number
  promotionName: string
  dateStart: string
  dateEnd: string
  bonusType: string
  bonusValue: number
  promoCode: string | null
  minDeposit: number | null
  maxDeposit: number | null
  availability: 'available' | 'unavailable' | 'expired' | string
  image: string
  description: string
}

export async function getMyPromotions(): Promise<PromotionForUser[]> {
  const res = await fetchWithAuth('/api/Promotions/me', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  const data = await res.json()
  return Array.isArray(data) ? data : []
}


