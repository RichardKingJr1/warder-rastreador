import { Injectable } from '@angular/core';
import NoSleep from 'nosleep.js';

@Injectable({
  providedIn: 'root'
})
export class SleepService {

  public nosleep = new NoSleep();

  constructor() { }

  /********** Funções de no sleep (impede que a tela desligue) ********* */
  enable() {
    if (this.nosleep) this.nosleep.disable(); 
    this.nosleep = new NoSleep();
    this.nosleep.enable();
  }
  disable() {
    this.nosleep.disable();
  }
}
