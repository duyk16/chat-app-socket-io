const socket = io();

$(document).ready(function() {
  $('#sent-message').on('click', function() {
    let textInput = $('#text-input').val()
    if (!textInput) return
    
    socket.emit('CLIENT-DATA', {
      userName,
      textInput
    })

  })
  
})