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
  update_put: (id: string) => `${baseUrl}/projects/${id}`,
  delete_delete: (id: string) => `${baseUrl}/projects/${id}`,
  view_get: (id: string) => `${baseUrl}/projects/${id}`,
  members_get: (id: string) => `${baseUrl}/projects/${id}/members`,
  members_post: (id: string) => `${baseUrl}/projects/${id}/members`,
  member_delete: (id: string, userId: string) =>
    `${baseUrl}/projects/${id}/members?userId=${userId}`,
};

export const user_api = {
  list_get: (query: string = "") => `${baseUrl}/users?${query}`,
  update_role_patch: () => `${baseUrl}/users`,
};

export const task_api = {
  list_get: (query: string) => `${baseUrl}/tasks?${query}`,
  create_post: () => `${baseUrl}/tasks`,
  detail_get: (id: string) => `${baseUrl}/tasks/${id}`,
  update_put: (id: string) => `${baseUrl}/tasks/${id}`,
  delete_delete: (id: string) => `${baseUrl}/tasks/${id}`,
  comments_get: (taskId: string) => `${baseUrl}/tasks/${taskId}/comments`,
  comments_post: (taskId: string) => `${baseUrl}/tasks/${taskId}/comments`,
  attachments_get: (taskId: string) => `${baseUrl}/tasks/${taskId}/attachments`,
  attachments_post: (taskId: string) =>
    `${baseUrl}/tasks/${taskId}/attachments`,
};
