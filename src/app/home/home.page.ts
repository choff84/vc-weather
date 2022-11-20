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

  jokesQuestions = ["How do hurricanes see?","What did one lightning bolt say to the other?","What's the difference between weather and climate?", "When are your eyes not eyes?", "I heard Humpty Dumpty had a great summer...", "Why is the sun so smart?", "Where do snowmen keep their money?"]
  jokesAnswers = ["With one eye!", "You're shocking!", "You can't weather a tree, but you can climate.", "when the cold wind makes them water!", "But he had a horrible fall.", "It has over 5,000 degrees.", "In a snow bank."]
  
  showJoke: boolean = false;
  currentJokeQuestion!: string;
  currentJokeAnswer!: string;
  isAndroid: boolean = false;
  showMore: boolean = false;
  currentForecast!: HourlyForecastModel;
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
      this.getJoke()
   
      this.callApi()
      this.callPrecipApi()
     }
    
   
     
     submitTemp(temp:string | number | null | undefined){
       
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
   
     getJoke(){
       this.currentJokeQuestion = this.jokesQuestions[this.dayMod]
       this.currentJokeAnswer = this.jokesAnswers[this.dayMod]
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
     
     toggleJoke(){
       this.showJoke = !this.showJoke
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
     
     
   now: any = new Date();
   start: any = new Date(this.now.getFullYear(), 0, 0)
   diff = (this.now - this.start) + ((this.start.getTimezoneOffset() - this.now.getTimezoneOffset()) * 60 * 1000)
   oneDay = 1000 * 60 *60 * 24
   day = Math.floor(this.diff / this.oneDay)
   dayMod = this.day % this.jokesQuestions.length
    
   
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
   


}
