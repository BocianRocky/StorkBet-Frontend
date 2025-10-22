import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/services/api";
import type { PromotionToday } from "@/types/promotion";

const formatDate = (iso: string) => {
	try {
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return iso;
		return d.toLocaleDateString();
	} catch {
		return iso;
	}
};

const Promotions = () => {
    const [promotions, setPromotions] = useState<PromotionToday[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		setLoading(true);
        apiService
            .fetchPromotionsToday()
            .then((data) => {
                if (mounted) {
                    setPromotions(Array.isArray(data) ? data : []);
                    setError(null);
                }
            })
			.catch((e: unknown) => {
				if (mounted) setError(e instanceof Error ? e.message : "Nieznany błąd");
			})
			.finally(() => {
				if (mounted) setLoading(false);
			});
		return () => {
			mounted = false;
		};
	}, []);

	if (loading) {
		return (
			<div className="w-full flex items-center justify-center py-10 text-muted-foreground">
				Ładowanie promocji...
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full flex items-center justify-center py-10 text-red-400">
				Błąd podczas pobierania promocji: {error}
			</div>
		);
	}

	return (
		<div className="w-full max-w-7xl mx-auto px-4">
			<h1 className="text-4xl font-semibold mb-8 mt-6">Promocje</h1>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center">
				{promotions.map((p) => {
					const imgSrc = p.image.startsWith('http') ? p.image : `${import.meta.env.VITE_API_BASE_URL || ''}${p.image}`;
					return (
						<Card key={p.id} className="overflow-hidden bg-neutral-950 border-neutral-800">
							<div className="aspect-[16/9] w-full overflow-hidden">
								<img
									src={imgSrc}
									alt={p.promotionName}
									className="h-full w-full object-cover"
									loading="lazy"
								/>
							</div>
							<CardHeader>
								<CardTitle className="text-lg text-white">{p.promotionName}</CardTitle>
								<CardDescription>
									{formatDate(p.dateStart)} – {formatDate(p.dateEnd)}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								<p className="text-sm text-muted-foreground">{p.description}</p>
								<div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
									<span className="text-muted-foreground">Typ bonusu</span>
									<span className="text-white">{p.bonusType} {p.bonusValue}%</span>
									<span className="text-muted-foreground">Min. depozyt</span>
									<span className="text-white">{p.minDeposit ?? '-'}</span>
									<span className="text-muted-foreground">Maks. depozyt</span>
									<span className="text-white">{p.maxDeposit ?? '-'}</span>
									<span className="text-muted-foreground">Kod promocyjny</span>
									<span className="text-white">{p.promoCode ?? '-'}</span>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
export default Promotions;