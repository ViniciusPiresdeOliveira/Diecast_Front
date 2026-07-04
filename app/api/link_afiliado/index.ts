import { GenericPostTypes } from "@/app/types";
import api from "..";

export const getAllLinksAffiliate = () => {
  return api.get("/link-afiliado");
};

export const deleteLinksAffiliateById = (id: number) => {
  return api.delete(`/link-afiliado/${id}`);
};

export const postLinksAffiliate = (line: GenericPostTypes) => {
  return api.post("/link-afiliado", line);
};
