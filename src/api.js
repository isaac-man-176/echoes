import axios from "axios";

const API = axios.create({
  baseURL: "https://echoes-ed6b.onrender.com/", // your backend URL
});

export default API;
