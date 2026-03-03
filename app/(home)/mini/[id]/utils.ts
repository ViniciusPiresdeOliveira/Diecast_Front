export const optionsCarousel = {
  type: "loop",
  perPage: 4,
  perMove: 1,
  gap: "20px",
  arrows: true,
  pagination: true,
  autoplay: true,
  interval: 2500,
  speed: 850,
  breakpoints: {
    1024: {
      perPage: 3,
    },
    640: {
      perPage: 2,
    },
    435: {
      perPage: 1,
    },
  },
};
