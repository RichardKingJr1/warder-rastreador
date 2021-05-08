import { Injectable } from '@angular/core';
import { WebSocketService } from 'src/app/GlobalServices/web-socket.service';


@Injectable({
  providedIn: 'root'
})
export class RastreioService {

  private minFrequency = 1*1000;
  private lastUpdateTime: number = - this.minFrequency;

  constructor(private webSocketService:WebSocketService) { }

  restrear(rg: string | null) {
    return navigator.geolocation.watchPosition((position) => {
      let now = new Date();
      /*Verifica se o ultimo update de posição ocorreu nos ultimos x segundos*/
      if(this.lastUpdateTime && now.getTime() - this.lastUpdateTime > this.minFrequency){
      
        this.lastUpdateTime = now.getTime();
        let dataObj = {
          rg: rg,
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };

        /*Envia os dados para o servidor*/
        this.webSocketService.emit('enviarLocalizacao', dataObj);

        
      }else if(this.lastUpdateTime < 0){
        this.lastUpdateTime = now.getTime();
      }
    },
    (err) => {
      console.log(err);
    },
    {
      enableHighAccuracy: true,
      timeout : 60*1000,
      maximumAge: 5*1000,
    });
  }
}
