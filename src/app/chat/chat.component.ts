import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  public socket: any;
  currentMessage: string = '';
  currentName: string = '';
  countUsers: number = 0;

  constructor() { }

  ngOnInit() {
    // Подключение к серверу socket.io
    this.socket = io('http://localhost:3000');

    this.socket.on('update-countUser', (CountUs: number) => {
      this.countUsers = CountUs;
    });

    // Слушатель для новых сообщений
    this.socket.on('chat-message', (name: string, message: string) => {

      let MsgCont = document.createElement("div");
      let Msg = document.createElement("div");
      let MsgName = document.createElement("b");
      let MsgText = document.createElement("div");

      MsgText.textContent = message;

      Msg.style.borderRadius = "10px";
      Msg.style.padding = "13px";
      Msg.style.maxWidth = "600px";
      Msg.style.margin = "10px";
      Msg.style.display = "inline-block";

      MsgCont.style.display = "flex";
      MsgCont.style.marginRight = "30px";

      if(name == this.currentName){
        MsgName.textContent = "Я";
        Msg.style.background = "#3d5fbd";
        Msg.style.color = "#a6aab4";
        MsgCont.style.flexDirection = "row-reverse";
      }
      else{
        MsgName.textContent = name;
        Msg.style.background = "#1e1f22";
        MsgCont.style.flexDirection = "row";
      }

      Msg.append(MsgName,MsgText);
      MsgCont.append(Msg);
      // @ts-ignore
      document.getElementsByClassName("Messages").item(0).prepend(MsgCont);

      console.log(name+':'+message); // Вывод сообщения в консоль (для проверки)
    });
  }

  sendMessage() {
    if (this.currentName != '' && this.currentMessage != ''){
      // Отправка сообщения на сервер
      this.socket.emit('chat-message', this.currentName, this.currentMessage);
      this.currentMessage = '';
    }
    else{
      alert("Заполните поля Имя и Сообщение!!!")
    }
  }
}
