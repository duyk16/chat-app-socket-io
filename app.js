const express = require('express')
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile('/index.html')
})

var userOnline = {
  "Bill Gate": "socketId1"
}
io.on('connection', function (socket) {
  console.log(socket.id, 'connected');

  socket.on('CLIENT_DATA', (data) => {
    console.log(data);
  })

  socket.on('REGISTER', (data) => {
    if (userOnline[data]) {
      socket.emit('REGISTER', {status: 'error'})
      return
    }
    
    userOnline[data] = socket.id
    console.log(userOnline);
    
    socket.emit('REGISTER', {
      status: 'success', 
      data: {userName: data, userId: socket.id}
    })

    io.emit('USER_ONLINE', {
      status: 'success',
      data: getOnlineUsers()
    })
  })

  io.emit('USER_ONLINE', {
    status: 'success',
    data: getOnlineUsers()
  })

});


function getOnlineUsers() {
  let result = []
  for (let key in userOnline) {
    result.push(key)
  }
  return result
}

http.listen(port, () => {
  console.log(`Listening on port ${port}...`);
})