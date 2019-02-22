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
  render() {
    let { userOnline } = this.props
    return (
      <div id="wrapper">

        <div className="col-4">
          <div id="status-aside">
            <div className="scroll" id="user-online">
              {userOnline.map((item, index) => {
                if (item !== this.props.userName)
                return (
                  <UserStatusItem 
                    userName={item}
                    key={index}
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

                <li>
                  <div className="message item-left">Hello</div>
                  <div style={{clear: "both"}}></div>
                </li>
                {/* <li>
                  <div className="message item-right">Hello</div>
                  <div style={{clear: "both"}}></div>
                </li>
                <li>
                  <div className="message item-right">Hello</div>
                  <div style="clear: both"></div>
                </li>
                <li>
                  <div className="message item-left">Hello</div>
                  <div style="clear: both"></div>
                </li> */}
            
              </ul>
            </div>
            
            <ChatInput />

          </div>        
        </div>
        
      </div>
    )
  }
}
class UserStatusItem extends React.Component {
  render() {
    return (
      <div className="list-user-item">
        <div className="user-name">{this.props.userName}</div>
        <i className="fas fa-circle text-green"></i>
        <span className="user-status"> Online</span>
      </div>
    )
  }
}
class ChatInput extends React.Component {
  render() {
    return (
      <div id="chat-input">
        <div className="input-item">
          <textarea 
            id="text-input" 
            placeholder="Type your message..."
          >

          </textarea>
        </div>

        <div className="button" id="sent-message">
          <i className="fab fa-telegram-plane"></i>
        </div>

      </div>
    )
  }
}
ReactDOM.render(<App />, document.getElementById('root'));