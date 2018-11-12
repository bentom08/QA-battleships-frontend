import React, { Component } from 'react';
import Login from './Login.js'

const port = 8080;

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
      <Login user = {this.state.user} updateUser = {this.updateUser} port = {port} />
    );
  }
}

export default App;
