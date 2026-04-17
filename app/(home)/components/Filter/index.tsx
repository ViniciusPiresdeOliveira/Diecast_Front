import { Label } from "@/app/components/Label";
import { useFilter } from "@/app/hooks/useFilter";
import { prefixExample } from "@/app/utils";
import { Button, Divider, Input, InputNumber, Select } from "antd";
import { FilterProps } from "./types";

export const Filter = ({ handleFilterMiniaturas }: FilterProps) => {
  const {
    maxPrice,
    minPrice,
    name,
    year,
    mark,
    line,
    type,
    status,
    clearFilters,
    handleMinPrice,
    handleStatus,
    handleMaxPrice,
    handleName,
    handleYear,
    handleMark,
    handleType,
    handleLine,
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
          style={{ width: "100%" }}
          onChange={handleMark}
          value={mark}
          options={[
            { label: "Hot Wheels", value: "Hot Wheels" },
            { label: "Matchbox", value: "Matchbox" },
          ]}
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
          style={{ width: "100%" }}
          // placeholder="Tipos"
          onChange={(e) => handleType(e)}
          value={type}
          options={[
            { label: "jdm", value: "JDM" },
            { label: "supercar", value: "Supercar" },
            { label: "muscle", value: "Muscle" },
            { label: "classic", value: "Clássico" },
          ]}
        />
      </div>
      <div className="mb-2 flex flex-col">
        <Label className="max-sm:text-white" text="Linhas" />
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          // placeholder="Tipos"
          onChange={(e) => handleLine(e)}
          value={line}
          options={[
            { label: "thunt", value: "T-Hunt" },
            { label: "superthunt", value: "Super T-Hunt" },
            { label: "mainline", value: "Mainline" },
          ]}
        />
      </div>
      <div className="mb-2 flex flex-col">
        <Label className="max-sm:text-white" text="Status" />

        <Select
          mode="multiple"
          style={{ width: "100%" }}
          // placeholder="Status"
          onChange={(e) => handleStatus(e)}
          value={status}
          options={[
            { label: "Loose", value: "Loose" },
            { label: "Blister", value: "Blister" },
          ]}
        />
      </div>
      <div className="mb-2 flex flex-col">
        <Label className="max-sm:text-white" text="Escala" />
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          // placeholder="Escala"
          onChange={(e) => handleStatus(e)}
          value={status}
          options={[
            { label: "1/24", value: "1/24" },
            { label: "1/64", value: "1/64" },
          ]}
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
