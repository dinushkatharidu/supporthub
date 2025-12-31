import { http } from "./http";
import type { AuthResponse, LoginRequest } from "../types/auth";

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const res = await http.post<AuthResponse>("/api/auth/login", payload);
  return res.data;
}

export async function register(payload: LoginRequest): Promise<AuthResponse> {
  const res = await http.post<AuthResponse>("/api/auth/register", payload);
  return res.data;
}
