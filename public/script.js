const socket = io();

class App extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      userName: '',
      userId: '',
      userOnline: {}
    }

    this._register = this._register.bind(this)
  }  

  _register(userName) {
    if (!userName) return
    socket.emit('REGISTER', userName)
  }

  componentDidMount = () => {
    socket.on('REGISTER', (res) => {
      if (res.status === 'success') {
        this.setState({
          ...this.state,
          userName: res.data.userName,
          userId: res.data.userId
        })
      }
    })

    socket.on('USER_ONLINE', (res) => {
      if (res.status === 'success') {
        this.setState({
          ...this.state,
          userOnline: res.data
        })
        console.log(this.state);
      }
    })
  };

  render() {
    return (
      <div>
        {!this.state.userName ? 
          <Register 
            register={this._register}
          /> :
          <Main 
            userOnline={this.state.userOnline}
            userName={this.state.userName}
          />
        }
      </div>
    )
  }
}

class Register extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      userName: ''
    }

    this.handleChange = this.handleChange.bind(this)
  }
  

  handleChange(e) {
    let userName = e.target.value;
    this.setState({
      userName
    })
  }
  render() {
    return (
      <div id="register" className="register-group">
        <div className="register-item">
          <input 
            type="text" 
            id="user-name-register" 
            placeholder="Register your name" 
            maxlength="20" 
            onChange={this.handleChange} 
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                this.props.register(this.state.userName)
              }
            }}
          />
        </div>
        <div className="register-item">
          <button 
            id="submit-register" 
            onClick={() => this.props.register(this.state.userName)}
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    ) 
  }
}

class Main extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      sender: this.props.userName,
      receiver: '',
      message: []
    }

    this._changeReceiver  = this._changeReceiver.bind(this)
    this._sendMessage     = this._sendMessage.bind(this)
  }
  
  _changeReceiver(userName) {
    this.setState({
      ...this.state,
      receiver: userName,
      message: []
    })
  }
  _sendMessage(data) {
    if (!this.state.receiver) return
    const { sender, receiver } = this.state
    socket.emit('PRIVATE_MESSAGE', {
      sender,
      receiver,
      data
    })
  }

  componentDidMount = () => {
    socket.on('PRIVATE_MESSAGE', (res) => {
      if (res.sender == this.state.sender 
        || res.receiver == this.state.sender
      ) {
        this.setState({
          ...this.state,
          message: [
            ...this.state.message,
            res
          ]
        })
      }
    })
  };
  

  render() {
    const { userOnline, userName } = this.props
    const { message } = this.state
    return (
      <div id="wrapper">
        <div className="col-4">
          <div className="user-info">
            {userName}&nbsp;
            <i class="fas fa-user"></i>
          </div>
          <div id="status-aside">
            <div id="user-online">
              {userOnline.map((item, index) => {
                if (item === this.props.userName) return 

                let active = item === this.state.receiver
                return (
                  <UserStatusItem 
                    userName={item}
                    changeReceiver={this._changeReceiver}
                    key={index}
                    active={active}
                  />
                )
              })}
            </div>
          </div>
        </div>

        <div className="col-8">
          <div id="main">
            <div id="content">
              <ul>
                {message.map((item, index) => {
                  let isSender = false
                  if (item.sender === this.state.sender) isSender = true
                  return (
                    <Message 
                      message={item.data}
                      send={isSender}
                      key={index}
                    />
                  )
                })}
              </ul>
            </div>
            
            <ChatInput 
              sendMessage={this._sendMessage}
            />

          </div>        
        </div>
        
      </div>
    )
  }
}
class UserStatusItem extends React.Component {
  changeReceiver() {
    this.props.changeReceiver(this.props.userName)
  }
  render() {
    const style = this.props.active ? 
      "list-user-item item-active" :
      "list-user-item"
    return (
      <div className={style} onClick={() => this.changeReceiver()}>
        <div className="user-name">{this.props.userName}</div>
        <i className="fas fa-circle text-green"></i>
        <span className="user-status"> Online</span>
      </div>
    )
  }
}
class ChatInput extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      message: ''
    }

    this.handleChange   = this.handleChange.bind(this)
    this.sendMessage    = this.sendMessage.bind(this)
  }
  
  handleChange(e) {
    this.setState({
      ...this.state,
      message: e.target.value
    })
  }
  sendMessage(e) {
    e.target.value = ''
    if (!this.state.message) return
    this.props.sendMessage(this.state.message)
    this.setState({
      ...this.state,
      message: ''
    })
  }
  render() {
    return (
      <div id="chat-input">
        <div className="input-item">
          <textarea 
            id="text-input" 
            placeholder="Type your message..."
            onChange={this.handleChange}
            onKeyUp = {(e) => {
              if (e.keyCode === 13) this.sendMessage(e)
            }}
          >
          </textarea>
        </div>

        <div 
          className="button" 
          id="sent-message"
          onClick={this.sendMessage}
        >
          <i className="fab fa-telegram-plane"></i>
        </div>

      </div>
    )
  }
}
class Message extends React.Component {
  render() {
    const style = this.props.send ? 
      "message item-right" : 
      "message item-left"
    return (
      <li>
        <div className={style}>{this.props.message}</div>
        <div style={{clear: "both"}}></div>
      </li>
    )
  }
}
ReactDOM.render(<App />, document.getElementById('root'));