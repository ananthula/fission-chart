import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-root',
  template: `
  <div>
  <input type="file" name="File Upload"  (change)="fileChangeListener($event)" accept=".csv" />
  </div>
    <kendo-chart #fileImportInput id="txtFileUpload">
      <kendo-chart-title></kendo-chart-title>
      
       <kendo-chart-category-axis>
          <kendo-chart-category-axis-item
              [categories]="categories"
              [title]="{ text: 'Years' }">
          </kendo-chart-category-axis-item>
      </kendo-chart-category-axis>
      <kendo-chart-legend position="bottom" orientation="horizontal"></kendo-chart-legend>
      <kendo-chart-tooltip format="{0}"></kendo-chart-tooltip>
      <kendo-chart-series>
        <kendo-chart-series-item type="line" [data]="data1" xField="year" yField="value" [name]="series1">
        </kendo-chart-series-item>
        <kendo-chart-series-item type="line" [data]="data2" xField="year" yField="value" [name]="series2">
        </kendo-chart-series-item>
        <kendo-chart-series-item type="line" [data]="data3" xField="year" yField="value" [name]="series3">
        </kendo-chart-series-item>
        <kendo-chart-series-item type="line" [data]="data4" xField="year" yField="value" [name]="series4">
        </kendo-chart-series-item>
      </kendo-chart-series>
    </kendo-chart>
  `
})
export class AppComponent {
  title = 'fission-chart';

  public csvRecords: any[] = [];
  public csvData: any[] = [];
  public categories : any[] = [];
  public data1 : any[] = [];
  public data2 : any[] = [];
  public data3 : any[] = [];
  public data4 : any[] = [];
  public items : any[] = [];

  @ViewChild('fileImportInput') fileImportInput: any;


  fileChangeListener($event: any): void {

    var text = [];
    var files = $event.srcElement.files;

    if (this.isCSVFile(files[0])) {

      var input = $event.target;
      var reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = (data) => {
        let csvData = reader.result;
        //console.log(csvData.toString());
        //this.csvRecords = csvData.toString().split(',');
        let records = csvData.toString().split('\n');
        
        var line = [];
        records.forEach(record => {
          if(record!=""){
          var series = record.split(',')[0].toString();
          this.items[series] = [];
          record.split(',').slice(1).forEach(pipedRecord => {
            var splitPipedRecord = pipedRecord.split('|');
            this.items[series].push({year:splitPipedRecord[0],value:splitPipedRecord[1]});
            //this.items[series][splitPipedRecord[0].toString()] = splitPipedRecord[1];
          });
        }
        });
        
        var keys =  Object.keys(this.items);
        

        keys.forEach(key => {
          
            console.log(this.items[key]);
          
          
        });
        // let cats = [];
        // let data1 = [];
        // records.forEach(record => {
        //   cats.push(record.split('|')[0]);
        //   data1.push(record.split('|')[1]);
        // });
        // this.categories = cats;
        // this.data1 = data1;
        this.data1 = this.items['SERIES1'];
        this.data2 = this.items['SERIES2'];
        this.data3 = this.items['SERIES3'];
        this.data4 = this.items['SERIES4'];
        //console.log(this.categories);

        //let headersRow = this.getHeaderArray(csvRecordsArray);

        //this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      }

      reader.onerror = function() {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    var dataArr = []

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = csvRecordsArray[i].split(',');

      // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
      // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
      if (data.length == headerLength) {

        var csvRecord: CSVRecord = new CSVRecord();

        csvRecord.firstName = data[0].trim();
        csvRecord.lastName = data[1].trim();
        csvRecord.email = data[2].trim();
        csvRecord.phoneNumber = data[3].trim();
        csvRecord.title = data[4].trim();
        csvRecord.occupation = data[5].trim();

        dataArr.push(csvRecord);
      }
    }
    return dataArr;
  }

  // CHECK IF FILE IS A VALID CSV FILE
  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  // GET CSV FILE HEADER COLUMNS
  getHeaderArray(csvRecordsArr: any) {
    let headers = csvRecordsArr[0].split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }

}

export class CSVRecord{

  public firstName: any;
  public lastName: any;
  public email: any;
  public phoneNumber: any;
  public title: any;
  public occupation: any;

  constructor()
  {

  }
}
