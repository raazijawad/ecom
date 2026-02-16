const ADMIN_EMAIL = 'admin@gmail.com';
const ROLE_STORAGE_KEY = 'role';

export type UserRole = 'admin' | 'user';

export function resolveRoleFromEmail(email: string): UserRole {
    return email.trim().toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user';
}

/**
 * Sample login function:
 * assigns role based on email and stores it in localStorage.
 */
export function loginWithRole(email: string): UserRole {
    const role = resolveRoleFromEmail(email);
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    localStorage.setItem('isAuthenticated', 'true');

    return role;
}

export function logoutWithRole(): void {
    localStorage.removeItem(ROLE_STORAGE_KEY);
    localStorage.removeItem('isAuthenticated');
}

export function getStoredRole(): UserRole | null {
    const role = localStorage.getItem(ROLE_STORAGE_KEY);

    if (role === 'admin' || role === 'user') {
        return role;
    }

    return null;
}

export function isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
}

export { ADMIN_EMAIL, ROLE_STORAGE_KEY };
