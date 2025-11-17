import api from "./axios";

export const loginUser = async (username, password) => {
  const res = await api.post("users/login/", { username, password });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("users/me/");
  return res.data;
};
