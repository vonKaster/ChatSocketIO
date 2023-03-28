import { io } from "socket.io-client";

class SocketIOService {
  socket;
  constructor() {
    this.socket = io("http://localhost:3000");
    this.socket.on("connect", () => {
      console.log("Conectado al servidor de socket-io");
    });
  }

  setupSocketConnection() {
    this.socket = io("http://localhost:3000");
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(message) {
    console.log("Mensaje a enviar: ", message);
    this.socket.emit("sendMessage", message, (error) => {
      console.log("servicio enviar mensaje");
      if (error) {
        console.log(error);
      } else {
        console.log("Mensaje enviado con éxito");
      }
    });
  }

  updateUserList(users) {
    console.log("Usuarios Servicio Socket", users);
    this.socket.emit("updateUsers", users, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Usuarios actualizados con éxito");
      }
    });
  }

  emitMessage(message) {
    this.socket.emit("newMessage", message);
  }

  getInitialMessages(callback) {
    this.socket.emit("getInitialMessages", callback);
  }

  receiveInitialMessages() {
    this.socket.on("initialMessages", (messages) => {
      this.addMessages(messages);
    });
  }
}

export default new SocketIOService();
