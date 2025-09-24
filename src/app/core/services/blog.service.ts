import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  BlogPost,
  safeParseBlogPost,
  safeParseBlogPosts,
  CategoriesArrayValidator,
} from '../schemas/blog.schemas';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = environment.apiUrl;

  // Mock data for production deployment
  private mockPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Einführung in Angular 19',
      content:
        'Angular 19 bringt viele spannende neue Features mit sich, einschließlich der neuen Control Flow Syntax (@if, @for, @switch) und verbesserter Performance. In diesem Artikel erkunden wir die wichtigsten Neuerungen und wie sie die Entwicklung moderner Web-Anwendungen revolutionieren.',
      author: 'Mehmet Oezdag',
      publishDate: '2024-12-15',
      category: 'Angular',
      tags: ['Angular', 'TypeScript', 'Web Development'],
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      likedByMe: false,
      likes: 42,
    },
    {
      id: 2,
      title: 'Modern CSS Grid und Flexbox Techniken',
      content:
        'CSS Grid und Flexbox sind die modernen Layouttechniken für responsive Webdesign. Dieser Artikel zeigt praktische Beispiele und Best Practices für den Einsatz in realen Projekten.',
      author: 'Mehmet Oezdag',
      publishDate: '2024-12-10',
      category: 'CSS',
      tags: ['CSS', 'Grid', 'Flexbox', 'Responsive Design'],
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
      likedByMe: true,
      likes: 28,
    },
    {
      id: 3,
      title: 'TypeScript Best Practices 2024',
      content:
        'TypeScript hat sich als Standard für JavaScript-Entwicklung etabliert. Hier sind die wichtigsten Best Practices und Patterns für sauberen, typsicheren Code.',
      author: 'Mehmet Oezdag',
      publishDate: '2024-12-05',
      category: 'TypeScript',
      tags: ['TypeScript', 'JavaScript', 'Best Practices'],
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
      likedByMe: false,
      likes: 67,
    },
    {
      id: 4,
      title: 'Azure Static Web Apps Deployment',
      content:
        'Azure Static Web Apps bietet eine einfache und kostengünstige Möglichkeit, moderne Web-Anwendungen zu deployen. Dieser Guide zeigt den kompletten Deployment-Prozess.',
      author: 'Mehmet Oezdag',
      publishDate: '2024-12-01',
      category: 'Azure',
      tags: ['Azure', 'Deployment', 'Static Web Apps'],
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
      likedByMe: true,
      likes: 15,
    },
    {
      id: 5,
      title: 'Responsive Design mit Angular Material',
      content:
        'Angular Material bietet eine umfassende Sammlung von UI-Komponenten. Lernen Sie, wie Sie responsive und benutzerfreundliche Interfaces erstellen.',
      author: 'Mehmet Oezdag',
      publishDate: '2024-11-28',
      category: 'Angular',
      tags: ['Angular Material', 'UI/UX', 'Responsive Design'],
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=400&fit=crop',
      likedByMe: false,
      likes: 89,
    },
  ];

  constructor(private http: HttpClient) {}

  /**
   * Lädt alle Blog-Posts oder filtert nach Kategorie/Featured Status
   * Includes ZOD validation for data integrity
   */
  getPosts(category?: string, featured?: boolean): Observable<BlogPost[]> {
    if (environment.mockData) {
      return this.getMockPosts(category, featured);
    }

    let params = new HttpParams();

    if (category) {
      params = params.set('category', category);
    }

    if (featured !== undefined) {
      params = params.set('featured', featured.toString());
    }

    return this.http.get<unknown>(`${this.apiUrl}/posts`, { params }).pipe(
      map((response) => {
        const validationResult = safeParseBlogPosts(response);
        if (!validationResult.success) {
          console.error('Blog posts validation failed:', validationResult.error);
          throw new Error(`Invalid blog posts data: ${validationResult.error.message}`);
        }
        return validationResult.data;
      }),
      catchError((error) => {
        console.error('Error fetching blog posts:', error);
        return throwError(() => new Error(`Failed to fetch blog posts: ${error.message}`));
      }),
    );
  }

  /**
   * Lädt einen einzelnen Blog-Post nach ID
   * Includes ZOD validation for data integrity
   */
  getPost(id: number): Observable<BlogPost> {
    if (environment.mockData) {
      const post = this.mockPosts.find((p) => p.id === id);
      if (!post) {
        return throwError(() => new Error(`Blog post with ID ${id} not found`));
      }
      // Validate mock data as well
      const validationResult = safeParseBlogPost(post);
      if (!validationResult.success) {
        console.error('Mock blog post validation failed:', validationResult.error);
        return throwError(
          () => new Error(`Invalid mock blog post data: ${validationResult.error.message}`),
        );
      }
      return of(validationResult.data);
    }

    return this.http.get<unknown>(`${this.apiUrl}/posts/${id}`).pipe(
      map((response) => {
        const validationResult = safeParseBlogPost(response);
        if (!validationResult.success) {
          console.error('Blog post validation failed:', validationResult.error);
          throw new Error(`Invalid blog post data: ${validationResult.error.message}`);
        }
        return validationResult.data;
      }),
      catchError((error) => {
        console.error('Error fetching blog post:', error);
        return throwError(() => new Error(`Failed to fetch blog post: ${error.message}`));
      }),
    );
  }

  /**
   * Lädt alle verfügbaren Kategorien
   * Includes ZOD validation for data integrity
   */
  getCategories(): Observable<string[]> {
    if (environment.mockData) {
      const categories = [...new Set(this.mockPosts.map((post) => post.category))];
      // Validate categories array
      try {
        return of(CategoriesArrayValidator.parse(categories));
      } catch (error) {
        console.error('Mock categories validation failed:', error);
        return throwError(() => new Error(`Invalid mock categories data: ${error}`));
      }
    }

    return this.http.get<unknown>(`${this.apiUrl}/categories`).pipe(
      map((response) => {
        try {
          return CategoriesArrayValidator.parse(response);
        } catch (error) {
          console.error('Categories validation failed:', error);
          throw new Error(`Invalid categories data: ${error}`);
        }
      }),
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return throwError(() => new Error(`Failed to fetch categories: ${error.message}`));
      }),
    );
  }

  /**
   * Lädt nur Featured Posts
   */
  getFeaturedPosts(): Observable<BlogPost[]> {
    return this.getPosts(undefined, true);
  }

  /**
   * Lädt Posts nach Kategorie
   */
  getPostsByCategory(category: string): Observable<BlogPost[]> {
    return this.getPosts(category);
  }

  /**
   * Creates a new blog post
   */
  createBlog(blogData: Partial<BlogPost>): Observable<BlogPost> {
    if (environment.mockData) {
      // Create mock post
      const newPost: BlogPost = {
        id: Math.floor(Math.random() * 10000) + 100,
        title: blogData.title || '',
        content: blogData.content || '',
        author: blogData.author || 'Anonymous',
        publishDate: new Date().toISOString().split('T')[0],
        category: blogData.category || 'General',
        tags: blogData.tags || [],
        featured: blogData.featured || false,
        imageUrl:
          blogData.imageUrl ||
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        likedByMe: false,
        likes: 0,
      };

      // Add to mock posts
      this.mockPosts.unshift(newPost);
      return of(newPost);
    }

    return this.http.post<BlogPost>(`${this.apiUrl}/blogs`, blogData).pipe(
      map((response) => {
        const validationResult = safeParseBlogPost(response);
        if (!validationResult.success) {
          console.error('Created blog post validation failed:', validationResult.error);
          throw new Error(`Invalid created blog post data: ${validationResult.error.message}`);
        }
        return validationResult.data;
      }),
      catchError((error) => {
        console.error('Error creating blog post:', error);
        return throwError(() => new Error(`Failed to create blog post: ${error.message}`));
      }),
    );
  }

  /**
   * Checks if a blog title already exists
   */
  titleExists(title: string): Observable<{ exists: boolean }> {
    if (environment.mockData) {
      const exists = this.mockPosts.some(
        (post) => post.title.toLowerCase().trim() === title.toLowerCase().trim(),
      );
      return of({ exists });
    }

    const params = new HttpParams().set('title', title);
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/blogs/title-exists`, { params }).pipe(
      catchError((error) => {
        console.error('Error checking title existence:', error);
        return of({ exists: false });
      }),
    );
  }

  /**
   * Private method to handle mock data filtering
   */
  private getMockPosts(category?: string, featured?: boolean): Observable<BlogPost[]> {
    let filteredPosts = [...this.mockPosts];

    if (category) {
      filteredPosts = filteredPosts.filter((post) => post.category === category);
    }

    if (featured !== undefined) {
      filteredPosts = filteredPosts.filter((post) => post.featured === featured);
    }

    return of(filteredPosts);
  }
}
