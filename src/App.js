import React, { Component } from 'react';
import axios from 'axios'
import Login from './Login.js'

const port = 8081;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      user: ''
    })
  }

  componentWillUpdate = () => {
    axios.get("http://localhost:"+ port +"/battleships-1.0/api/battleships/getUsername").then((response) => {
      this.setState({
        user: response.data.username
      })
    })
  }

  render() {
    return (
      <Login user = {this.state.user} />
    );
  }
}

export default App;
