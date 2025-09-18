/**
 * Check if user has the required role
 * @param userData User data from OIDC token
 * @param requiredRole The role to check for
 * @returns boolean indicating if user has the role
 */
export function hasRole(userData: any, requiredRole: string): boolean {
  if (!userData) {
    return false;
  }

  // Check different possible role claim locations
  // Keycloak typically puts roles in different places depending on configuration

  // Check resource_access for client-specific roles
  if (userData.resource_access && userData.resource_access['angular-blog-client']) {
    const clientRoles = userData.resource_access['angular-blog-client'].roles || [];
    if (clientRoles.includes(requiredRole)) {
      return true;
    }
  }

  // Check realm_access for realm roles
  if (userData.realm_access && userData.realm_access.roles) {
    const realmRoles = userData.realm_access.roles || [];
    if (realmRoles.includes(requiredRole)) {
      return true;
    }
  }

  // Check top-level roles claim (some configurations)
  if (userData.roles && Array.isArray(userData.roles)) {
    if (userData.roles.includes(requiredRole)) {
      return true;
    }
  }

  // Check groups (sometimes roles are mapped to groups)
  if (userData.groups && Array.isArray(userData.groups)) {
    if (userData.groups.includes(requiredRole) || userData.groups.includes(`/${requiredRole}`)) {
      return true;
    }
  }

  return false;
}

/**
 * Get all roles for the current user
 * @param userData User data from OIDC token
 * @returns Array of role names
 */
export function getUserRoles(userData: any): string[] {
  if (!userData) {
    return [];
  }

  const roles = new Set<string>();

  // Collect roles from all possible locations
  if (userData.resource_access && userData.resource_access['angular-blog-client']) {
    const clientRoles = userData.resource_access['angular-blog-client'].roles || [];
    clientRoles.forEach((role: string) => roles.add(role));
  }

  if (userData.realm_access && userData.realm_access.roles) {
    const realmRoles = userData.realm_access.roles || [];
    realmRoles.forEach((role: string) => roles.add(role));
  }

  if (userData.roles && Array.isArray(userData.roles)) {
    userData.roles.forEach((role: string) => roles.add(role));
  }

  return Array.from(roles);
}
