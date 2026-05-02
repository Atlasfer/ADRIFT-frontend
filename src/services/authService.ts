// src/services/authService.ts
import apiClient from "@/lib/api/client";
import type {
  UserRegistrationRequest,
  UserLoginRequest,
  UserLoginResponse,
  UserResponse,
  UserUpdateRequest,
  SendVerificationEmailRequest,
  VerifyEmailResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth";

// POST /api/auth
export async function registerUser(data: UserRegistrationRequest): Promise<UserResponse> {
  const res = await apiClient.post("/api/auth", data);
  return res.data.data;
}

// POST /api/auth/login
export async function loginUser(data: UserLoginRequest): Promise<UserLoginResponse> {
  const res = await apiClient.post("/api/auth/login", data);
  return res.data.data;
}

// POST /api/auth/send-verification-email
export async function sendVerificationEmail(data: SendVerificationEmailRequest): Promise<void> {
  await apiClient.post("/api/auth/send-verification-email", data);
}

// GET /api/auth/verify-email?token=...
export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  const res = await apiClient.get("/api/auth/verify-email", { params: { token } });
  return res.data.data;
}

// POST /api/auth/forgot-password
export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  await apiClient.post("/api/auth/forgot-password", data);
}

// POST /api/auth/reset-password?token=...
export async function resetPassword(token: string, data: ResetPasswordRequest): Promise<void> {
  await apiClient.post("/api/auth/reset-password", data, { params: { token } });
}

// GET /api/auth/me
export async function getMe(): Promise<UserResponse> {
  const res = await apiClient.get("/api/auth/me");
  return res.data.data;
}

// PATCH /api/auth/update
export async function updateUser(data: UserUpdateRequest): Promise<UserResponse> {
  const res = await apiClient.patch("/api/auth/update", data);
  return res.data.data;
}
