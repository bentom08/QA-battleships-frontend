import React, { Component } from 'react';
import Login from './Login.js'
import Game from './Game.js'

const port = 8081;

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
      <Login user = {this.state.user} updateUser = {this.updateUser} port = {port} />
      <Game boardSize = {10} />
      </div>
    );
  }
}

export default App;
