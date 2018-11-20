import React, { Component } from 'react';
import Board from './Board.js'
import axios from 'axios'

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      AITurn: true,
      playerCoords: [-1, -1],
      opponentCoords: [-1, -1]
    }
  }

  startGame = () => {
    this.setState({
      AITurn: false
    })
  }

  takeTurn = (player, x, y) => {
    if(player) {
      this.setState({
        AITurn: false
      })
      axios.put("http://localhost:"+ this.props.port +"/battleships-1.0/api/battleships/playerTurn", [x, y]).then((response) => {
        return ({
          sunk: response.data.sunk,
          allSunk: response.data.allSunk
        })
      })
    } else {
      this.setState({
        AITurn: true
      })
      axios.put("http://localhost:"+ this.props.port +"/battleships-1.0/api/battleships/AITurn", 3).then((response) => {
        return ({
          coords: response.data.coords,
          sunk: response.data.sunk,
          allSunk: response.data.allSunk
        })
      })
    }
  }

  render() {
    return (
      <div>
          <Board playerBoard = {true} boardSize = {this.props.boardSize} port = {this.props.port} startGame = {this.startGame} takeTurn = {this.takeTurn} />
          <Board playerBoard = {false} boardSize = {this.props.boardSize} port = {this.props.port} disableButtons =  {this.state.AITurn} takeTurn = {this.takeTurn} />
      </div>
    )
  }
}

export default Game;
