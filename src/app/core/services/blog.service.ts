import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BlogPost {
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
    },
  ];

  constructor(private http: HttpClient) {}

  /**
   * Lädt alle Blog-Posts oder filtert nach Kategorie/Featured Status
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

    return this.http.get<BlogPost[]>(`${this.apiUrl}/posts`, { params });
  }

  /**
   * Lädt einen einzelnen Blog-Post nach ID
   */
  getPost(id: number): Observable<BlogPost> {
    if (environment.mockData) {
      const post = this.mockPosts.find((p) => p.id === id);
      return of(post || this.mockPosts[0]);
    }

    return this.http.get<BlogPost>(`${this.apiUrl}/posts/${id}`);
  }

  /**
   * Lädt alle verfügbaren Kategorien
   */
  getCategories(): Observable<string[]> {
    if (environment.mockData) {
      const categories = [...new Set(this.mockPosts.map((post) => post.category))];
      return of(categories);
    }

    return this.http.get<string[]>(`${this.apiUrl}/categories`);
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
