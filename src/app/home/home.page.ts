import { Component, OnInit, ViewChild } from '@angular/core';
import { HourlyForecastModel } from './hourly-forecast-api-response';
import { IonModal } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SimpleWeatherService } from './simple-weather.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  canContinue: boolean = false;
  showInstructions: boolean = false;
  showTerms: boolean = true;
  isAndroid: boolean = false;
  imageUrl: string = "./assets/Partly Cloudy.png";
  isChecked=false;
  currentForecast: HourlyForecastModel | null = null;
  retryCount = 0;
  simpleWeatherLoaded = false;
  iconUrl = './assets/icons/cloudy.png'

  constructor(private platform: Platform, private modalCtrl: ModalController, private http: HttpClient, private simpleWeatherService: SimpleWeatherService, private alertController: AlertController) {}

  ngOnInit() {
    this.checkPlatform()
    this.getSimpleWeather()
    if (this.currentForecast !== null){
      this.simpleWeatherLoaded = true;
    }
    
  }
    

  getSimpleWeather(){
    this.simpleWeatherService.getHourlyForecast().subscribe({
      next: serverData => {
        this.retryCount = 0;
        this.simpleWeatherLoaded = true;
        this.currentForecast = serverData.properties.periods[0];
        
        switch(this.currentForecast?.shortForecast){
          case 'Sunny':
            this.iconUrl = './assets/icons/sunny.png'
            break;
          case 'Partly Sunny':
            this.iconUrl = './assets/icons/parlycloudypartlysunny.png'
            break;
          case 'Mostly Cloudy':
            this.iconUrl = './assets/icons/mostlycloudy.png'
            break;
          case 'Cloudy':
            this.iconUrl = './assets/icons/cloudy.png'
            break;
          default:
            console.log("No matching icons")  
        }


      },
      error: err => {
        let errorCode
        if (err.status == "0"){
          errorCode = "Unable to contact server"
        }
        else {
          errorCode = "Server returned code "+ err.status
        }
        this.presentAlert(errorCode)
        
      }
    })

  }


  
     
  checkPlatform(){
       if (this.platform.is("pwa")){
         null
       }
       else{
         this.openModal()
       }
   
       if (this.platform.is("android")){
         this.isAndroid = true;
       }
 }
  async openModal() {
       await this.modalCtrl.create({
         component: 'HomePage'
       });
      // this.modal.present();
   
       await this.modal.onWillDismiss();
  }
   
   
   @ViewChild(IonModal)
  modal!: IonModal;
   
   
   dismiss() {
     this.modal.dismiss();
   }
   


   checkboxClick(e:any){
    if (this.isChecked){
      this.canContinue = true;
    }
    else{
      this.canContinue = false;
    }
  }


  termsContinue(){
   this.showInstructions = true;
   this.canContinue=false;
   this.showTerms = false;
  }

  async presentAlert(errorCode: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: errorCode,
      buttons: [
        {
        text: 'OK',
        role: 'confirm',
      },
      {
        text: 'Retry',
        handler: () => {
          
         
          if (this.retryCount < 2){
            this.getSimpleWeather();
            this.retryCount ++
          }
          else{
            let errorCode = "Try again later"
            this.dismissAlert(errorCode)
          }
          
        }
      }
    ],
    });

    await alert.present();
  }


  async dismissAlert(errorCode: string){
    const alert = await this.alertController.create({
      header: 'Error',
      message: errorCode,
      buttons: ["OK"]
    });

    await alert.present();
  }

}
