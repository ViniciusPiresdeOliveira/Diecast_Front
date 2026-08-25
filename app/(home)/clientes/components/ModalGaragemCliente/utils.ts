export const calculateDaysInGarage = (dataCadastro: string): number => {
  const normalized = dataCadastro.replace(/(\.\d{3})\d*Z$/, "$1Z");
  const date = new Date(normalized);

  if (isNaN(date.getTime())) return 0;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays < 0 ? 0 : diffDays;
};
