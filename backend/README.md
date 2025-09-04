# Angular Blog Backend

Backend-API für die Angular Blog Anwendung von Mehmet Oezdag.

## Features

- **CORS-Konfiguration** für Angular Frontend
- **RESTful API** für Blog-Posts
- **Kategorie-Filter** und **Featured-Posts**
- **Mock-Daten** für Entwicklung und Tests

## Installation

1. **Dependencies installieren:**

   ```bash
   cd backend
   npm install
   ```

2. **Server starten:**

   ```bash
   npm start
   ```

   Für Entwicklung mit Auto-Reload:

   ```bash
   npm run dev
   ```

3. **Server läuft auf:** `http://localhost:3000`

## API Endpoints

### GET /api/posts

Lädt alle Blog-Posts oder gefilterte Posts.

**Query Parameters:**

- `category` (optional): Filtert nach Kategorie
- `featured` (optional): Filtert Featured Posts (`true`/`false`)

**Beispiele:**

```bash
GET /api/posts                    # Alle Posts
GET /api/posts?category=Angular   # Nur Angular Posts
GET /api/posts?featured=true      # Nur Featured Posts
```

### GET /api/posts/:id

Lädt einen einzelnen Blog-Post nach ID.

**Beispiel:**

```bash
GET /api/posts/1
```

### GET /api/categories

Lädt alle verfügbaren Kategorien.

**Beispiel:**

```bash
GET /api/categories
```

## CORS-Konfiguration

Das Backend ist konfiguriert für:

- **Entwicklung:** `http://localhost:4200`
- **Produktion:** `https://witty-hill-01df38b03.6.azurestaticapps.net`

## Blog-Post Structure

```typescript
interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  featured: boolean;
  imageUrl: string;
}
```

## Entwicklung

Das Backend verwendet:

- **Express.js** für den Server
- **CORS** für Cross-Origin Requests
- **Nodemon** für Entwicklung mit Auto-Reload

## Verwendung mit Angular Frontend

1. Backend starten: `npm start` (Port 3000)
2. Angular Frontend starten: `ng serve` (Port 4200)
3. Die Angular App ruft automatisch die Backend-APIs auf

## Mock-Daten

Das Backend enthält 5 vorgefertigte Blog-Posts zu Themen wie:

- Angular Control Flow
- SCSS Best Practices
- Flexbox Layout
- TypeScript Tipps
- Angular Material
