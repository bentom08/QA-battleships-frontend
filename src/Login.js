import React, { Component } from 'react';
import axios from 'axios'

const port = 8081;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      usernameMsg: ''
    })
  }

  signUp = () => {
    axios.get("http://localhost:"+ port +"/battleships-1.0/api/battleships/checkUsername/" + document.getElementById('username').value).then((response) => {

      if (response.data.response === "false") {
        axios.post("http://localhost:"+ port +"/battleships-1.0/api/battleships/addUser",
          {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
          }
        ).then(
          this.setState({
            usernameMsg: ''
          })
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
              //TODO: Sign in
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

  render() {
    return (
      <div>
        <input id='username' type = 'text' placeholder='username...' /><br/><br/>
        <input id ='password' type='password' placeholder='password...' /><br/><br/>
        <input id = 'login' value = 'Log In' type = 'button' onClick =  {this.login} />
        <input id = 'signUp' value = 'Sign Up' type = 'button' onClick =  {this.signUp} /><br/>
        {this.state.usernameMsg}
      </div>
    );
  }
}

export default Login;
