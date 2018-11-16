import React, { Component } from 'react';
import Board from './Board.js'

class Game extends Component {

  render() {
    return (
      <div>
          <Board playerBoard = {true} boardSize = {this.props.boardSize} />
          <Board playerBoard = {false} boardSize = {this.props.boardSize} />
      </div>
    )
  }
}

export default Game;
