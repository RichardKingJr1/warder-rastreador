import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/GlobalServices/web-socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private webSocketService:WebSocketService) { }

  public rg: String | null = null;

  public portariaLat:number = -22.904407;
  public portariaLon:number = -47.001585;
  public limiteDistanciaPortaria:number = 0.0003;

  /*Controle de view*/
  public ctrl_view: Boolean = true;
  public ctrl_view_espera: Boolean = true;

  ngOnInit(): void {
  }

  /******** Iniciar rastreamento **********/
  rastrear(rg: String): void{
    console.log('rastrear');
    if (!navigator.geolocation) {
      //console.log('location is not supported');
      window.alert('Rastreio nao suportado');
    }else{

      if(rg){
        //versão sem controle de distancia portaria
        let dataObj = {
          rg: rg,
          lat: this.portariaLat,
          lon: this.portariaLon
        };

        this.rg = rg;

        this.webSocketService.emit('requestServer', dataObj);
        this.ctrl_view = !this.ctrl_view;
        this.ctrl_view_espera = true;

      };
       
    };
  }

  viewCtrl(view:Boolean, view_espera:Boolean){
    if(this.ctrl_view == view || this.ctrl_view_espera == view_espera){
      return true;
    }else{
      return false
    };
  };

  
}
