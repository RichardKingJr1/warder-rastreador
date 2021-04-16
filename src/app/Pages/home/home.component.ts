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
    //ouve caso ocorra uma conexao ou reconexão e se ouver testa se o usuario ja estava logado
    this.conexao();

    //caso ja estivesse logado move para o painel de vc esta sendo rastreado, caso contrario leva para pagina inicial
    this.testeReconexao();
  }


  /***** Conexão ao websocket e teste para checar que o usuario estava anteriormente conectado***** */
  conexao(){
    this.webSocketService.listen('connect').subscribe((data) => {
      this.webSocketService.emit('alreadyConnected', this.rg);
    });
  }

  /****** Ajusta o aplicativo para o caso de reconexao *****/
  testeReconexao(){
    this.webSocketService.listen('alreadyConnected').subscribe((data) => {
      
      console.log(data);
      if(data == true){
        this.ctrl_view = false;
        this.ctrl_view_espera = false;
      }else{
        this.ctrl_view = true;
        this.ctrl_view_espera = true;
      }
    });
  }

  /******** Solicitar rastreamento **********/
  solicitarRastreio(rg: String): void{
    console.log('rastrear');
    if (!navigator.geolocation) {
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

      }   
    }
  };

  /***** Cancelar solicitacao *******/
  cancalerSolicitacao(){
    this.webSocketService.emit('cancelarSolicitacao', this.rg);

    this.ctrl_view = true;
    this.ctrl_view_espera = true;
  }

  /******* Controle do  view *******/
  viewCtrl(view:Boolean, view_espera:Boolean){
    if(this.ctrl_view == view || this.ctrl_view_espera == view_espera){
      return true;
    }else{
      return false
    };
  };



}
