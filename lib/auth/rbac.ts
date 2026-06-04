import { Role } from "@prisma/client";

interface UserPayload {
  userId: string;
  role: Role;
}

export function canCreateProject(user: UserPayload | null | undefined): boolean {
  if (!user) return false;
  return user.role === Role.ADMIN || user.role === Role.PROJECT_MANAGER;
}

export function canEditProject(
  user: UserPayload | null | undefined,
  memberRoleInProject?: Role
): boolean {
  if (!user) return false;
  if (user.role === Role.ADMIN) return true;
  // If user is PROJECT_MANAGER or is designated as manager in this project
  return user.role === Role.PROJECT_MANAGER || memberRoleInProject === Role.ADMIN || memberRoleInProject === Role.PROJECT_MANAGER;
}

export function canDeleteProject(user: UserPayload | null | undefined): boolean {
  if (!user) return false;
  return user.role === Role.ADMIN;
}

export function canAssignTask(
  user: UserPayload | null | undefined,
  memberRoleInProject?: Role
): boolean {
  if (!user) return false;
  if (user.role === Role.ADMIN) return true;
  return user.role === Role.PROJECT_MANAGER || memberRoleInProject === Role.ADMIN || memberRoleInProject === Role.PROJECT_MANAGER;
}

export function canManageMembers(
  user: UserPayload | null | undefined,
  memberRoleInProject?: Role
): boolean {
  if (!user) return false;
  if (user.role === Role.ADMIN) return true;
  return user.role === Role.PROJECT_MANAGER || memberRoleInProject === Role.ADMIN || memberRoleInProject === Role.PROJECT_MANAGER;
}
