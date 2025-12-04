import { Component } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [MatButtonModule]
})
export class AppComponent {
  title = 'Pizza Hub';

  private hubConnection?: signalR.HubConnection;
  isConnected: boolean = false;

  selectedChoice: number = -1;
  nbUsers: number = 0;

  pizzaPrice: number = 0;
  money: number = 0;
  nbPizzas: number = 0;

  constructor(){
    this.connect();
  }

  connect() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5282/hubs/pizza')
      .build();
//******************************************** */

this.hubConnection.on('UpdateMoney', (data) => {
  this.money = data;
console.log("Money updated: " + data);
});

this.hubConnection!.on('PrixPizza', (data) => {
      this.pizzaPrice = data;
      console.log(data);

    });


this.hubConnection?.on("UpdateNbPizzasAndMoney", (a:number, b:number) => {
      this.money = a;
      this.nbPizzas = b;
      console.log(a,b);
    });



this.hubConnection!.on('NbrUsers', (data) => {
      console.log(data);
      this.nbUsers = data;

    });

//******************************************** */

    // TODO: Mettre isConnected à true seulement une fois que la connection au Hub est faite
    //this.isConnected = true;
    this.hubConnection.start().then(() => {console.log('Connection started'); this.isConnected = true;}).catch(err => console.log('Error while starting connection: ' + err));
  }

  selectChoice(selectedChoice:number) {
    this.selectedChoice = selectedChoice;
    this.hubConnection?.invoke("SelectChoice", selectedChoice);
  }

  unselectChoice() {
    this.selectedChoice = -1;
  }

  addMoney() {
    this.hubConnection?.invoke("AddMoney", this.selectedChoice);
  }

  buyPizza() {
    this.hubConnection?.invoke("BuyPizza", this.selectedChoice);
  }
}
