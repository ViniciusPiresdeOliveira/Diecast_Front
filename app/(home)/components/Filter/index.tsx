import { Button, Divider, Input, InputNumber } from "antd";
import { useState } from "react";

export const Filter = () => {
  const [filterName, setFilterName] = useState("");
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  return (
    <div className="border-blue-600 h-1/2 border mt-4 overflow-y-auto ml-4 p-4 w-64 rounded-lg max-sm:hidden">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>

      {/* Nome */}
      <div className="mb-4 flex flex-col">
        <label className="text-sm font-medium">Nome</label>
        <Input
          placeholder="Ex: Ferrari"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
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
          onChange={(value) => setFilterYear(value)}
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
          onChange={(value) => setMinPrice(value)}
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label className="text-sm font-medium">Preço máximo</label>
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          placeholder="R$ máximo"
          value={maxPrice ?? undefined}
          onChange={(value) => setMaxPrice(value)}
        />
      </div>

      <Divider />
      <Button
        type="primary"
        block
        onClick={() => {
          setFilterName("");
          setFilterYear(null);
          setMinPrice(null);
          setMaxPrice(null);
        }}
      >
        Filtrar
      </Button>
      <Button
        className="mt-2"
        type="link"
        block
        onClick={() => {
          setFilterName("");
          setFilterYear(null);
          setMinPrice(null);
          setMaxPrice(null);
        }}
      >
        Limpar filtros
      </Button>
    </div>
  );
};
