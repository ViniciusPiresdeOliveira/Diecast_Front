import { GenericGetTypes } from "@/app/types";

export interface FilterProps {
  handleFilterMiniaturas: () => void;
  lists: FilterLists;
}

export interface FilterLists {
  marks: GenericGetTypes[];
  types: GenericGetTypes[];
  lines: GenericGetTypes[];
  conditions: GenericGetTypes[];
  scales: GenericGetTypes[];
}
