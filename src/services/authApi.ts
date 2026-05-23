import { apiRequest } from "./apiClient";
import type { AuthMessage, LoginCredentials, RegisterPayload, RegisterResponse, TokenResponse, User } from "../types/auth";

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

export async function register(payload: RegisterPayload) {
  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyEmail(token: string) {
  return apiRequest<AuthMessage>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function resendVerification(email: string) {
  return apiRequest<AuthMessage>("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
