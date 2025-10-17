import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, SupportedLanguage } from '../../../core/services/language.service';

/**
 * Language Switcher Component
 * Displays a dropdown to switch between available languages
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    TranslateModule,
  ],
  template: `
    <button
      mat-icon-button
      [matMenuTriggerFor]="languageMenu"
      [matTooltip]="'HEADER.SELECT_LANGUAGE' | translate"
      class="language-switcher-button"
      aria-label="Select Language"
    >
      <span class="language-flag">{{ languageService.getLanguageFlag(currentLanguage()) }}</span>
      <span class="language-code">{{ currentLanguage().toUpperCase() }}</span>
    </button>

    <mat-menu #languageMenu="matMenu" xPosition="before">
      @for (lang of availableLanguages; track lang.code) {
        <button
          mat-menu-item
          (click)="switchLanguage(lang.code)"
          [class.active]="lang.code === currentLanguage()"
        >
          <span class="language-flag">{{ lang.flag }}</span>
          <span class="language-name">{{ lang.nativeName }}</span>
          @if (lang.code === currentLanguage()) {
            <mat-icon class="check-icon">check</mat-icon>
          }
        </button>
      }
    </mat-menu>
  `,
  styles: [
    `
      .language-switcher-button {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0 8px;
        min-width: 60px;
      }

      .language-flag {
        font-size: 20px;
        line-height: 1;
      }

      .language-code {
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;
      }

      ::ng-deep .mat-mdc-menu-content {
        padding: 8px 0 !important;
      }

      button[mat-menu-item] {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        min-width: 200px;

        &.active {
          background-color: rgba(0, 0, 0, 0.04);
          font-weight: 500;
        }

        &:hover {
          background-color: rgba(0, 0, 0, 0.08);
        }
      }

      .language-name {
        flex: 1;
      }

      .check-icon {
        color: var(--mat-primary-color, #1976d2);
        margin-left: auto;
      }
    `,
  ],
})
export class LanguageSwitcherComponent {
  protected readonly languageService = inject(LanguageService);

  // Get current language signal
  readonly currentLanguage = this.languageService.currentLanguage;

  // Get available languages
  readonly availableLanguages = this.languageService.availableLanguages;

  /**
   * Switch to a different language
   */
  switchLanguage(lang: SupportedLanguage): void {
    this.languageService.setLanguage(lang, true);
  }
}
