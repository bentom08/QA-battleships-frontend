import React, { Component } from 'react';
import axios from 'axios'
import Login from './Login.js'

const port = 8081;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      user: 'ben'
    })
  }
  render() {
    return (
      <Login user = {this.state.user} />
    );
  }
}

export default App;
