
import { Component, ChangeDetectorRef, NgZone, ViewChild, ElementRef } from '@angular/core';
import { CsvService } from 'src/app/csv.service';
import { Res } from '../interfaces';

import * as electron from 'electron';
const { ipcRenderer } = require('electron');

import * as Handsontable from 'handsontable';
import 'handsontable/languages/zh-TW';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  settingsObj: Handsontable.GridSettings = {
    rowHeaders: true,
    colHeaders: true,
    contextMenu: true,
    language: 'zh-TW',
    manualRowMove: true,
    manualColumnMove: true,
    manualColumnResize: true,
    manualRowResize: true,
    stretchH: 'all',
  };
  data: Array<any> = [];
  columns: Array<any> = [];


  constructor(private cdr: ChangeDetectorRef, private CsvService: CsvService) {

    this.CsvService.getCoverSubject().subscribe((res: Res) => {
      if (res.success) {
        this.data = res.csv.data;
        this.columns = res.csv.columns;
        this.cdr.detectChanges();
      } else {
        alert(res.message);
      };
    }, (error: Res) => {
      alert(error.message);
    }, () => {
      console.log('complete');
    });

    ipcRenderer.on('dropzone-csv-message', (event, message) => {
      this.CsvService.readCsv(message.path, message.type);
    });

  }


  openCsv() {
    electron.remote.dialog.showOpenDialog(
      {
        filters: [
          { name: 'CSV', extensions: ['csv'] }
        ],
        properties: ['openFile']
      }, (arry) => {
        let filesPath = arry[0];
        this.CsvService.openCsv(filesPath);
      });
  }

  openDropZoneWin() {
    let WindowId = electron.remote.getCurrentWindow().id;
    ipcRenderer.send('create-dropzone-win-message', WindowId);
  }

  saveFile() {
    if (this.data.length > 0) {
      this.CsvService.exportCsv(this.data, this.columns);
    };
  }

  saveFileAs() {
    if (this.data.length > 0) {
      electron.remote.dialog.showSaveDialog({
        title: '另存新檔',
        filters: [
          { name: 'CSV', extensions: ['csv'] }
        ]
      },
        (filename) => {
          if (filename) { this.CsvService.exportCsv(this.data, this.columns, filename) }
        });

    };
  }

  quit() {
    ipcRenderer.send('quit-message', 'closeWin');
  }

}
