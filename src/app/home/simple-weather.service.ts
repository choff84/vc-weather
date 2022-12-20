import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HourlyForecastModel } from './hourly-forecast-api-response';
import { Observable , catchError, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimpleWeatherService {

  private hourlyForecastUrl = 'https://api.weather.gov/gridpoints/FGF/60,58/forecast/hourly'
  constructor(private http: HttpClient) { }

  getHourlyForecast(): Observable<any> {
    return this.http.get<HourlyForecastModel>(this.hourlyForecastUrl).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(err: HttpErrorResponse){
    let errorMessage = '';
    if (err.error instanceof ErrorEvent){
      errorMessage = `An error occurred: ${err.error.message}`
    }
    else{
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    return throwError(()=>err)
  }

}
