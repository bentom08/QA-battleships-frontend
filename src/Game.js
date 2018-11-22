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

      var removeShip = true
      if (shipHere === true) {
        for (var i = 0; i < this.props.boardSize; i++) {
          for (var j = 0; j< this.props.boardSize; j++) {
            if (newGrid[i][j].shipID === newGrid[coords[0]][coords[1]].shipID && newGrid[i][j].isHit === false) {
              removeShip = false
            }
          }
        }
      } else {
        removeShip = false
      }

      this.setState({
        playerGrid: newGrid
      })

      if (removeShip) {
        this.sinkShip(newGrid[coords[0]][coords[1]].shipID)
      }
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

  sinkShip = (id) => {
    var newGrid
    for (var i = 0; i < this.props.boardSize; i++) {
      for (var j = 0; j< this.props.boardSize; j++) {
        if (this.state.playerGrid[i][j].shipID === id) {
          newGrid[i][j].shipSunk = true
        }
      }
    }

    this.setState({
      playerGrid: newGrid
    })
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

  mediumDiff = () => {
    var hitSquares = this.getUnsunkSquares()

    if (hitSquares.length === 0) {
      return this.getRandomSquare()
    } else {
      return this.getAdjacentSquare(hitSquares)
    }
  }

  getAdjacentSquare = (hitSquares) => {
    var coords = [-1, -1]
    var i = 0
    while (true) {
      var direction = randInt(0, 4)
      console.log(direction)
      if (direction === 0) {
          coords[0] = hitSquares[i][0] + 1
          coords[1] = hitSquares[i][1]
      } else if (direction === 1) {
          coords[0] = hitSquares[i][0]
          coords[1] = hitSquares[i][1] + 1
      } else if (direction === 2) {
          coords[0] = hitSquares[i][0] - 1
          coords[1] = hitSquares[i][1]
      } else {
          coords[0] = hitSquares[i][0]
          coords[1] = hitSquares[i][1] - 1
      }
      console.log(coords)

      if (coords[0] >= 0 && coords[1] >= 0 && coords[0] < this.props.boardSize && coords[1] < this.props.boardSize && !this.state.playerGrid[coords[0]][coords[1]].isHit) {
				break;
			}
      break
    }

    return coords
  }

  getUnsunkSquares = () => {
    var coordsArray = [];

    for (var i = 0; i < this.props.boardSize; i++) {
      for (var j = 0; j< this.props.boardSize; j++) {
        if (!this.state.playerGrid[i][j].shipSunk && this.state.playerGrid[i][j].isHit && this.state.playerGrid[i][j].shipConfirm) {
          coordsArray.push([i, j])
        }
      }
    }

    return coordsArray
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
