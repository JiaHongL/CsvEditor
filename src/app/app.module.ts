import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HotTableModule } from '@handsontable/angular';

import { CsvService } from 'src/app/csv.service';

import { EditorComponent } from './editor/editor.component';
import { DropzoneComponent } from './dropzone/dropzone.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    DropzoneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HotTableModule.forRoot()
  ],
  providers: [CsvService],
  bootstrap: [AppComponent]
})
export class AppModule { }
