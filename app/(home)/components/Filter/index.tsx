import { Label } from "@/app/components/Label";
import { useFilter } from "@/app/hooks/useFilter";
import { prefixExample } from "@/app/utils";
import { Button, Divider, Input, InputNumber, Select } from "antd";
import { brandOptions } from "./utils";

export const Filter = () => {
  const {
    maxPrice,
    amount,
    minPrice,
    name,
    year,
    mark,
    clearFilters,
    handleMinPrice,
    handleMaxPrice,
    handleName,
    handleYear,
    handleMark,
    handleAmount,
  } = useFilter();

  return (
    <>
      <div className="mb-4 flex flex-col">
        <Label className="max-sm:text-white" text="Minis" />
        <Select
          value={amount}
          onChange={handleAmount}
          placeholder="Selecione"
          className="w-full"
          options={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "30", label: "30" },
            { value: "40", label: "40" },
            { value: "50", label: "50" },
          ]}
        />
      </div>
      <div className="mb-4 flex flex-col">
        <Label className="max-sm:text-white" text="Marca" />
        <Select
          style={{ width: "100%" }}
          value={mark}
          onChange={(e) => handleMark(e)}
          options={brandOptions}
          // placeholder="Marca"
        />
      </div>
      <div className="mb-4 flex flex-col">
        <Label className="max-sm:text-white" text="Nome" />
        <Input
          placeholder={prefixExample + "Ferrari"}
          value={name}
          onChange={(e) => handleName(e.target.value)}
        />
      </div>

      <div className="mb-4 flex flex-col w-full">
        <Label className="max-sm:text-white" text="Ano" />
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          placeholder={prefixExample + new Date().getFullYear()}
          value={year ?? undefined}
          onChange={(value) => handleYear(value)}
        />
      </div>

      <div className="mb-4 flex flex-col">
        <Label className="max-sm:text-white" text="Preço mínimo" />
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          type="number"
          value={minPrice ?? undefined}
          onChange={(value) => handleMinPrice(value)}
        />
      </div>

      <div className="mb-4 flex flex-col">
        <Label className="max-sm:text-white" text="Preço máximo" />
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          type="number"
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
