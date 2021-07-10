import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/GlobalServices/web-socket.service';
import { RastreioService } from './Services/rastreio.service';
import { SleepService } from './Services/sleep.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private webSocketService:WebSocketService, private _rastreio:RastreioService, private _sleep:SleepService) { }

  public rg: string | null = null;

  public portariaLat:number = -22.904407;
  public portariaLon:number = -47.001585;
  public limiteDistanciaPortaria:number = 0.0003;

  private id: number = 0;

  /*Controle de view*/
  public ctrl_view: boolean = true;
  public ctrl_view_espera: boolean = true;

  public OS_ctrl = false;

  /*Lista de OS's que não aceitos*/
  public OS = ['iPad Simulator','iPhone Simulator','iPod Simulator','iPad','iPhone','iPod'];

  ngOnInit(): void {
    //ouve caso ocorra uma conexao ou reconexão e se ouver testa se o usuario ja estava logado
    this.conexao();

    //le websocket para ver se o usuario ja estava logado move para o painel de vc esta sendo rastreado, caso contrario leva para pagina inicial
    this.verificaReconexao();

    //le websocket para ver inicio do rastreamento  
    this.verificaInicioRastreio();

    //le websocket para ver recusa do rastreamento  
    this.verificaRecusaSolicitao();

    //le websocket para ver fim do websocket
    this.verificaFimRastreio();
  }


  /***** Conexão ao websocket e teste para checar que o usuario estava anteriormente conectado***** */
  conexao(){
    this.webSocketService.listen('connect').subscribe(() => {
      this.webSocketService.emit('alreadyConnected', this.rg);
    });
  }

  /****** Ajusta o aplicativo para o caso de reconexao *****/
  verificaReconexao(){
    this.webSocketService.listen('alreadyConnected').subscribe((data) => {
      
      console.log(data);
      if(data == true){
        this.ctrl_view = false;
        this.ctrl_view_espera = false;

        this._rastreio.restrear(this.rg);
        this._sleep.enable();
      }else{
        this.ctrl_view = true;
        this.ctrl_view_espera = true;
      }
    });
  }

  /******** Solicitar rastreamento **********/
  solicitarRastreio(rg: string): void{
    console.log('rastrear');
    if (!navigator.geolocation) {
      window.alert('Rastreio nao suportado');
    }else{
      this._sleep.enable();
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

  /********* Verifica se o rastreamento foi iniciado***********/
  verificaInicioRastreio(){
    this.webSocketService.listen('inicioRatreamento').subscribe(() => {
      this.ctrl_view_espera = !this.ctrl_view_espera;
      //Le as cordenadas toda vez q o gps encontra variação na posição e envia para o servidor
      this.id = this._rastreio.restrear(this.rg);
    });
  }

  /********* Verifica se a solicitacao foi cancelada***********/
  verificaRecusaSolicitao(){
    this.webSocketService.listen('recusado').subscribe(() => {
      this.ctrl_view = true;
      this.ctrl_view_espera = true;
    });
  }
  /********* Verifica se o rastreamento foi encerrado***********/
  verificaFimRastreio(){
    this.webSocketService.listen('admDisconnect').subscribe((data) => {
      this.ctrl_view = !this.ctrl_view;
      //desliga rastreador
      navigator.geolocation.clearWatch(this.id);
      this._sleep.disable();
    });
  }

   /****Função para o usuário desligar o tracking*****/
   desligar(){
     this._sleep.disable();
    //desliga rastreador
    navigator.geolocation.clearWatch(this.id);
    //coloca status como finalizado
    this.webSocketService.emit('auDisconnect', this.rg);
    this.ctrl_view = !this.ctrl_view;
  }

  /******* Controle do  view *******/
  viewCtrl(view:boolean, view_espera:boolean){
    if(this.ctrl_view == view || this.ctrl_view_espera == view_espera){
      return true;
    }else{
      return false
    };
  };

   /***** Detectar OS ******/
  //detectar o sistema operacional
  detectarSO(){
    if(this.OS.includes(navigator.platform)){
      //window.alert('Apple');
      this.OS_ctrl = true;
    }
  }

}
