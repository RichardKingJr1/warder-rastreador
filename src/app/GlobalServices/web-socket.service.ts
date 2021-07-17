import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from "socket.io-client";

/******************/
//Serviço responsavel por realizar toda a comunicação através de websockets

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: Socket;

  constructor() {
    //inicia conexão com o web socket3
    //this.socket = io();
    this.socket = io('http://localhost:3000/');
  }

  //função para ouvir dado recebido
  listen(eventName: string) {
    console.log('listen');
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) =>{
        subscriber.next(data);
      })
    })
  }

  //função para enviar dado
  emit(eventName: string, data: any){
    console.log(this.emit);
    this.socket.emit(eventName,data);
  }
}
