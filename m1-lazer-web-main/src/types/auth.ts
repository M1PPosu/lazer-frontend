export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiError {
  error: string;
  error_description: string;
  hint: string;
  message: string;
}

export interface RegistrationError {
  form_error: {
    user: {
      username?: string[];
      user_email?: string[];
      password?: string[];
    };
    message?: string;
  };
}
