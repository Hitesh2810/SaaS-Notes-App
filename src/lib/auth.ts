export interface User {
  email: string;
  role: 'admin' | 'member';
  tenant: 'acme' | 'globex';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Hardcoded user accounts
const USERS: Record<string, User> = {
  'admin@acme.test': { email: 'admin@acme.test', role: 'admin', tenant: 'acme' },
  'user@acme.test': { email: 'user@acme.test', role: 'member', tenant: 'acme' },
  'admin@globex.test': { email: 'admin@globex.test', role: 'admin', tenant: 'globex' },
  'user@globex.test': { email: 'user@globex.test', role: 'member', tenant: 'globex' },
};

const AUTH_STORAGE_KEY = 'saas-notes-auth';

export class AuthService {
  static login(email: string, password: string): User | null {
    // Simple password check (all passwords are "password")
    if (password !== 'password') return null;
    
    const user = USERS[email];
    if (!user) return null;

    // Store auth state in localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  static logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  static getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}