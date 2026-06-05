const baseUrl =
  process.env.NEXT_PUBLIC_API_URL! || "http://localhost:3000/api/v1";

export const auth_api = {
  login_post: () => `${baseUrl}/auth/login`,
  register_post: () => `${baseUrl}/auth/register`,
  forgot_password_post: () => `${baseUrl}/auth/forgot-password`,
};

export const project_api = {
  list_get: (q: string) => `${baseUrl}/projects?${q}`,
  new_post: () => `${baseUrl}/projects`,
  update_put: () => `${baseUrl}/projects`,
};
