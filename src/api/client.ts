import axios from "axios";
import { setAuthToken } from "@/utils/supabase-sdk";
const Client = axios.create({
  // baseURL: import.meta.env.VITE_API_URL
  baseURL: "http://localhost:4000"
});
console.log("🚀 Client.ts carregado");
const storedToken = localStorage.getItem("auth-token");
console.log(
  "🔍 Token ao carregar client.ts:",
  storedToken ? "EXISTE" : "NÃO EXISTE",
);

if (storedToken) {
  Client.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  setAuthToken(storedToken); 
}

export function setGlobalAuthToken(token: string) {
  localStorage.setItem("auth-token", token);
  Client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  setAuthToken(token);
}

export function clearGlobalAuthToken() {
  localStorage.removeItem("auth-token");
  delete Client.defaults.headers.common["Authorization"];
  setAuthToken("");
}

export default Client;
