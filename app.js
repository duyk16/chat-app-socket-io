const express = require('express')
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile('/index.html')
})

io.on('connection', function (socket) {
  console.log(socket.id, 'connected');

  socket.on('CLIENT-DATA', (data) => {
    console.log(data);
  })
});

http.listen(port, () => {
  console.log(`Listening on port ${port}...`);
})