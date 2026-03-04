import axios from "axios";
import { setAuthToken } from "@/utils/supabase-sdk";
import { logInfo } from "@/utils/logger";

const Client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

logInfo("API Client initialized");

const storedToken = localStorage.getItem("auth-token");
logInfo("Auth token status", { hasToken: !!storedToken });

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
