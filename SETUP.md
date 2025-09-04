# Setup-Dokumentation - Angular Blog Projekt

## Übersicht

Diese Dokumentation beschreibt den vollständigen Setup-Prozess für das Angular Blog Projekt, das im Rahmen der Iteration 0 der agilen Entwicklung erstellt wurde.

## Inhaltsverzeichnis

1. [Projekt-Initialisierung](#projekt-initialisierung)
2. [Code-Qualitätstools](#code-qualitätstools)
3. [Git-Hooks](#git-hooks)
4. [CI/CD-Pipeline](#cicd-pipeline)
5. [Azure Deployment](#azure-deployment)
6. [Sicherheit](#sicherheit)

## Projekt-Initialisierung

### 1. Angular-Projekt erstellen

```bash
# Angular CLI installieren (falls nicht vorhanden)
npm install -g @angular/cli

# Neues Projekt mit SCSS erstellen
ng new angu-blog-mehmet-oezdag --style=scss --routing=true --strict=true

# In das Projektverzeichnis wechseln
cd angu-blog-mehmet-oezdag

# Branch auf 'main' umbenennen
git branch -m main
```

### 2. GitHub Repository

1. Erstellen Sie ein neues Repository auf GitHub: https://github.com/hftm-in2023/angular-blog-mehmet-oezdag
2. Verbinden Sie das lokale Repository:

```bash
git remote add origin https://github.com/hftm-in2023/angular-blog-mehmet-oezdag.git
git push -u origin main
```

## Code-Qualitätstools

### 1. ESLint

ESLint wurde automatisch mit Angular hinzugefügt:

```bash
ng add @angular-eslint/schematics
```

Die Konfiguration befindet sich in `eslint.config.js` und enthält:

- TypeScript-spezifische Regeln
- Angular-Best-Practices
- Prettier-Integration

### 2. Prettier

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

Konfigurationsdateien:

- `.prettierrc.json`: Formatting-Regeln
- `.prettierignore`: Ausgeschlossene Dateien

### 3. CommitLint

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

Die Konfiguration in `commitlint.config.js` erzwingt Conventional Commits.

## Git-Hooks

### Husky und lint-staged

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Hooks:

- **pre-commit**: Führt ESLint und Prettier auf staged files aus
- **commit-msg**: Validiert Commit-Messages mit CommitLint

Konfiguration in `.lintstagedrc.json`.

## CI/CD-Pipeline

### GitHub Actions Workflows

1. **azure-deploy.yml**: Automatisches Deployment auf Azure

   - Trigger: Push auf main branch
   - Steps: Build, Test, Deploy

2. **ci-cd.yml**: Umfassende CI/CD-Pipeline
   - Matrix-Build mit Node.js 18 und 20
   - Automatische Sicherheitsprüfungen
   - Scheduled dependency updates

### Pipeline-Features

- **Automatische Tests**: Unit-Tests mit Karma und Jasmine
- **Code Coverage**: Integration mit Codecov
- **Sicherheitsprüfungen**: npm audit und Dependency Check
- **Automatische Updates**: Wöchentliche Überprüfung und Update von Dependencies

## Azure Deployment

### Voraussetzungen

1. Azure Static Web Apps Ressource erstellen
2. API Token generieren
3. GitHub Secret hinzufügen: `AZURE_STATIC_WEB_APPS_API_TOKEN`

### Konfiguration

Die Datei `staticwebapp.config.json` enthält:

- Routing-Regeln für Angular SPA
- Sicherheitsheader
- MIME-Type-Mappings

### Deployment-Prozess

1. Code wird auf main branch gepusht
2. GitHub Actions Pipeline startet
3. Build und Tests werden ausgeführt
4. Bei Erfolg: Automatisches Deployment auf Azure

## Sicherheit

### Implementierte Sicherheitsmaßnahmen

1. **Dependency Scanning**

   - npm audit bei jedem Build
   - OWASP Dependency Check
   - Automatische Security Updates

2. **Security Headers**

   - Content Security Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - Referrer Policy
   - Permissions Policy

3. **Code-Qualität**
   - Strict TypeScript Konfiguration
   - ESLint Security Rules
   - Automatische Code-Reviews durch Linting

## Verfügbare NPM Scripts

```bash
# Entwicklung
npm start           # Startet den Dev-Server
npm run build       # Production Build
npm test            # Unit Tests

# Code-Qualität
npm run lint        # ESLint ausführen
npm run lint:fix    # ESLint mit Auto-Fix
npm run format      # Prettier formatierung
npm run format:check # Formatting überprüfen
```

## Troubleshooting

### Häufige Probleme

1. **Husky Hooks funktionieren nicht**

   ```bash
   npx husky install
   chmod +x .husky/pre-commit
   chmod +x .husky/commit-msg
   ```

2. **ESLint Fehler**

   ```bash
   npm run lint:fix
   ```

3. **Azure Deployment schlägt fehl**
   - Überprüfen Sie das API Token
   - Kontrollieren Sie die Build-Ausgabe in GitHub Actions

## Wartung

### Regelmäßige Aufgaben

1. **Wöchentlich**: Dependencies werden automatisch überprüft
2. **Monatlich**: Security Audit durchführen
3. **Quartal**: Major Updates manuell prüfen

### Update-Prozess

```bash
# Angular CLI und Core aktualisieren
ng update @angular/cli @angular/core

# Alle Dependencies aktualisieren
npm update

# Security Fixes
npm audit fix
```

## Kontakt

Bei Fragen oder Problemen:

- **Autor**: Mehmet Oezdag
- **Institution**: HFTM
- **Repository**: https://github.com/hftm-in2023/angular-blog-mehmet-oezdag
