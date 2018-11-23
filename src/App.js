import React, { Component } from 'react';
import Login from './Login.js'
import Game from './Game.js'

const port = 8080;
const ip = "35.228.4.244"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      user: ''
    })
  }

  updateUser = (newUser) => {
    this.setState({
      user: newUser
    })
  }

  render() {
    return (
      <div>
      <Login user = {this.state.user} updateUser = {this.updateUser} ip = {ip}  port = {port} />
      <Game boardSize = {10} port = {port} difficulty = {2} />
      </div>
    );
  }
}

export default App;
