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
      <kendo-chart-series-item *ngFor="let series of finalMap1;" type = "line" [data]="series">
      </kendo-chart-series-item>
      </kendo-chart-series>
    </kendo-chart>
  `
})
export class AppComponent {
  title = 'fission-chart';

  public years : any[] = [];
  public items : any[] = [];
  public categories : any[] = [];
  public finalMap : any[] = [];
  public finalMap1 : any[] = [];

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
            //this.items[series].push({year:splitPipedRecord[0],value:splitPipedRecord[1]});
            this.items[series][splitPipedRecord[0].toString()] = splitPipedRecord[1];
            this.categories.push(splitPipedRecord[0].toString());

          });
        }
        });

        this.categories.sort();
        console.log(this.categories);
        this.categories = Array.from(new Set(this.categories));
        console.log(this.categories);
        
        var keys =  Object.keys(this.items);
        

        keys.forEach(key => {
          
            console.log(this.items[key]);
            this.finalMap[key] = [];
            this.categories.forEach(element => {
              if(this.items[key][element]){
                this.finalMap[key].push(this.items[key][element])
              }else {
                this.finalMap[key].push("0");
              }
              
            });
          
          
        });
        console.log(this.finalMap);
        keys.forEach(key => {
          this.finalMap1.push(this.finalMap[key]);
        });
        
        console.log(this.finalMap1);
  
      }

      reader.onerror = function() {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      alert("Please import valid .csv file.");
      
    }
  }

  // CHECK IF FILE IS A VALID CSV FILE
  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }


}
