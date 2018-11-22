import React, { Component } from 'react';
import Board from './Board.js'

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      AITurn: true,
      playerCoords: [-1, -1],
      opponentCoords: [-1, -1],
      playerGrid: ""
    }
  }

  startGame = (grid) => {
    this.setState({
      AITurn: false,
      playerGrid: grid
    })
  }

  takeTurn = (player, shipHere) => {
    if (!player) {
      var newGrid = this.state.playerGrid
      var coords = this.aiMove()
      newGrid[coords[0]][coords[1]].isHit = true
      shipHere = newGrid[coords[0]][coords[1]].shipConfirm
    }

    var isAINext = false

    if ((!player && shipHere) || (player && !shipHere)) {
      isAINext = true
    }

    this.setState({
      AITurn: isAINext
    })

    if (isAINext) {
      setTimeout(() => this.takeTurn(false, false), 1500)
    }
  }

  aiMove = () => {
    if (this.props.difficulty === 1) {
      return this.easyDiff()
    } else if (this.props.difficulty === 2) {
      return this.mediumDiff()
    } else if (this.props.difficulty === 3) {
      return this.hardDiff()
    }
  }

  easyDiff = () => {
    return this.getRandomSquare()
  }

  getRandomSquare = () => {
		var coords = [randInt(0, this.props.boardSize), randInt(0, this.props.boardSize)];

		while (this.state.playerGrid[coords[0]][coords[1]].isHit) {
			coords[0] = randInt(0, this.props.boardSize)
			coords[1] = randInt(0, this.props.boardSize)
		}

		return coords;
	}

  render() {
    return (
      <div>
          <Board playerBoard = {true} boardSize = {this.props.boardSize} port = {this.props.port} startGame = {this.startGame} takeTurn = {this.takeTurn} grid = {this.state.grid} />
          <Board playerBoard = {false} boardSize = {this.props.boardSize} port = {this.props.port} disableButtons =  {this.state.AITurn} takeTurn = {this.takeTurn} />
      </div>
    )
  }
}

function randInt(min , max) {
  let random_number = Math.random() * (max-min) + min;
  return Math.floor(random_number);
}

async function wait(ms) {
  await sleep(ms)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default Game;
