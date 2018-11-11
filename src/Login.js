import React, { Component } from 'react';
import axios from 'axios'

const port = 8081;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      usernameMsg: '',
      username: this.props.user,
      signUp: false,
      loggedIn: false
    })
  }

  passwordsMatch = () => {
    if (document.getElementById('password') === document.getElementById('reenter')) {
      return true;
    } else {
      return false;
    }
  }

  signUp = () => {
    if (!this.passwordsMatch()) {
      this.setState({
        usernameMsg: 'Passwords do not match'
      })
      return;
    }
    axios.get("http://localhost:"+ port +"/battleships-1.0/api/battleships/checkUsername/" + document.getElementById('username').value).then((response) => {

      if (response.data.response === "false") {
        axios.post("http://localhost:"+ port +"/battleships-1.0/api/battleships/addUser",
          {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
          }
        ).then(
          this.setState({
            loggedIn: true,
            signUp: false
          })
          //TODO store login in Parent via either cookie or back end
        );
      } else {
        this.setState({
          usernameMsg: 'Username already taken'
        })
      }
    })
  }

  login = () => {
    axios.get("http://localhost:"+ port +"/battleships-1.0/api/battleships/checkUsername/" + document.getElementById('username').value).then((response) => {

      if (response.data.response === "true") {
        axios.post("http://localhost:"+ port +"/battleships-1.0/api/battleships/checkPassword",
          {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
          }
        ).then((response) => {
            if (response.data.response === "false") {
              this.setState({
                usernameMsg: 'Incorrect password'
              })
            } else {
              this.setState({
                loggedIn: true
              })
              //TODO store login in Parent via either cookie or back end
            }
          }
        );
      } else {
        this.setState({
          usernameMsg: 'Username not found'
        })
      }
    })
  }

  goToSignUp = () => {
    this.setState({
      signUp: true
    })
  }

  signOut = () => {
    this.setState({
      loggedIn: false,
    })
    //TODO remove login in Parent via either cookie or back end
  }

  render() {
    const login = <div>
      Username: <input id='username' type = 'text' placeholder='username...' /><br/><br/>
      Password: <input id ='password' type='password' placeholder='password...' /><br/><br/>
      <input id = 'login' value = 'Log In' type = 'button' onClick =  {this.login} />
      <input id = 'signUp' value = 'Sign Up' type = 'button' onClick =  {this.goToSignUp} /><br/>
      <p style={{color:'red'}}>{this.state.usernameMsg}</p>
    </div>

    const signUp = <div>
      Username: <input id='username' type = 'text' placeholder='username...' /><br/><br/>
      Password: <input id ='password' type='password' placeholder='password...' /><br/><br/>
      Re-enter Password: <input id ='reenter' type='password' placeholder='password...' /><br/><br/>
      <input id = 'signUp' value = 'Sign Up' type = 'button' onClick =  {this.signUp} /><br/>
      <p style={{color:'red'}}>{this.state.usernameMsg}</p>
    </div>

    const loggedIn = <div>
      You are currently logged in as {this.state.user}<br/>
      <input id = 'signOut' value = 'Sign Out' type = 'button' onClick =  {this.signOut} />
      </div>

    if (this.state.signUp === "true") {
      var display = signUp;
    } else if (this.state.loggedIn === "true") {
      var display = loggedIn;
    } else {
      var display = login;
    }

    return (
      display
    );
  }
}

export default Login;
