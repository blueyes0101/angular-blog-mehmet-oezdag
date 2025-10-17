import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Set initial HTML lang attribute from localStorage or browser
 * This ensures the correct language is set before Angular bootstraps
 */
if (typeof document !== 'undefined' && typeof localStorage !== 'undefined') {
  try {
    // Priority: localStorage > browser language > default (en)
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language?.split('-')[0];
    const validLanguages = ['en', 'de', 'tr'];

    let initialLang = 'en';

    if (storedLang && validLanguages.includes(storedLang)) {
      initialLang = storedLang;
    } else if (browserLang && validLanguages.includes(browserLang)) {
      initialLang = browserLang;
    }

    document.documentElement.lang = initialLang;
    document.documentElement.dir = 'ltr'; // Set to 'rtl' for right-to-left languages
  } catch (error) {
    console.warn('Failed to set initial language:', error);
    document.documentElement.lang = 'en';
  }
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
