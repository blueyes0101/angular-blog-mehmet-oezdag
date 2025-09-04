const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const PORT = 3000;

// CORS-Konfiguration für Angular Frontend
app.use(
  cors({
    origin: ['http://localhost:4200', 'https://witty-hill-01df38b03.6.azurestaticapps.net'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

// Swagger-Konfiguration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Angular Blog API',
      version: '1.0.0',
      description: 'REST API für Angular Blog - Mehmet Oezdag',
      contact: {
        name: 'Mehmet Oezdag',
        email: 'mehmet.oezdag@hftm.ch',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production Server',
      },
    ],
    components: {
      schemas: {
        BlogPost: {
          type: 'object',
          required: ['id', 'title', 'content', 'author', 'publishDate', 'category'],
          properties: {
            id: {
              type: 'integer',
              description: 'Eindeutige Post-ID',
              example: 1,
            },
            title: {
              type: 'string',
              description: 'Titel des Blog-Posts',
              example: 'Angular Control Flow - Die Revolution der Templates',
            },
            content: {
              type: 'string',
              description: 'Vollständiger Inhalt des Posts',
              example: 'Angular 17 führt eine neue Control Flow Syntax ein...',
            },
            author: {
              type: 'string',
              description: 'Autor des Posts',
              example: 'Mehmet Oezdag',
            },
            publishDate: {
              type: 'string',
              format: 'date',
              description: 'Veröffentlichungsdatum (YYYY-MM-DD)',
              example: '2024-01-15',
            },
            category: {
              type: 'string',
              description: 'Kategorie des Posts',
              example: 'Angular',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Tags für den Post',
              example: ['Angular', 'Control Flow', 'Templates'],
            },
            featured: {
              type: 'boolean',
              description: 'Ob der Post als Featured markiert ist',
              example: true,
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL des Titelbilds',
              example: 'https://picsum.photos/400/250?random=1',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Fehlermeldung',
              example: 'Post not found',
            },
          },
        },
      },
    },
  },
  apis: ['./server.js'], // Pfad zu den API-Dateien
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger-UI Route
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Angular Blog API Documentation',
  }),
);

// Root-Route mit API-Info
app.get('/', (req, res) => {
  res.json({
    message: 'Angular Blog API - Mehmet Oezdag',
    version: '1.0.0',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      posts: `http://localhost:${PORT}/api/posts`,
      categories: `http://localhost:${PORT}/api/categories`,
    },
  });
});

// Mock Blog-Daten
const blogPosts = [
  {
    id: 1,
    title: 'Angular Control Flow - Die Revolution der Templates',
    content:
      'Angular 17 führt eine neue Control Flow Syntax ein, die Templates lesbarer und performanter macht. Mit @if, @for und @switch wird die Template-Syntax deutlich vereinfacht.',
    author: 'Mehmet Oezdag',
    publishDate: '2024-01-15',
    category: 'Angular',
    tags: ['Angular', 'Control Flow', 'Templates'],
    featured: true,
    imageUrl: 'https://picsum.photos/400/250?random=1',
  },
  {
    id: 2,
    title: 'SCSS Best Practices für moderne Web-Entwicklung',
    content:
      'SCSS bietet mächtige Features für die Stylesheet-Entwicklung. Von Variablen über Mixins bis hin zu verschachtelten Regeln - hier sind die wichtigsten Best Practices.',
    author: 'Mehmet Oezdag',
    publishDate: '2024-01-10',
    category: 'CSS',
    tags: ['SCSS', 'CSS', 'Styling'],
    featured: false,
    imageUrl: 'https://picsum.photos/400/250?random=2',
  },
  {
    id: 3,
    title: 'Flexbox Layout Patterns für responsive Design',
    content:
      'Flexbox ist ein mächtiges Layout-Tool für moderne Webseiten. Diese Anleitung zeigt praktische Patterns für responsive und flexible Layouts.',
    author: 'Mehmet Oezdag',
    publishDate: '2024-01-05',
    category: 'CSS',
    tags: ['Flexbox', 'Responsive', 'Layout'],
    featured: true,
    imageUrl: 'https://picsum.photos/400/250?random=3',
  },
  {
    id: 4,
    title: 'TypeScript Tipps für Angular Entwickler',
    content:
      'TypeScript macht Angular-Entwicklung sicherer und produktiver. Hier sind fortgeschrittene TypeScript-Techniken speziell für Angular-Projekte.',
    author: 'Mehmet Oezdag',
    publishDate: '2023-12-28',
    category: 'TypeScript',
    tags: ['TypeScript', 'Angular', 'Development'],
    featured: false,
    imageUrl: 'https://picsum.photos/400/250?random=4',
  },
  {
    id: 5,
    title: 'Angular Material - UI Components richtig einsetzen',
    content:
      'Angular Material bietet eine umfangreiche Komponentenbibliothek. Diese Anleitung zeigt, wie Sie Material Design effektiv in Ihren Angular-Apps nutzen.',
    author: 'Mehmet Oezdag',
    publishDate: '2023-12-20',
    category: 'Angular',
    tags: ['Angular Material', 'UI', 'Components'],
    featured: false,
    imageUrl: 'https://picsum.photos/400/250?random=5',
  },
];

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Alle Blog-Posts oder gefilterte Posts abrufen
 *     description: Lädt alle Blog-Posts oder filtert nach Kategorie und/oder Featured Status
 *     tags: [Blog Posts]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtert Posts nach Kategorie
 *         example: Angular
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filtert nur Featured Posts
 *         example: true
 *     responses:
 *       200:
 *         description: Liste der Blog-Posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BlogPost'
 *       500:
 *         description: Serverfehler
 */
app.get('/api/posts', (req, res) => {
  const { category, featured } = req.query;

  let filteredPosts = blogPosts;

  if (category) {
    filteredPosts = filteredPosts.filter(
      (post) => post.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (featured !== undefined) {
    filteredPosts = filteredPosts.filter((post) => post.featured === (featured === 'true'));
  }

  res.json(filteredPosts);
});

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Einzelnen Blog-Post nach ID abrufen
 *     description: Lädt einen spezifischen Blog-Post anhand seiner ID
 *     tags: [Blog Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Eindeutige Post-ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Blog-Post gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Post nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/posts/:id', (req, res) => {
  const post = blogPosts.find((p) => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Neuen Blog-Post erstellen
 *     description: Erstellt einen neuen Blog-Post mit den übermittelten Daten
 *     tags: [Blog Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, author, category]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titel des neuen Posts
 *                 example: "Mein neuer Blog-Post"
 *               content:
 *                 type: string
 *                 description: Inhalt des Posts
 *                 example: "Das ist der Inhalt meines Posts..."
 *               author:
 *                 type: string
 *                 description: Autor des Posts
 *                 example: "Mehmet Oezdag"
 *               category:
 *                 type: string
 *                 description: Kategorie des Posts
 *                 example: "Angular"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags für den Post
 *                 example: ["tutorial", "angular"]
 *               featured:
 *                 type: boolean
 *                 description: Ob der Post als Featured markiert werden soll
 *                 example: false
 *     responses:
 *       201:
 *         description: Blog-Post erfolgreich erstellt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Ungültige Eingabedaten
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/posts', (req, res) => {
  const { title, content, author, category, tags, featured } = req.body;

  // Validierung der Pflichtfelder
  if (!title || !content || !author || !category) {
    return res.status(400).json({
      error: 'Pflichtfelder fehlen: title, content, author, category sind erforderlich',
    });
  }

  // Neue Post-ID generieren
  const newId = Math.max(...blogPosts.map((p) => p.id)) + 1;

  // Neuen Post erstellen
  const newPost = {
    id: newId,
    title,
    content,
    author,
    publishDate: new Date().toISOString().split('T')[0], // Aktuelles Datum
    category,
    tags: tags || [],
    featured: featured || false,
    imageUrl: `https://picsum.photos/400/250?random=${newId}`,
  };

  // Post zum Array hinzufügen
  blogPosts.push(newPost);

  // Erstellten Post zurückgeben
  res.status(201).json(newPost);
});

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Alle verfügbaren Kategorien abrufen
 *     description: Lädt alle eindeutigen Kategorien der Blog-Posts
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Liste der Kategorien
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Angular", "CSS", "TypeScript"]
 */
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(blogPosts.map((post) => post.category))];
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Server läuft auf http://localhost:${PORT}`);
  console.log(`📊 Swagger-UI verfügbar unter: http://localhost:${PORT}/api-docs`);
  console.log(`📡 API verfügbar unter:`);
  console.log(`   - GET /api/posts - Alle Blog-Posts`);
  console.log(`   - GET /api/posts/:id - Einzelner Post`);
  console.log(`   - GET /api/categories - Verfügbare Kategorien`);
  console.log(`📝 API-Dokumentation: http://localhost:${PORT}/api-docs`);
});
