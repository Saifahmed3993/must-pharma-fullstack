import axios from "axios";
import type { AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5010/api",
});

// إضافة التوكن لأي طلب طالع بشكل آلي
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string, params?: any) => axiosInstance.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axiosInstance.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axiosInstance.put(url, body).then(responseBody),
  delete: (url: string) => axiosInstance.delete(url).then(responseBody),
};

const Products = {
  list: (params?: any) => requests.get("/products", params),
  details: (id: number) => requests.get(`/products/${id}`),
  brands: () => requests.get("/products/brands"),
  types: () => requests.get("/products/types"),
  bundles: () => requests.get("/products/bundles"),
  create: (formData: FormData) => axiosInstance.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" }
  }).then(responseBody),
  delete: (id: number) => requests.delete(`/products/${id}`),
};

const Basket = {
  get: (id: string) => requests.get(`/basket?id=${id}`),
  set: (basket: any) => requests.post("/basket", basket),
  delete: (id: string) => requests.delete(`/basket?id=${id}`),
};

const Account = {
  login: (values: any) => requests.post("/Account/login", values),
  register: (values: any) => requests.post("/Account/register", values),
  getAddress: () => requests.get("/Account/address"),
  updateAddress: (address: any) => requests.put("/Account/address", address),
  update: (formData: FormData) => axiosInstance.put("/Account/update", formData, {
      headers: { "Content-Type": "multipart/form-data" }
  }).then(responseBody),
};

const Orders = {
  create: (order: any) => requests.post("/orders", order),
  list: () => requests.get("/orders"),
  listAll: () => requests.get("/orders/all-orders"),
  details: (id: number) => requests.get(`/orders/${id}`),
  deliveryMethods: () => requests.get("/orders/deliveryMethods"),
  updateStatus: (id: number, status: string) => requests.put(`/orders/${id}/status`, { status }),
};

const Metadata = {
  addBrand: (name: string) => requests.post("/metadata/brands", { name }),
  deleteBrand: (id: number) => requests.delete(`/metadata/brands/${id}`),
  addType: (name: string) => requests.post("/metadata/types", { name }),
  deleteType: (id: number) => requests.delete(`/metadata/types/${id}`),
};

const agent = {
  Products,
  Basket,
  Account,
  Orders,
  Metadata,
  // Fallback for simple direct calls
  get: requests.get,
  post: requests.post,
  put: requests.put,
  delete: requests.delete,
};

export default agent;
