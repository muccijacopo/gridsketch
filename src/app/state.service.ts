import { Injectable } from '@angular/core';

interface State {
  isDragMode: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state: State; 

  constructor() { 
    this.state = {
      isDragMode: false
    }
  }

  switch() {
    this.state.isDragMode = !this.state.isDragMode
  }
}
