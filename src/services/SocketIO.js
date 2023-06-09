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

  deleteMessage(message) {
    message.wasDeleted = true;
    message.text = "Este mensaje fue eliminado por su remitente";
    console.log("ID del mensaje a eliminar: ", message.id);
    this.socket.emit("updateMessage", message, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Mensaje eliminado con éxito");
        this.socket.emit("updateMessage", message);
      }
    });
  }

  updateMessage(message) {
    message.wasEdited = true;
    this.socket.emit("updateMessage", message, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Mensaje actualizado con éxito");
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
