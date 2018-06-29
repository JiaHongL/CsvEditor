
import { Injectable } from '@angular/core';
import * as electron from 'electron';
import { Subject } from 'rxjs';
import { Res } from './interfaces';
import * as csv from 'csvtojson';
const Json2csvParser = require('json2csv').Parser;

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  fs = electron.remote.require('fs');
  file: {
    path: string
  };
  coverSubject$ = new Subject();


  constructor() {
    this.file = {
      path: ''
    };
  }

  getCoverSubject() {
    return this.coverSubject$.asObservable();
  }

  openCsv(path) {
    this.file.path = path;
    this.csv2json(this.file.path);
  }

  readCsv(path, type) {
    this.file.path = path;
    if (type.indexOf('csv') > -1) {
      this.csv2json(this.file.path);
    } else {
      let res: Res = {
        success: false,
        message: '別鬧了,這不是CSV檔案!'
      };
      this.coverSubject$.next(res);
    };
  }

  private csv2json(path) {
    let data = this.fs.readFileSync(path).toString();
    let CsvObj = {
      data: [],
      columns: []
    };

    let headerTemp = [];
    csv({ noheader: false })
      .fromString(data)
      .on('header', (header) => {
        headerTemp = header;
        CsvObj.columns = header.map((v) => { return { data: v } });
      })
      .then((jsonObj) => {
        CsvObj.data = jsonObj;
        let res: Res = {
          success: true,
          csv: CsvObj
        };
        let HeaderRow = {};
        headerTemp.forEach((v) => {
          HeaderRow[v] = v;
        });
        res.csv.data.unshift(HeaderRow);
        this.coverSubject$.next(res);
      })
  }

  exportCsv(data, columns, filePath?) {
    this.json2csv(data, columns, filePath);
  }

  private json2csv(data, columns, filePath?) {
    let path = filePath || this.file.path;
    let fields = [];
    let outputData = [];
    fields = columns.map((v) => { return v.data });
    outputData = data;
    outputData.shift();
    const json2csvParser = new Json2csvParser({ fields });
    const csv = json2csvParser.parse(outputData);
    this.fs.writeFile(path, '\ufeff' + csv, 'utf8', (err) => {
      if (err) {
        alert('發生錯誤');
      } else {
        alert('已存擋');
      };
    });
  }



}
