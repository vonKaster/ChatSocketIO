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
  console.log("Nuevo usuario en línea");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  // Enviamos los mensajes almacenados a cada socket conectado
  socket.emit("initialMessages", messages);

  socket.on("updateUsers", (users) => {
    console.log("Usuarios actualizados en el servidor", users);
    userList = users;
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
    clearInterval(interval);
  });

  socket.on("sendMessage", (message) => {
    console.log("Mensaje recibido: ", message);
    messages.push(message); // Agregar el mensaje a la lista de mensajes
    io.emit("newMessage", message);
  });

  socket.on("getInitialMessages", (callback) => {
    callback(messages);
  });
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  socket.emit("FromAPI", response);
};

server.listen(port, () =>
  console.log(`Servidor iniciado, escuchando el puerto: ${port}`)
);
