import React, { Component } from 'react';
import Login from './Login.js'
import Game from './Game.js'
import Stats from './Stats.js'

const port = 8080;
const ip = "35.228.4.244"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      user: '',
      difficulty: 3
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
      <Game boardSize = {10} ip = {ip} port = {port} difficulty = {this.state.difficulty} user = {this.state.user} />
      <Stats ip = {ip} port = {port} user = {this.state.user} difficulty = {this.state.difficulty} />
      </div>
    );
  }
}

export default App;
