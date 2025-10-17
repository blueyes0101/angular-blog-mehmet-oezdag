import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { LanguageService } from '../services/language.service';

/**
 * Language Guard
 * Validates language parameter in URL and redirects to valid language if invalid
 *
 * Usage in routes:
 * {
 *   path: ':lang',
 *   canActivate: [langGuard],
 *   children: [...]
 * }
 */
export const langGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const languageService = inject(LanguageService);
  const router = inject(Router);

  const lang = route.params['lang'];

  // If language is valid, set it and allow navigation
  if (languageService.isValidLanguage(lang)) {
    // Set language without navigating (we're already navigating)
    languageService.setLanguage(lang, false);
    return true;
  }

  // Language is invalid, redirect to default language with same path
  const defaultLang = languageService.defaultLanguage;
  const pathSegments = route.url.map((segment) => segment.path);

  // Build new path with default language
  const newPath = ['/', defaultLang, ...pathSegments].join('/');

  console.warn(`Invalid language "${lang}", redirecting to ${newPath}`);

  // Redirect to default language
  return router.parseUrl(newPath);
};

/**
 * Language Resolver
 * Alternative to guard - can be used to resolve language before component loads
 */
export const langResolver = (route: ActivatedRouteSnapshot) => {
  const languageService = inject(LanguageService);
  const lang = route.params['lang'];

  if (languageService.isValidLanguage(lang)) {
    languageService.setLanguage(lang, false);
    return lang;
  }

  return languageService.defaultLanguage;
};
