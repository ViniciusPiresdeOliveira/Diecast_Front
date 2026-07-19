import api from "..";
import { PostLinksAffiliate } from "./types";

export const getAllLinksAffiliate = () => {
  return api.get("/link-afiliado");
};

export const deleteLinksAffiliateById = (id: number) => {
  return api.delete(`/link-afiliado/${id}`);
};

export const postLinksAffiliate = (link: PostLinksAffiliate) => {
  return api.post("/link-afiliado", link);
};
