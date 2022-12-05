import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://3.6.38.16:8000/",
  headers: { Authorization: window.localStorage.getItem("Authorization") },
});
