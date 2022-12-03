import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://some-domain.com/",
  headers: { Authorization: window.localStorage.getItem("access_token") },
});
