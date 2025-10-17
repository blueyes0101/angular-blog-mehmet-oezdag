import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-blog-filter',
  templateUrl: './blog-filter.component.html',
  styleUrls: ['./blog-filter.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
  ],
})
export class BlogFilterComponent {
  @Input() categories: string[] = [];
  @Input() selectedCategory: string | null = '';
  @Input() showOnlyFeatured: boolean | null = false;
  @Input() isLoading = false;

  @Output() categoryChanged = new EventEmitter<string>();
  @Output() featuredToggled = new EventEmitter<void>();
  @Output() filtersReset = new EventEmitter<void>();
  @Output() refreshRequested = new EventEmitter<void>();

  onCategoryChange(event: { value: string }): void {
    this.categoryChanged.emit(event.value);
  }

  onToggleFeatured(): void {
    this.featuredToggled.emit();
  }

  onResetFilters(): void {
    this.filtersReset.emit();
  }

  onRefresh(): void {
    this.refreshRequested.emit();
  }
}
