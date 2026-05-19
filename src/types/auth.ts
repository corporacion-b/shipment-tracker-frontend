export interface User {
  id_user: number;
  email: string;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
}

export interface LoginCredentials {
  email: string;
  password: string;
}
