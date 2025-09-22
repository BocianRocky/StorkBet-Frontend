import PromotionCard from "../components/layout/PromotionCard";
import { Promotion } from "../types/promotion";
import { useEffect, useState } from "react";

const Promotions = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    useEffect(() => {
        const fetchPromotions = async () => {
          try {
            const response = await fetch("http://localhost:4000/Promotions");
            const data = await response.json();
            setPromotions(data);
          } catch (error) {
            console.error("Błąd podczas pobierania promocji:", error);
          }
        };
        fetchPromotions();
      }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl">
                {
                    promotions.map(promotion => (
                        <PromotionCard key={promotion.id} promotion={promotion} />
                    ))
                }
            </div>
        </div>
    );
}
export default Promotions;