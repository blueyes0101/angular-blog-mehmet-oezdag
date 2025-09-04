import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBlogContainerComponent } from './components/add-blog-container/add-blog-container.component';

const routes: Routes = [
  {
    path: '',
    component: AddBlogContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddBlogRoutingModule {}
