import { useFilter } from "@/app/hooks/useFilter";
import { Button, Divider, Input, InputNumber } from "antd";

export const Filter = () => {
  const {
    maxPrice,
    minPrice,
    filterName,
    filterYear,
    clearFilters,
    handleMinPrice,
    handleMaxPrice,
    handleFilterName,
    handleFilterYear,
  } = useFilter();

  return (
    <>
      {/* Nome */}
      <div className="mb-4 flex flex-col">
        <label className="text-sm font-medium">Nome</label>
        <Input
          placeholder="Ex: Ferrari"
          value={filterName}
          onChange={(e) => handleFilterName(e.target.value)}
        />
      </div>

      {/* Ano */}
      <div className="mb-4 flex flex-col w-full">
        <label className="text-sm font-medium mb-1">Ano</label>
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          placeholder="Selecione o ano"
          value={filterYear ?? undefined}
          onChange={(value) => handleFilterYear(value)}
        />
      </div>

      {/* Preço */}
      <div className="mb-4 flex flex-col">
        <label className="text-sm font-medium">Preço mínimo</label>
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          type="number"
          placeholder="R$ mínimo"
          value={minPrice ?? undefined}
          onChange={(value) => handleMinPrice(value)}
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label className="text-sm font-medium">Preço máximo</label>
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          placeholder="R$ máximo"
          value={maxPrice ?? undefined}
          onChange={(value) => handleMaxPrice(value)}
        />
      </div>

      <Divider />
      <Button type="primary" block onClick={clearFilters}>
        Filtrar
      </Button>
      <Button className="mt-2" type="link" block onClick={clearFilters}>
        Limpar filtros
      </Button>
    </>
  );
};
