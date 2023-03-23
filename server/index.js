const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = 3000;
const app = express();

const server = http.createServer(app);
let messages = []; // Creamos un arreglo vacío para almacenar los mensajes
let userList = [];

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  // Enviamos los mensajes almacenados a cada socket conectado
  socket.emit("initialMessages", messages);

  socket.on('onlineUsers', (users) => {
    console.log('Usuarios en línea recibidos desde el cliente: ', users);
    userList = users;
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);

    // Eliminamos al usuario del registro de usuarios conectados
    delete userList[socket.userId];
  });

  socket.on("sendMessage", (message) => {
    console.log("Mensaje recibido: ", message);
    messages.push(message); // Agregar el mensaje a la lista de mensajes

    if (message.recipientId) {
      // Si el mensaje tiene un destinatario, lo enviamos únicamente a ese destinatario
      io.to(userList[message.recipientId]).emit("newPrivateMessage", message);
    } else {
      // Si no tiene destinatario, lo enviamos a todos los usuarios conectados
      io.emit("newMessage", message);
    }
  });

  socket.on("getInitialMessages", (callback) => {
    callback(messages);
  });

  socket.on("setUserId", (userId) => {
    // Almacenamos el ID de usuario en el objeto de usuarios conectados
    userList[userId] = socket.id;
    socket.userId = userId;
  });
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
