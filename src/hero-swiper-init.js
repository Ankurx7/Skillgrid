import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

export function initHeroSwiper() {
  new Swiper('.hero-swiper', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    effect: 'fade',
    fadeEffect: { crossFade: true },
  });
}
