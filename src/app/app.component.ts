import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';

import { DemoComponent } from './demo/demo.component';
import { BlogPost } from './core/schemas/blog.schemas';
import { RouterStateStore } from './core/state/router-state.store';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { LanguageService } from './core/services/language.service';
import { AuthStore } from './core/auth/auth.store';

interface TestResult {
  success: boolean;
  data?: BlogPost;
  error?: string;
  rawResponse?: string;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatDialogModule,
    MatTooltipModule,
    TranslateModule,
    DemoComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
/**
 * Root Application Component
 *
 * This component:
 * - Initializes authentication on app startup
 * - Manages dark mode theme
 * - Provides demo functionality for testing
 * - Integrates with AuthStore for authentication state
 */
export class AppComponent implements OnInit {
  title = 'Angular Blog - Mehmet Oezdag';

  // Inject services
  readonly routerState = inject(RouterStateStore);
  readonly languageService = inject(LanguageService);
  readonly authStore = inject(AuthStore);
  readonly isLoading = this.routerState.isLoading;

  // Authentication state from AuthStore (Signals)
  isAuthenticated = this.authStore.isAuthenticated;
  userData = this.authStore.userData;
  username = this.authStore.username;
  roles = this.authStore.roles;

  // UI State
  isDarkMode = false;
  showDemo = false;
  showSwaggerHelp = false;

  // Live Test State
  isTestLoading = false;
  testPost = {
    title: '',
    content: '',
    author: '',
    category: 'Test',
  };
  testResult: TestResult | null = null;

  // Swagger-UI Help Content
  swaggerExampleJson = `{
  "title": "Mein neuer Blog-Post",
  "content": "Das ist der Inhalt meines Posts...",
  "author": "Mehmet Oezdag",
  "category": "Angular",
  "tags": ["tutorial", "angular"],
  "featured": false
}`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDarkModePreference();
    this.initializeAuthentication();
  }

  /**
   * Initialize authentication on app startup
   * This checks if the user is already authenticated (from stored tokens)
   */
  private initializeAuthentication(): void {
    this.authStore.checkAuth().subscribe({
      next: (result) => {
        if (result.isAuthenticated) {
          console.log('[App] User authenticated on startup:', result.userData);
        } else {
          console.log('[App] User not authenticated');
        }
      },
      error: (error) => {
        console.error('[App] Authentication check failed:', error);
      },
    });
  }

  /**
   * Trigger login flow
   */
  login(): void {
    this.authStore.login();
  }

  /**
   * Trigger logout flow
   */
  logout(): void {
    this.authStore.logout();
  }

  /**
   * Lädt die Dark Mode Einstellung aus dem localStorage
   */
  private loadDarkModePreference(): void {
    const darkModePreference = localStorage.getItem('darkMode');
    this.isDarkMode = darkModePreference === 'true';
    this.applyDarkMode();
  }

  /**
   * Toggles Dark Mode
   */
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyDarkMode();
  }

  /**
   * Wendet Dark Mode auf das Dokument an
   */
  private applyDarkMode(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  /**
   * Toggles Swagger-UI Help Popup
   */
  toggleSwaggerHelp(): void {
    this.showSwaggerHelp = !this.showSwaggerHelp;
  }

  /**
   * Schließt das Swagger-UI Help Popup
   */
  closeSwaggerHelp(): void {
    this.showSwaggerHelp = false;
  }

  /**
   * Sendet einen Live-Test POST Request
   */
  sendLiveTestPost(): void {
    if (!this.testPost.title || !this.testPost.content) {
      return;
    }

    this.isTestLoading = true;
    this.testResult = null;

    const postData = {
      title: this.testPost.title,
      content: this.testPost.content,
      author: this.testPost.author || 'Test User',
      category: this.testPost.category,
      tags: ['live-test', 'api-demo'],
      featured: false,
    };

    this.http
      .post<BlogPost>('http://localhost:3000/api/posts', postData)
      .pipe(finalize(() => (this.isTestLoading = false)))
      .subscribe({
        next: (response) => {
          this.testResult = {
            success: true,
            data: response,
            rawResponse: JSON.stringify(response, null, 2),
          };

          // Trigger refresh to show the new post
          // Refresh trigger removed - using modular components now
        },
        error: (error) => {
          this.testResult = {
            success: false,
            error: error.error?.error || error.message || 'Unbekannter Fehler',
            rawResponse: JSON.stringify(error, null, 2),
          };
        },
      });
  }

  /**
   * Setzt das Test-Formular zurück
   */
  resetTestForm(): void {
    this.testPost = {
      title: '',
      content: '',
      author: '',
      category: 'Test',
    };
    this.testResult = null;
  }

  /**
   * Toggled Demo-Anzeige
   */
  toggleDemo(): void {
    this.showDemo = !this.showDemo;
  }

  /**
   * Gibt die Angular Version zurück
   */
  getAngularVersion(): string {
    return '19';
  }
}
