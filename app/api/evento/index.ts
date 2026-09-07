import api from "..";

export const getAllEvents = () => {
  return api.get("/eventos");
};

export const deleteEventById = (id: number) => {
  return api.delete(`/eventos/${id}`);
};

export const postEvent = (event: FormData) => {
  return api.post("/eventos", event, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const putEvent = (id: number, event: FormData) => {
  return api.put(`/eventos/${id}`, event, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
