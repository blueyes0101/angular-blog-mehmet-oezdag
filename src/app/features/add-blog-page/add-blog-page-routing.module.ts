import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBlogPageComponent } from './components/add-blog-page/add-blog-page.component';
import { isAuthenticatedGuard } from '../../core/guards/is-authenticated.guard';

const routes: Routes = [
  {
    path: '',
    component: AddBlogPageComponent,
    canActivate: [isAuthenticatedGuard],
    data: { role: 'user' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBlogPageRoutingModule { }
