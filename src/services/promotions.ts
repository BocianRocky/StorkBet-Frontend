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

export interface PromotionAvailable {
  id: number
  promotionName: string
  dateStart: string
  dateEnd: string
  bonusType: string
  bonusValue: number
  promoCode: string | null
  minDeposit: number | null
  maxDeposit: number | null
  image: string
  description: string
}

export interface UpdatePromotionRequest {
  promotionName: string
  dateStart: string
  dateEnd: string
  bonusType: string
  bonusValue: number
  promoCode: string
  minDeposit: number
  maxDeposit: number
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

export async function getAllPromotions(): Promise<PromotionAvailable[]> {
  const res = await fetch('/api/promotions/available', {
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

export async function updatePromotion(id: number, data: UpdatePromotionRequest): Promise<void> {
  const res = await fetchWithAuth(`/api/promotions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
}

export async function deletePromotion(id: number): Promise<void> {
  const res = await fetchWithAuth(`/api/Promotions/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
}


