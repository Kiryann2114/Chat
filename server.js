const Server = require("socket.io").Server;
const app = require("express")();
const cors = require("cors");

app.use(cors());

const server = require('http').createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET","POST"],
    credentials: true
  },
})
let countOnline = 0;
io.on('connection', (socket) => {
  console.log('User connected');
  countOnline += 1;
  io.emit('update-countUser', (countOnline));

  // Обработчик нового сообщения
  socket.on('chat-message', (Name, message) => {
    console.log('Сообщение от ',Name,':', message);

    // Отправка сообщения всем подключенным клиентам
    io.emit('chat-message', Name, message);
  });

  // Обработчик отключения пользователя
  socket.on('disconnect', () => {
    console.log('User disconnected');
    countOnline -= 1;
    io.emit('update-countUser', (countOnline));
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
