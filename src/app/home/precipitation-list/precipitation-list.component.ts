import { Component, OnInit } from '@angular/core';
import { PrecipForecastModel } from '../precip-forecast-api-response';
import{DateTime} from 'luxon';

@Component({
  selector: 'app-precipitation-list',
  templateUrl: './precipitation-list.component.html',
  styleUrls: ['./precipitation-list.component.scss'],
})
export class PrecipitationListComponent implements OnInit {

  precipitationList:PrecipForecastModel[] =[];

  constructor() { }

  ngOnInit() {
  for (var i = 0; i<12; i++ ){
    
    var newModel = {
      validTime: DateTime.now().plus({hours: i }).toJSDate(),
      value:30,
    };

    console.log(newModel);

    this.precipitationList.push(newModel)
  }

  }

}
