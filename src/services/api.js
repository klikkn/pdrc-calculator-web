import httpClient from "./http-client";

export const me = async () => {
  try {
    return await httpClient.get("/users/me");
  } catch (err) {
    console.log(err.message);
  }
};

export const login = async (data) => {
  try {
    return await httpClient.post("/auth/local", data);
  } catch (err) {
    console.log(err.message);
  }
};

export const register = async (data) => {
  try {
    return await httpClient.post("/auth/local/register", data);
  } catch (err) {
    console.log(err.message);
  }
};

export const getParams = async () => {
  try {
    return await httpClient.get("/params");
  } catch (err) {
    console.log(err.message);
  }
};

export const updateParams = async data => {
  try {
    return await httpClient.put(`/params`, data);
  } catch (err) {
    console.log(err.message);
  }
};

export const getParts = async () => {
  try {
    return await httpClient.get("/parts");
  } catch (err) {
    console.log(err.message);
  }
};

export const calculate = async data => {
  try {
    return await httpClient.post("/calculate", data);
  } catch (err) {
    console.log(err.message);
  }
};
