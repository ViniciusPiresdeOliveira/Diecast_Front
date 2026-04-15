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

  return (
    <>
      {/* <div className="mb-2 flex flex-col">
        <Label className="max-sm:text-white" text="Minis por página" />
        <Select
          value={amount}
          onChange={handleAmount}
          placeholder="Selecione"
          className="w-full"
          options={[
            { value: 10, label: "10" },
            { value: 20, label: "20" },
            { value: 30, label: "30" },
            { value: 40, label: "40" },
            { value: 50, label: "50" },
            { value: 100, label: "100" },
          ]}
        />
      </div> */}
      <div className="mb-2 flex flex-col">
        <Label className="max-sm:text-white" text="Nome" />
        <Input
          placeholder={prefixExample + "Ferrari"}
          value={name}
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
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          type="number"
          value={minPrice ?? undefined}
          onChange={(value) => handleMinPrice(value)}
        />
      </div>

      <div className="mb-0 flex flex-col">
        <Label className="max-sm:text-white" text="Preço máximo" />
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          type="number"
          value={maxPrice ?? undefined}
          onChange={(value) => handleMaxPrice(value)}
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
