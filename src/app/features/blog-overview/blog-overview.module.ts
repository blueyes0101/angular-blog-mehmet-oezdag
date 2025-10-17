import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import { BlogOverviewRoutingModule } from './blog-overview-routing.module';
import { BlogOverviewContainerComponent } from './components/blog-overview-container/blog-overview-container.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { BlogFilterComponent } from './components/blog-filter/blog-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BlogOverviewRoutingModule,
    TranslateModule,

    // Components (if they are standalone)
    BlogOverviewContainerComponent,
    BlogListComponent,
    BlogCardComponent,
    BlogFilterComponent,

    // Angular Material
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
  ],
})
export class BlogOverviewModule {}
