import React, { Component } from 'react';
import axios from 'axios'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      usernameMsg: '',
      user: this.props.user,
      signUp: false,
      loggedIn: false,
      changePassword: false
    })
  }

  passwordsMatch = () => {
    if (document.getElementById('password').value === document.getElementById('reenter').value) {
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
    axios.get("http://localhost:"+ this.props.port +"/battleships-1.0/api/battleships/checkUsername/" + document.getElementById('username').value).then((response) => {

      if (response.data.response === "false") {
        axios.post("http://localhost:"+ this.props.port +"/battleships-1.0/api/battleships/addUser",
          {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
          }
        ).then( () => {
          this.props.updateUser(document.getElementById('username').value);
          this.setState({
            loggedIn: true,
            signUp: false
          })
        });
      } else {
        this.setState({
          usernameMsg: 'Username already taken'
        })
      }
    })
  }

  login = () => {
    axios.get("http://localhost:"+ this.props.port +"/battleships-1.0/api/battleships/checkUsername/" + document.getElementById('username').value).then((response) => {

      if (response.data.response === "true") {
        axios.post("http://localhost:"+ this.props.port +"/battleships-1.0/api/battleships/checkPassword",
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
              this.props.updateUser(document.getElementById('username').value);
              this.setState({
                loggedIn: true
              })
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
      signUp: true,
      changePassword: false,
      loggedIn: false
    })
  }

  goToLogin = () => {
    this.setState({
      signUp: false,
      changePassword: false,
      loggedIn: false
    })
  }

  goToLoggedIn = () => {
    this.setState({
      loggedIn: true,
      changePassword: false,
      signUp: false
    })
  }

  goToChangePassword = () => {
    this.setState({
      loggedIn: false,
      signUp: false,
      changePassword: true
    })
  }

  signOut = () => {
    this.props.updateUser('');
    this.setState({
      loggedIn: false,
    })
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      user: nextProps.user
    })
  }

  render() {
    const login = <div>
      Username: <input id='username' type = 'text' placeholder='username...' /><br/><br/>
      Password: <input id ='password' type='password' placeholder='password...' /><br/><br/>
      <button id = 'login' onClick =  {this.login} >Log In</button>
      <button id = 'signUp' onClick =  {this.goToSignUp} >Sign Up</button><br/>
      <p style={{color:'red'}}>{this.state.usernameMsg}</p>
    </div>

    const signUp = <div>
      Username: <input id='username' type = 'text' placeholder='username...' /><br/><br/>
      Password: <input id ='password' type='password' placeholder='password...' /><br/><br/>
      Re-enter Password: <input id ='reenter' type='password' placeholder='re-enter...'/><br/><br/>
      <button id = 'signUp' onClick =  {this.signUp} >Sign Up</button>
      <button id = 'back' onClick =  {this.goToLogin} >Back to Login</button><br/>
      <p style={{color:'red'}}>{this.state.usernameMsg}</p>
    </div>

    const loggedIn = <div>
      You are currently logged in as {this.state.user}<br/>
      <button id = 'signOut' onClick =  {this.signOut} >Sign Out</button>
      <button id = 'changePassword' onClick = {this.goToChangePassword}>Change Password</button>
      </div>

    const changePassword = <div>
      Username: <input id='oldPass' type = 'password' placeholder='old password...' /><br/><br/>
      Password: <input id ='newPass' type='password' placeholder='new password...' /><br/><br/>
      Re-enter Password: <input id ='reenter' type='password' placeholder='re-enter...'/><br/><br/>
      <button id = 'change' onClick = {this.changePassword}>Change Password</button>
      <button id = 'back' onClick =  {this.goToLoggedIn} >Go Back</button><br/>
      </div>

    var display;
    if (this.state.signUp === true) {
      display = signUp;
    } else if (this.state.loggedIn === true) {
      display = loggedIn;
    } else if (this.state.changePassword === true) {
      display = changePassword;
    } else {
      display = login;
    }
    return (
      display
    );
  }
}

export default Login;
