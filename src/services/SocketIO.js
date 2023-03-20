import { io } from 'socket.io-client';

class SocketIOService {
  socket;
  constructor() {}

  setupSocketConnection() {
    this.socket = io("http://localhost:3000");
    this.socket.emit('my message', 'Hello there from Vue.');
    
    this.socket.on('my broadcast', (data) => {
      console.log(data);
    });
  }
  
  disconnect() {
    if(this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketIOService();