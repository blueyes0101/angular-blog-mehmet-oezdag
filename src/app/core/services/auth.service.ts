import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'author' | 'reader';
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Private state signals
  private readonly currentUser = signal<User | null>(null);
  private readonly authToken = signal<string | null>(null);

  // Public computed signals
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly user = computed(() => this.currentUser());
  readonly userRole = computed(() => this.currentUser()?.role || null);
  readonly isAdmin = computed(() => this.userRole() === 'admin');
  readonly isAuthor = computed(() => this.userRole() === 'author' || this.userRole() === 'admin');

  constructor(private router: Router) {
    // Check for saved session on initialization
    this.checkSavedSession();
  }

  /**
   * Login with credentials
   */
  login(credentials: LoginCredentials): Observable<User> {
    // Simulate API call
    return of(this.mockLogin(credentials)).pipe(
      delay(1000),
      tap(user => {
        if (user) {
          this.setUser(user);
          this.setToken(this.generateMockToken());
          this.saveSession();
        }
      })
    );
  }

  /**
   * Register a new user
   */
  register(data: RegisterData): Observable<User> {
    // Simulate API call
    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 100,
      email: data.email,
      name: data.name,
      role: 'reader',
    };

    return of(newUser).pipe(
      delay(1000),
      tap(user => {
        this.setUser(user);
        this.setToken(this.generateMockToken());
        this.saveSession();
      })
    );
  }

  /**
   * Logout the current user
   */
  logout(): void {
    this.currentUser.set(null);
    this.authToken.set(null);
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /**
   * Get the current auth token
   */
  getToken(): string | null {
    return this.authToken();
  }

  /**
   * Check if user has required role
   */
  hasRole(requiredRole: 'admin' | 'author' | 'reader'): boolean {
    const userRole = this.userRole();
    if (!userRole) return false;

    const roleHierarchy = {
      admin: 3,
      author: 2,
      reader: 1,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): Observable<User> {
    const currentUser = this.currentUser();
    if (!currentUser) {
      return throwError(() => new Error('No user logged in'));
    }

    const updatedUser = { ...currentUser, ...updates };
    return of(updatedUser).pipe(
      delay(500),
      tap(user => {
        this.setUser(user);
        this.saveSession();
      })
    );
  }

  // Private methods
  private setUser(user: User | null): void {
    this.currentUser.set(user);
  }

  private setToken(token: string | null): void {
    this.authToken.set(token);
  }

  private mockLogin(credentials: LoginCredentials): User | null {
    // Mock users for demo
    const mockUsers: Record<string, User> = {
      'admin@example.com': {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      },
      'author@example.com': {
        id: 2,
        email: 'author@example.com',
        name: 'Author User',
        role: 'author',
      },
      'reader@example.com': {
        id: 3,
        email: 'reader@example.com',
        name: 'Reader User',
        role: 'reader',
      },
    };

    // Simple password check (in real app, this would be server-side)
    if (credentials.password === 'password') {
      return mockUsers[credentials.email] || null;
    }

    return null;
  }

  private generateMockToken(): string {
    return 'mock-jwt-token-' + Math.random().toString(36).substr(2);
  }

  private saveSession(): void {
    const user = this.currentUser();
    const token = this.authToken();

    if (user && token) {
      localStorage.setItem('blog_user', JSON.stringify(user));
      localStorage.setItem('blog_token', token);
    }
  }

  private clearSession(): void {
    localStorage.removeItem('blog_user');
    localStorage.removeItem('blog_token');
  }

  private checkSavedSession(): void {
    const savedUser = localStorage.getItem('blog_user');
    const savedToken = localStorage.getItem('blog_token');

    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser) as User;
        this.setUser(user);
        this.setToken(savedToken);
      } catch (error) {
        console.error('Error loading saved session:', error);
        this.clearSession();
      }
    }
  }
}
