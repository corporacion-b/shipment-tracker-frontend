export interface User {
  id_user: number;
  email: string;
  is_active: boolean;
  email_verified: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface RegisterResponse extends User {
  message: string;
}

export interface AuthMessage {
  message: string;
}
