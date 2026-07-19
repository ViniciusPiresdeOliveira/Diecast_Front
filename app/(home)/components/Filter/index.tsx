import { Label } from "@/app/components/Label";
import { useFilter } from "@/app/hooks/useFilter";
import { prefixExample } from "@/app/utils";
import { Button, Divider, Input, InputNumber, Select } from "antd";
import { FilterProps } from "./types";

export const Filter = ({ handleFilterMiniaturas, lists }: FilterProps) => {
  const {
    maxPrice,
    minPrice,
    name,
    year,
    mark,
    line,
    type,
    condition,
    scale,
    clearFilters,
    handleMinPrice,
    handleCondition,
    handleMaxPrice,
    handleName,
    handleYear,
    handleMark,
    handleType,
    handleLine,
    handleScale,
  } = useFilter();

  const formatCurrency = (value?: number) => {
    if (!value) return "R$ 0,00";

    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const parseCurrency = (value: string | undefined) => {
    if (!value) return 0;
    return Number(value.replace(/\D/g, ""));
  };

  return (
    <>
      <div className="mb-2 flex flex-col">
        <Label className="max-sm:text-white" text="Nome" />
        <Input
          placeholder={prefixExample + "Ferrari"}
          value={name ?? ""}
          onChange={(e) => handleName(e.target.value)}
        />
      </div>
      <div className="mb-2 flex flex-col">
        <Label className="max-sm:text-white" text="Marcas" />
        <Select
          mode="multiple"
          style={{ width: "100%", cursor: "pointer" }}
          onChange={handleMark}
          value={mark}
          options={lists?.marks.map((mark) => ({
            label: mark.nome,
            value: String(mark.id),
          }))}
        />
      </div>
      <div className="mb-2 flex flex-col w-full">
        <Label className="max-sm:text-white" text="Ano" />
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          placeholder={prefixExample + new Date().getFullYear()}
          value={year ?? undefined}
          onChange={(value) => handleYear(value)}
        />
      </div>
      <div className="mb-2 flex flex-col">
        <Label className="max-sm:text-white" text="Tipos" />
        <Select
          mode="multiple"
          style={{ width: "100%", cursor: "pointer" }}
          // placeholder="Tipos"
          onChange={(e) => handleType(e)}
          value={type}
          options={lists?.types.map((mark) => ({
            label: mark.nome,
            value: String(mark.id),
          }))}
        />
      </div>
      <div className="mb-2 flex flex-col">
        <Label className="max-sm:text-white" text="Linhas" />
        <Select
          mode="multiple"
          style={{ width: "100%", cursor: "pointer" }}
          // placeholder="Tipos"
          onChange={(e) => handleLine(e)}
          value={line}
          options={lists?.lines.map((mark) => ({
            label: mark.nome,
            value: String(mark.id),
          }))}
        />
      </div>
      <div className="mb-2 flex flex-col">
        <Label className="max-sm:text-white" text="Condição" />

        <Select
          mode="multiple"
          style={{ width: "100%", cursor: "pointer" }}
          // placeholder="Status"
          onChange={(e) => handleCondition(e)}
          value={condition}
          options={lists?.conditions.map((mark) => ({
            label: mark.nome,
            value: String(mark.id),
          }))}
        />
      </div>
      <div className="mb-2 flex flex-col">
        <Label className="max-sm:text-white" text="Escala" />
        <Select
          mode="multiple"
          style={{ width: "100%", cursor: "pointer" }}
          // placeholder="Escala"
          onChange={(e) => handleScale(e)}
          value={scale}
          options={lists?.scales.map((mark) => ({
            label: mark.nome,
            value: String(mark.id),
          }))}
        />
      </div>

      <div className="mb-2 flex flex-col">
        <Label className="max-sm:text-white" text="Preço mínimo" />
        <Input
          style={{ width: "100%" }}
          value={formatCurrency(minPrice || 0)}
          onChange={(e) => {
            const numericValue = parseCurrency(e.target.value);
            handleMinPrice(numericValue);
          }}
          inputMode="numeric"
        />
      </div>

      <div className="mb-0 flex flex-col">
        <Label className="max-sm:text-white" text="Preço máximo" />
        <Input
          style={{ width: "100%" }}
          value={formatCurrency(maxPrice || 0)}
          onChange={(e) => {
            const numericValue = parseCurrency(e.target.value);
            handleMaxPrice(numericValue);
          }}
          inputMode="numeric"
        />
      </div>

      <Divider style={{ marginTop: 12, marginBottom: 12 }} />

      <Button type="primary" block onClick={handleFilterMiniaturas}>
        Filtrar
      </Button>
      <Button
        className="mt-2 max-sm:text-white"
        type="dashed"
        block
        onClick={clearFilters}
      >
        Limpar filtros
      </Button>
    </>
  );
};
