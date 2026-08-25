export const optionsCarousel = {
  type: "loop",
  perPage: 4,
  perMove: 1,
  gap: "20px",
  arrows: true,
  pagination: false,
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

export const formatListPTBR = (items?: { nome: string }[]): string => {
  if (!items || items.length === 0) return "";

  const names = items.map((item) => item.nome);

  if (names.length === 1) return names[0];

  if (names.length === 2) {
    return `${names[0]} e ${names[1]}`;
  }

  const last = names.pop();
  return `${names.join(", ")} e ${last}`;
};
