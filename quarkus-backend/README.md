# Angular Blog Quarkus Backend

**Supersonic Subatomic Java** Backend für die Angular Blog Anwendung von Mehmet Oezdag.

## 🚀 Features

- **Ultra-fast Startup** - Quarkus startet in Millisekunden
- **Low Memory Footprint** - Optimiert für Container und Cloud
- **Native Compilation** - GraalVM Native Images Support
- **Live Reload** - Hot-Reload während der Entwicklung
- **OpenAPI/Swagger** - Automatische API-Dokumentation
- **Health Checks** - Built-in Monitoring
- **CORS-Konfiguration** für Angular Frontend

## 📋 Voraussetzungen

- **Java 17+** (OpenJDK empfohlen)
- **Maven 3.8+**
- **Optional:** GraalVM für Native Builds

## 🛠️ Installation & Start

### 1. Dependencies installieren

```bash
cd quarkus-backend
./mvnw compile
```

### 2. Development Mode starten

```bash
./mvnw quarkus:dev
```

### 3. Produktions-Build

```bash
./mvnw package
java -jar target/quarkus-app/quarkus-run.jar
```

### 4. Native Build (Optional)

```bash
./mvnw package -Pnative
./target/angular-blog-backend-1.0.0-runner
```

## 🌐 API Endpoints

Das Backend läuft standardmäßig auf **Port 3000** und bietet folgende Endpoints:

### Blog Posts

- `GET /api/posts` - Alle Posts oder gefilterte Posts
  - Query Parameter: `?category=Angular&featured=true`
- `GET /api/posts/{id}` - Einzelner Post nach ID
- `GET /api/posts/featured` - Nur Featured Posts
- `GET /api/posts/category/{category}` - Posts nach Kategorie

### Kategorien & Statistiken

- `GET /api/categories` - Alle verfügbaren Kategorien
- `GET /api/stats` - Blog-Statistiken

### System Endpoints

- `GET /health` - Health Check
- `GET /swagger-ui` - API-Dokumentation
- `GET /q/openapi` - OpenAPI Specification

## 🔧 Konfiguration

### CORS für Angular Frontend

```properties
quarkus.http.cors=true
quarkus.http.cors.origins=http://localhost:4200,https://witty-hill-01df38b03.6.azurestaticapps.net
```

### Port-Konfiguration

```properties
quarkus.http.port=3000
```

### Development vs Production

```properties
# Development
%dev.quarkus.log.console.level=DEBUG

# Production
%prod.quarkus.log.console.level=INFO
```

## 🧪 Tests ausführen

```bash
# Unit Tests
./mvnw test

# Integration Tests
./mvnw verify
```

## 📊 Performance Vorteile

| Metrik           | Express.js | Quarkus JVM | Quarkus Native |
| ---------------- | ---------- | ----------- | -------------- |
| **Startup Zeit** | ~500ms     | ~800ms      | ~20ms          |
| **Memory**       | ~50MB      | ~80MB       | ~15MB          |
| **Throughput**   | Good       | Excellent   | Excellent      |
| **Cloud-Ready**  | ✅         | ✅          | ⭐             |

## 🐳 Docker Support

### Dockerfile für JVM

```dockerfile
FROM registry.access.redhat.com/ubi8/openjdk-17:1.14
COPY target/quarkus-app/ /deployments/
EXPOSE 3000
USER 185
ENTRYPOINT ["java", "-jar", "/deployments/quarkus-run.jar"]
```

### Native Docker Build

```bash
./mvnw package -Pnative -Dquarkus.native.container-build=true
docker build -f src/main/docker/Dockerfile.native -t quarkus/angular-blog-backend .
```

## 🔍 Monitoring & Debugging

### Health Checks

- **Liveness:** `GET /q/health/live`
- **Readiness:** `GET /q/health/ready`
- **Overall:** `GET /q/health`

### Metrics (mit Micrometer)

- **Metrics:** `GET /q/metrics`

### Development Tools

- **Dev UI:** `http://localhost:3000/q/dev/`
- **Live Reload:** Automatisch bei Code-Änderungen

## 🔗 Integration mit Angular

### BlogService API-Calls

```typescript
// Angular Service bleibt unverändert
private apiUrl = 'http://localhost:3000/api';
```

Das Quarkus Backend ist vollständig kompatibel mit dem bestehenden Angular Frontend.

## 📚 Blog-Post Datenstruktur

```json
{
  "id": 1,
  "title": "Angular Control Flow - Die Revolution der Templates",
  "content": "...",
  "author": "Mehmet Oezdag",
  "publishDate": "2024-01-15",
  "category": "Angular",
  "tags": ["Angular", "Control Flow", "Templates"],
  "featured": true,
  "imageUrl": "https://picsum.photos/400/250?random=1"
}
```

## 🚀 Quarkus-spezifische Features

### CDI (Contexts and Dependency Injection)

```java
@ApplicationScoped
public class BlogService {
    // Automatische Dependency Injection
}
```

### Configuration Properties

```java
@ConfigProperty(name = "blog.featured.limit", defaultValue = "5")
int featuredLimit;
```

### REST Client für externe APIs

```java
@RegisterRestClient
public interface ExternalBlogClient {
    @GET
    List<BlogPost> getPosts();
}
```

## ⚡ Warum Quarkus?

1. **Container-First** - Optimiert für Kubernetes und Docker
2. **Developer Joy** - Live Reload, vereinfachte Konfiguration
3. **Standards-based** - JAX-RS, CDI, MicroProfile
4. **Cloud-native** - 12-Factor App Principles
5. **Performance** - Bis zu 10x schnellere Startzeit
6. **Memory Efficiency** - Bis zu 70% weniger Memory Usage

## 🔄 Migration von Express.js

✅ **Vorteile der Migration:**

- Bessere Performance und Skalierbarkeit
- Type Safety durch Java/TypeScript
- Enterprise-Features out-of-the-box
- Container- und Cloud-optimiert
- Bessere Tooling und IDE-Support

## 📞 Support

- **Quarkus Docs:** https://quarkus.io/guides/
- **Autor:** Mehmet Oezdag
- **Institution:** HFTM

---

_Powered by Quarkus - The Supersonic Subatomic Java Framework_
