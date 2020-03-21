import httpClient from "@/services/http-client";

export const status = async () =>
  await httpClient.get("/", null, { timeout: 60000 });
export const login = async data => await httpClient.post("/auth/local", data);
export const register = async data =>
  await httpClient.post("/auth/local/register", data);
export const getMe = async () => await httpClient.get("/users/me");
export const updateMe = async data => await httpClient.put("/users/me", data);
export const getParams = async () => await httpClient.get("/params");
export const calculate = async data =>
  await httpClient.post("/calculate", data);
export const getOrders = async () => await httpClient.get("/orders");
export const getOrder = async id => await httpClient.get(`/orders/${id}`);
export const createOrder = async data => await httpClient.post("/orders", data);
export const deleteOrder = async id => await httpClient.delete(`/orders/${id}`);
