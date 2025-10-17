import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

/**
 * Supported languages
 */
export type SupportedLanguage = 'en' | 'de' | 'tr';

/**
 * Language configuration
 */
export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

/**
 * Service for managing application language/locale
 * Handles language detection, switching, and persistence
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Available languages with their configurations
   */
  readonly availableLanguages: LanguageConfig[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      dir: 'ltr',
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      dir: 'ltr',
    },
    {
      code: 'tr',
      name: 'Turkish',
      nativeName: 'Türkçe',
      flag: '🇹🇷',
      dir: 'ltr',
    },
  ];

  /**
   * Default language
   */
  readonly defaultLanguage: SupportedLanguage = 'en';

  /**
   * LocalStorage key for storing selected language
   */
  private readonly STORAGE_KEY = 'preferredLanguage';

  /**
   * Current language signal
   */
  readonly currentLanguage = signal<SupportedLanguage>(this.defaultLanguage);

  /**
   * Current language configuration signal
   */
  readonly currentLanguageConfig = signal<LanguageConfig>(this.availableLanguages[0]);

  constructor() {
    this.initializeLanguage();
  }

  /**
   * Initialize language on app startup
   */
  private initializeLanguage(): void {
    // Set available languages
    this.translateService.addLangs(this.availableLanguages.map((lang) => lang.code));
    this.translateService.setDefaultLang(this.defaultLanguage);

    // Detect and set initial language
    const initialLang = this.detectLanguage();
    this.setLanguage(initialLang, false); // Don't navigate on initial load
  }

  /**
   * Detect the best language to use
   * Priority: URL > localStorage > Browser > Default
   */
  private detectLanguage(): SupportedLanguage {
    // 1. Check URL path for language prefix
    const urlLang = this.getLanguageFromUrl();
    if (urlLang && this.isValidLanguage(urlLang)) {
      return urlLang;
    }

    // 2. Check localStorage
    const storedLang = this.getStoredLanguage();
    if (storedLang && this.isValidLanguage(storedLang)) {
      return storedLang;
    }

    // 3. Check browser language
    const browserLang = this.getBrowserLanguage();
    if (browserLang && this.isValidLanguage(browserLang)) {
      return browserLang;
    }

    // 4. Fallback to default language
    return this.defaultLanguage;
  }

  /**
   * Get language from current URL
   */
  private getLanguageFromUrl(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const urlSegments = window.location.pathname.split('/').filter((s) => s);
    if (urlSegments.length > 0) {
      const firstSegment = urlSegments[0];
      if (this.isValidLanguage(firstSegment)) {
        return firstSegment;
      }
    }
    return null;
  }

  /**
   * Get stored language from localStorage
   */
  private getStoredLanguage(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  /**
   * Get browser's preferred language
   */
  private getBrowserLanguage(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang) {
      // Extract language code (e.g., 'en-US' -> 'en')
      const langCode = browserLang.split('-')[0].toLowerCase();
      return langCode;
    }
    return null;
  }

  /**
   * Check if a language code is valid
   */
  isValidLanguage(lang: string): lang is SupportedLanguage {
    return this.availableLanguages.some((l) => l.code === lang);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage();
  }

  /**
   * Get current language configuration
   */
  getCurrentLanguageConfig(): LanguageConfig {
    return this.currentLanguageConfig();
  }

  /**
   * Set/Change the application language
   * @param lang Language code to set
   * @param navigate Whether to navigate to the new language route
   */
  setLanguage(lang: SupportedLanguage, navigate = true): void {
    if (!this.isValidLanguage(lang)) {
      console.warn(`Invalid language: ${lang}, falling back to ${this.defaultLanguage}`);
      lang = this.defaultLanguage;
    }

    // Update translate service
    this.translateService.use(lang);

    // Update signals
    this.currentLanguage.set(lang);
    const langConfig = this.availableLanguages.find((l) => l.code === lang);
    if (langConfig) {
      this.currentLanguageConfig.set(langConfig);
    }

    // Store in localStorage
    this.storeLanguage(lang);

    // Update HTML lang attribute
    this.updateHtmlLangAttribute(lang);

    // Update document direction (for RTL languages)
    this.updateDocumentDirection(langConfig?.dir || 'ltr');

    // Navigate to language-specific route if requested
    if (navigate && isPlatformBrowser(this.platformId)) {
      this.navigateToLanguageRoute(lang);
    }
  }

  /**
   * Store language preference in localStorage
   */
  private storeLanguage(lang: SupportedLanguage): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, lang);
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
    }
  }

  /**
   * Update HTML lang attribute
   */
  private updateHtmlLangAttribute(lang: SupportedLanguage): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.documentElement.lang = lang;
  }

  /**
   * Update document direction (LTR/RTL)
   */
  private updateDocumentDirection(dir: 'ltr' | 'rtl'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.documentElement.dir = dir;
  }

  /**
   * Navigate to language-specific route
   */
  private navigateToLanguageRoute(lang: SupportedLanguage): void {
    const currentUrl = this.router.url;
    const urlSegments = currentUrl.split('/').filter((s) => s);

    // Remove existing language prefix if present
    if (urlSegments.length > 0 && this.isValidLanguage(urlSegments[0])) {
      urlSegments.shift();
    }

    // Add new language prefix
    const newPath = `/${lang}/${urlSegments.join('/')}`;

    // Navigate without adding to browser history
    this.router.navigateByUrl(newPath, { replaceUrl: true });
  }

  /**
   * Update page title with translation
   */
  updatePageTitle(translationKey: string, params?: any): void {
    this.translateService.get(translationKey, params).subscribe((translation: string) => {
      this.titleService.setTitle(translation);
    });
  }

  /**
   * Update meta description with translation
   */
  updateMetaDescription(translationKey: string, params?: any): void {
    this.translateService.get(translationKey, params).subscribe((translation: string) => {
      this.metaService.updateTag({ name: 'description', content: translation });
    });
  }

  /**
   * Update both title and description
   */
  updatePageMetadata(titleKey: string, descriptionKey: string, params?: any): void {
    this.updatePageTitle(titleKey, params);
    this.updateMetaDescription(descriptionKey, params);
  }

  /**
   * Get translation observable
   */
  getTranslation(key: string, params?: any) {
    return this.translateService.get(key, params);
  }

  /**
   * Get instant translation (synchronous)
   */
  getInstantTranslation(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }

  /**
   * Get language name by code
   */
  getLanguageName(code: SupportedLanguage): string {
    const lang = this.availableLanguages.find((l) => l.code === code);
    return lang?.name || code;
  }

  /**
   * Get language native name by code
   */
  getLanguageNativeName(code: SupportedLanguage): string {
    const lang = this.availableLanguages.find((l) => l.code === code);
    return lang?.nativeName || code;
  }

  /**
   * Get language flag emoji by code
   */
  getLanguageFlag(code: SupportedLanguage): string {
    const lang = this.availableLanguages.find((l) => l.code === code);
    return lang?.flag || '🌐';
  }
}
