import { Injectable } from '@angular/core';
import { WebSocketService } from 'src/app/GlobalServices/web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class MinimizadoService {

  constructor(private webSocketService:WebSocketService) { }

  //Função para verificar se o aplicativo foi minizado
  minimizado(){
    const parent = this.webSocketService;
    //verifica se o aplicativo foi minimizado
    document.addEventListener("visibilitychange", function(){
      if(document.visibilityState == 'hidden') {
        console.log('Minimizado');
        parent.emit('minimizado', '');
      } else {
        console.log('Visivel');
        parent.emit('maximizado', '');
      }
    });
  }

}
