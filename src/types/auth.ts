export interface UserRegistrationRequest {
  name: string;
  nrp: string;
  email: string;
  password: string;
  enrollment_year: number;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  token: string;
  role: string;
}

export interface UserResponse {
  id: string;
  nrp: string;
  name: string;
  email: string;
  enrollment_year: number;
  role: string;
  is_verified: boolean;
}

export interface UserUpdateRequest {
  name?: string;
  nrp?: string;
  enrollment_year?: number;
}

export interface SendVerificationEmailRequest {
  email: string;
}

export interface VerifyEmailResponse {
  email: string;
  is_verified: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
}
