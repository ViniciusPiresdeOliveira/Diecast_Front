import { Label } from "@/app/components/Label";
import { useFilter } from "@/app/hooks/useFilter";
import { prefixExample } from "@/app/utils";
import { Button, Divider, Input, InputNumber, Select } from "antd";
import { Option } from "antd/es/mentions";
import { FilterProps } from "./types";

export const Filter = ({ handleFilterMiniaturas }: FilterProps) => {
  const {
    maxPrice,
    amount,
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
    handleAmount,
    handleType,
    handleLine,
  } = useFilter();

  return (
    <>
      <div className="mb-4 flex flex-col">
        <Label className="max-sm:text-white" text="Minis por página" />
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
        <Label className="max-sm:text-white" text="Nome" />
        <Input
          placeholder={prefixExample + "Ferrari"}
          value={name}
          onChange={(e) => handleName(e.target.value)}
        />
      </div>
      <div className="mb-4 flex flex-col">
        <Label className="max-sm:text-white" text="Marcas" />
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          onChange={(e) => handleMark(e)}
          value={mark}
        >
          <Option value="Hot Wheels">Hot Wheels</Option>
          <Option value="matchbox">Matchbox</Option>
          <Option value="gtmini">GT Mini</Option>
        </Select>
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
        <Label className="max-sm:text-white" text="Tipos" />
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          // placeholder="Tipos"
          onChange={(e) => handleType(e)}
          value={type}
        >
          <Option value="jdm">JDM</Option>
          <Option value="supercar">Supercar</Option>
          <Option value="muscle">Muscle</Option>
          <Option value="classic">Clássico</Option>
        </Select>
      </div>
      <div className="mb-4 flex flex-col">
        <Label className="max-sm:text-white" text="Linhas" />
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          // placeholder="Tipos"
          onChange={(e) => handleLine(e)}
          value={line}
        >
          <Option value="thunt">T-Hunt</Option>
          <Option value="superthunt">Super T-Hunt</Option>
          <Option value="mainline">Mainline</Option>
        </Select>
      </div>
      <div className="mb-4 flex flex-col">
        <Label text="Status" />

        <Select
          mode="multiple"
          style={{ width: "100%" }}
          // placeholder="Status"
          onChange={(e) => handleStatus(e)}
          value={status}
        >
          <Option value="Loose">Loose</Option>
          <Option value="Blister">Blister</Option>
        </Select>
      </div>
      <div className="mb-4 flex flex-col">
        <Label text="Escala" />
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          // placeholder="Escala"
          onChange={(e) => handleStatus(e)}
          value={status}
        >
          <Option value="thunt">1/24</Option>
          <Option value="superthunt">1/64</Option>
        </Select>
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

      <Button type="primary" block onClick={handleFilterMiniaturas}>
        Filtrar
      </Button>
      <Button className="mt-2" type="link" block onClick={clearFilters}>
        Limpar filtros
      </Button>
    </>
  );
};
