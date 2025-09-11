import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="unauthorized-container">
      <mat-card class="unauthorized-card">
        <mat-card-content>
          <mat-icon class="error-icon">lock</mat-icon>
          <h1>Unauthorized Access</h1>
          <p>You don't have permission to access this page.</p>
          <p class="hint">Please contact your administrator if you believe this is an error.</p>
          <div class="actions">
            <button mat-raised-button color="primary" routerLink="/blog">
              Go to Home
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 2rem;
    }

    .unauthorized-card {
      max-width: 500px;
      text-align: center;
    }

    .error-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #f44336;
      margin: 0 auto 1rem;
    }

    h1 {
      margin: 0 0 1rem;
      color: #f44336;
    }

    p {
      margin: 0 0 0.5rem;
      color: rgba(0, 0, 0, 0.7);
    }

    .hint {
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.5);
      margin-bottom: 2rem;
    }

    .actions {
      margin-top: 2rem;
    }
  `]
})
export class UnauthorizedComponent {}
