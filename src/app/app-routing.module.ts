import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { DropzoneComponent } from './dropzone/dropzone.component';

const routes: Routes = [
  {
    path: 'editor', component: EditorComponent, data: { title: 'CsvEditor' }
  },
  {
    path: 'dropzone', component: DropzoneComponent, data: { title: 'DropZone' }
  },
  {
    path: '**',
    redirectTo: '/editor',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
