const express = require('express')
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);

const port = 4001

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile('/index.html')
})

var userOnline = {}
io.on('connection', function (socket) {
  let userName = ''
  console.log(socket.id, 'connected');

  socket.on('CLIENT_DATA', (data) => {
    console.log(data);
  })

  socket.on('REGISTER', (data) => {
    if (userOnline[data]) {
      socket.emit('REGISTER', {status: 'error'})
      return
    }
    userName = data
    userOnline[userName] = socket.id
    
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

  socket.on('disconnect', () => {
    if (!userName) return
    delete userOnline[userName]
    io.emit('USER_ONLINE', {
      status: 'success',
      data: getOnlineUsers()
    })
  })

  socket.on('PRIVATE_MESSAGE', (req) => {
    console.log(req);
    if (!userOnline[req.receiver]
      || !userOnline[req.sender]
      || !req.data
    ) return

    socket.emit('PRIVATE_MESSAGE', {
      sender: req.sender,
      receiver: req.receiver,
      data: req.data
    })
    io.to(userOnline[req.receiver]).emit('PRIVATE_MESSAGE', {
      sender: req.sender,
      receiver: req.receiver,
      data: req.data
    })

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