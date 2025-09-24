import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import { Promotion } from '@/types/promotion';
import 'swiper/swiper-bundle.css';

const PromotionsSlider: React.FC = () => {
  const promotions: Promotion[] = [
    {
      id: 1,
      title: 'Bonus Powitalny',
      description: 'Otrzymaj 100% bonusu do 500 zł na start!',
      image: '/reklama1.png'
    },
    {
      id: 2,
      title: 'Cashback Weekend',
      description: 'Zwrot do 20% z przegranych zakładów!',
      image: '/reklama2.png'
    },
    {
      id: 3,
      title: 'Liga Mistrzów',
      description: 'Specjalne kursy na mecze Ligi Mistrzów!',
      image: '/reklama3.png'
    },
    {
      id: 4,
      title: 'Liga Mistrzów',
      description: 'Specjalne kursy na mecze Ligi Mistrzów!',
      image: '/reklama1.png'
    },
    {
      id: 5,
      title: 'Liga Mistrzów',
      description: 'Specjalne kursy na mecze Ligi Mistrzów!',
      image: '/reklama2.png'
    },
    {
      id: 6,
      title: 'Liga Mistrzów',
      description: 'Specjalne kursy na mecze Ligi Mistrzów!',
      image: '/reklama3.png'
    },

  ];

  return (
    <section className="promotions-section">
      <div className="container mx-auto px-20">
        <Swiper
          modules={[Autoplay, Pagination, EffectCoverflow]}
          loop={true}
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
          {promotions.map((promotion) => (
            <SwiperSlide key={promotion.id}>
              <img
                src={promotion.image}
                alt={promotion.title}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PromotionsSlider;
