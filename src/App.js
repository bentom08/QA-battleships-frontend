import React, { Component } from 'react';
import Login from './Login.js'
import Board from './Board.js'

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
      <Board boardSize = {10} playerBoard = {true} />
      </div>
    );
  }
}

export default App;
