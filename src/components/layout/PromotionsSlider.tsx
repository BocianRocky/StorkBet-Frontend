import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import { PromotionToday } from '@/types/promotion';
import { apiService } from '@/services/api';
import 'swiper/swiper-bundle.css';

const PromotionsSlider: React.FC = () => {
  const [promotions, setPromotions] = useState<PromotionToday[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    
    apiService
      .fetchPromotionsToday()
      .then((data) => {
        if (mounted) {
          setPromotions(Array.isArray(data) ? data : []);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (mounted) {
          setError(e instanceof Error ? e.message : "Nieznany błąd");
          console.error("Nie udało się pobrać promocji dla slidera:", e);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="promotions-section">
        <div className="container mx-auto px-20 py-10">
          <div className="text-center text-neutral-400">Ładowanie promocji...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="promotions-section">
        <div className="container mx-auto px-20 py-10">
          <div className="text-center text-red-400">Błąd podczas pobierania promocji</div>
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  // Powielamy promocje naprzemiennie 3 razy każda, aby slider miał więcej elementów
  // Przykład dla 2 promocji [A, B]: A, B, A, B, A, B
  const duplicatedPromotions: (PromotionToday & { uniqueKey: string })[] = [];
  const repetitions = 3;
  
  for (let i = 0; i < repetitions; i++) {
    promotions.forEach((promotion, index) => {
      duplicatedPromotions.push({
        ...promotion,
        uniqueKey: `${promotion.id}-rep-${i}-idx-${index}`
      });
    });
  }

  return (
    <section className="promotions-section">
      <div className="container mx-auto px-20">
        <Swiper
          modules={[Autoplay, Pagination, EffectCoverflow]}
          loop={duplicatedPromotions.length > 1}
          effect="coverflow"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          slidesPerView={2}
          centeredSlides
          spaceBetween={20}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="promotions-swiper"
        >
          {duplicatedPromotions.map((promotion) => {
            const imgSrc = promotion.image.startsWith('http') 
              ? promotion.image 
              : `${import.meta.env.VITE_API_BASE_URL || ''}${promotion.image}`;
            
            return (
              <SwiperSlide key={promotion.uniqueKey || promotion.id}>
                <img
                  src={imgSrc}
                  alt={promotion.promotionName}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  loading="lazy"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default PromotionsSlider;
