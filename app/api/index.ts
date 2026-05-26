import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL,
  withCredentials: true, // 👈 envia cookie automaticamente em TODAS requests
});

// 👉 REQUEST INTERCEPTOR (opcional)
api.interceptors.request.use(
  (config) => {
    // aqui você pode logar ou adicionar headers extras se quiser
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 👉 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 👇 se der 401 (não autenticado)
    if (error.response?.status === 401) {
      console.log("Não autenticado - redirecionando...");

      // limpa qualquer estado local (se quiser)
      // handleClearUser() ❌ não pode usar hook aqui direto

      // redireciona
      if (typeof window !== "undefined") {
        console.log("Não autenticado - redirecionando... 2");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
