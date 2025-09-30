export interface Promotion {
    id: number;
    title: string;
    description: string;
    image: string;
}

// Struktura promocji zwracana przez /api/Promotions/today
export interface PromotionToday {
    id: number;
    promotionName: string;
    dateStart: string;
    dateEnd: string;
    bonusType: string;
    bonusValue: number;
    promoCode: string | null;
    minDeposit: number | null;
    maxDeposit: number | null;
    image: string;
    description: string;
}
