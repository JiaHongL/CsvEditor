import { Component } from '@angular/core';
import { CsvService } from '../csv.service';

import * as electron from 'electron';
const { ipcRenderer } = require('electron');

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent {
  mainWindowId: number;
  constructor(private CsvService: CsvService) {
    ipcRenderer.on('main-win-id-message', (event, message) => {
      this.mainWindowId = message;
    });
  }

  readCsv(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    let message = {
      path: evt.dataTransfer.files[0].path,
      type: evt.dataTransfer.files[0].type
    };
    ipcRenderer.sendTo(this.mainWindowId, 'dropzone-csv-message', message);
  }

  dragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'link';
  }

}
