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

  }

  render() {
    return (
      <div>
          <Board playerBoard = {true} boardSize = {this.props.boardSize} port = {this.props.port} startGame = {this.startGame} takeTurn = {this.takeTurn} />
          <Board playerBoard = {false} boardSize = {this.props.boardSize} port = {this.props.port} disableButtons =  {false} takeTurn = {this.takeTurn} />
      </div>
    )
  }
}

export default Game;
