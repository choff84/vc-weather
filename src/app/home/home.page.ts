import { Component, OnInit, ViewChild } from '@angular/core';
//import { ForecastService } from './forecast.service';
import { HourlyForecastModel } from './hourly-forecast-api-response';
import { AlertController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { PrecipForecastModel } from './precip-forecast-api-response';
import { ToastController } from "@ionic/angular"

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
  showMore: boolean = false;

  imageUrl: string = "./assets/Partly Cloudy.png";
  isChecked=false;
  
  currentForecast: HourlyForecastModel | null = null;
  probabilityPrecipForecast!: PrecipForecastModel[];


  quantitativePrecipForecast!: PrecipForecastModel;
  guessCityName = "Cupertino, CA"
  message!:string;
  color!:string;
  testVar = document.getElementById("testInput")
  canDismiss = false;
  cardColor = "warning"

  constructor(private alertController: AlertController, public platform: Platform, private modalCtrl: ModalController, private http: HttpClient, private toastController: ToastController) {}

  ngOnInit() {
    this.checkPlatform()
      
   
      this.callApi()
      this.callPrecipApi()
     }
    
   
     
     submitTemp(temp:any){
       
       if (temp == 70){
         this.cardColor = "success"
         this.presentToast(this.message='Correct. Nice job!', this.color='success')
       }
       else{
         
         this.presentToast(this.message='Incorrect. Try again!', this.color='danger')
       }
     }
    convertToIn(mm: number): number{
     let inches = mm / 25.4;
     return inches; 
    }
    
     getCurrentForecast(){
       return this.http.get<any>("https://api.weather.gov/gridpoints/FGF/60,58/forecast/hourly");
     }
   
     callApi(){
       this.getCurrentForecast().subscribe({
         next: serverData => {
         this.currentForecast = serverData.properties.periods[0]
   
         
         }
        
        })
     }
   
     getPrecipForecast(){
       return this.http.get<any>("https://api.weather.gov/gridpoints/FGF/60,58");
     }
   
     callPrecipApi(){
       this.getPrecipForecast().subscribe({
         next: serverData => {
         this.probabilityPrecipForecast = serverData.properties.probabilityOfPrecipitation.values
   
         
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
         component: 'ForecastComponent'
       });
       this.modal.present();
   
       await this.modal.onWillDismiss();
     }
   
     
     
     showMoreClick(){
       this.showMore = !this.showMore;
     };
     
     
   
    
   
   @ViewChild(IonModal)
  modal!: IonModal;
   
   
   dismiss() {
     this.modal.dismiss();
   }
   
   onWillDismiss(event: Event) {}
   
   
   
   async presentToast(message:string, color:string) {
     const toast = await this.toastController.create({
       message: message,
       duration: 1500,
       position: 'bottom',
       color: color,
     });
   
     await toast.present();
   }
   
   async presentTerms() {
     const alert = await this.alertController.create({
       header: 'Do you accept the terms and conditions below?',
      
       message: 'The terms and conditions go here',
       buttons: [
         {
           text: 'Cancel',
           role: 'cancel',
   
         },
         {
           text: "Yes",
           role: "confirm",
           handler: () =>{
            
             this.canDismiss = true;
           }
         }
       ],
     });
   
     await alert.present();
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

}
