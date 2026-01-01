export type Role = "ADMIN" | "AGENT" | "USER";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  email: string;
  roles: Role[];
};
