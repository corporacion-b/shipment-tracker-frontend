import { apiRequest } from "./apiClient";
import type { LoginCredentials, TokenResponse, User } from "../types/auth";

export async function login(credentials: LoginCredentials) {
  const body = new URLSearchParams();
  body.set("username", credentials.email);
  body.set("password", credentials.password);

  return apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    body,
  });
}

export async function getMe() {
  return apiRequest<User>("/auth/me");
}
