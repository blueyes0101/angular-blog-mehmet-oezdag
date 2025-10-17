import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BlogPost } from '../../../../core/schemas/blog.schemas';
import { BlogDetailViewComponent } from '../blog-detail-view/blog-detail-view.component';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-blog-detail-container',
  templateUrl: './blog-detail-container.component.html',
  styleUrls: ['./blog-detail-container.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    BlogDetailViewComponent,
  ],
})
export class BlogDetailContainerComponent implements OnInit {
  blogPost$: Observable<BlogPost | null> = of(null);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);

  ngOnInit(): void {
    // Get the resolved blog post from the route data
    this.blogPost$ = this.route.data.pipe(map((data) => data['blogPost']));
  }

  /**
   * Navigate back to blog overview
   */
  onBackToBlog(): void {
    const currentLang = this.languageService.currentLanguage();
    this.router.navigate([`/${currentLang}/blog`]);
  }

  /**
   * Share blog post (placeholder implementation)
   */
  onShare(): void {
    // Placeholder for share functionality
    console.warn('Share functionality would be implemented here');
  }

  /**
   * Bookmark blog post (placeholder implementation)
   */
  onBookmark(): void {
    // Placeholder for bookmark functionality
    console.warn('Bookmark functionality would be implemented here');
  }
}
