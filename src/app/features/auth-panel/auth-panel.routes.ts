import { Routes } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-panel',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  template: `
    <div class="auth-panel-container">
      <mat-card class="auth-panel">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>account_box</mat-icon>
            Account
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <ng-container *ngIf="auth.isAuthenticated$ | async as loggedIn; else needLogin">
            <div *ngIf="loggedIn && (auth.userData$ | async) as u" class="user-details">
              <div class="user-info">
                <mat-icon class="user-avatar">account_circle</mat-icon>
                <div class="user-text">
                  <h3>{{ auth.usernameFrom(u.userData) }}</h3>
                  <p class="user-email">{{ u.userData?.email || 'No email available' }}</p>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="user-roles">
                <h4>Roles</h4>
                <div class="roles-list">
                  <ng-container *ngFor="let role of getAllRoles(u.userData)">
                    <span class="role-chip">{{ role }}</span>
                  </ng-container>
                  <span *ngIf="getAllRoles(u.userData).length === 0" class="no-roles"
                    >No roles assigned</span
                  >
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="actions">
                <h4>Quick Actions</h4>
                <div class="action-buttons">
                  <button
                    mat-raised-button
                    color="primary"
                    routerLink="/add-blog-page"
                    *ngIf="auth.hasRole(u.userData, 'user')"
                  >
                    <mat-icon>add</mat-icon>
                    Create Blog Post
                  </button>
                  <button mat-raised-button routerLink="/blog">
                    <mat-icon>article</mat-icon>
                    View All Posts
                  </button>
                  <button mat-raised-button color="warn" (click)="auth.logout().subscribe()">
                    <mat-icon>logout</mat-icon>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </ng-container>

          <ng-template #needLogin>
            <div class="login-prompt">
              <mat-icon class="login-icon">lock</mat-icon>
              <h3>You are not logged in</h3>
              <p>
                Please log in with your Keycloak account to access your profile and manage blog
                posts.
              </p>
              <button mat-raised-button color="primary" (click)="auth.login()">
                <mat-icon>login</mat-icon>
                Login with Keycloak
              </button>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .auth-panel-container {
        display: flex;
        justify-content: center;
        padding: 2rem;
        min-height: calc(100vh - 200px);
      }

      .auth-panel {
        max-width: 600px;
        width: 100%;
      }

      .user-details {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .user-avatar {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #666;
      }

      .user-text h3 {
        margin: 0;
        font-size: 1.5rem;
      }

      .user-text .user-email {
        margin: 0.25rem 0 0 0;
        color: #666;
        font-size: 0.9rem;
      }

      .user-roles h4,
      .actions h4 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .roles-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .role-chip {
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.25rem 0.75rem;
        border-radius: 16px;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .no-roles {
        color: #666;
        font-style: italic;
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .action-buttons button {
        justify-content: flex-start;
      }

      .login-prompt {
        text-align: center;
        padding: 2rem;
      }

      .login-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        color: #666;
        margin-bottom: 1rem;
      }

      .login-prompt h3 {
        margin: 1rem 0;
        color: #333;
      }

      .login-prompt p {
        margin-bottom: 2rem;
        color: #666;
        line-height: 1.5;
      }
    `,
  ],
})
export class AuthPanelComponent {
  auth = inject(AuthService);

  getAllRoles(userData: any): string[] {
    const realm = userData?.realm_access?.roles ?? [];
    const resRoles = Object.values(userData?.resource_access ?? {}).flatMap(
      (r: any) => r?.roles ?? [],
    );
    return [...realm, ...resRoles].filter(
      (role) => role !== 'default-roles-master' && role !== 'offline_access',
    );
  }
}

export const AUTH_ROUTES: Routes = [{ path: '', component: AuthPanelComponent }];
