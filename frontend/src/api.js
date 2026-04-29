import axios from "axios";

export const api = axios.create({
  baseURL: "https://ajaia-assessment-mt8s.onrender.com",
});