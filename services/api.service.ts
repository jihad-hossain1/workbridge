const baseUrl =
  process.env.NEXT_PUBLIC_API_URL! || "http://localhost:3000/api/v1";

// TODO: add auth routes with protection some methods
export const auth_api = {
  login_post: () => `${baseUrl}/auth/login`,
  register_post: () => `${baseUrl}/auth/register`,
  forgot_password_post: () => `${baseUrl}/auth/forgot-password`,
};
