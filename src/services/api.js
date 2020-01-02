import httpClient from "./http-client";

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

export const getMe = async () => {
  try {
    return await httpClient.get("/users/me");
  } catch (err) {
    console.log(err.message);
  }
};

export const updateMe = async (data) => {
  try {
    return await httpClient.put("/users/me", data);
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

export const calculate = async data => {
  try {
    return await httpClient.post("/calculate", data);
  } catch (err) {
    console.log(err.message);
  }
};
