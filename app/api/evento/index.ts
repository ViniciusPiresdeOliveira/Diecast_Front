import api from "..";

export const getAllEvents = () => {
  return api.get("/eventos");
};

export const deleteEventById = (id: number) => {
  return api.delete(`/eventos/${id}`);
};

export const postEvent = (event: any) => {
  return api.post("/eventos", event, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
