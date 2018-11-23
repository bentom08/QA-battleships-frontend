import React, { Component } from 'react';
import Square from './Square.js'
import './main.css'
import axios from 'axios'

var direction;
var currentShipID = 1
var shipsPlaced = false
var initShipsToPlace = [5, 4, 4, 3, 3, 2]
var shipDown = false

class Board extends Component {
  constructor(props) {
    super(props);

    var grid = twoDArray(this.props.boardSize);

    this.state = ({
      grid: grid,
      shipsToPlace: initShipsToPlace.slice(),
      disableButtons: this.props.disableButtons,
      message: "",
      startGame: ""
    })
  }

  resetBoard = (func) => {
    var newGrid = this.state.grid
    for (var i = 0; i < this.props.boardSize; i++) {
      for (var j = 0; j < this.props.boardSize; j++) {
        newGrid[i][j].square = <Square onClick={func} coords = {{x: i, y: j}} isHit = {this.state.grid[i][j].isHit} shipHere = {this.state.grid[i][j].shipConfirm} playerBoard = {this.props.playerBoard} />
        newGrid[i][j].shipHere = false
      }
    }
    this.setState({
      grid: newGrid
    })
  }

  clearShips = (func) => {
    var newGrid = this.state.grid
    for (var i = 0; i < this.props.boardSize; i++) {
      for (var j = 0; j < this.props.boardSize; j++) {
        newGrid[i][j] = {square: <Square onClick={func} coords = {{x: i, y: j}} isHit = {false} shipHere = {false} playerBoard = {this.props.playerBoard}/>, shipHere: false, shipConfirm: false, shipID: 0, isHit: false, shipSunk: false};
      }
    }
    this.setState({
      grid: newGrid,
      shipsToPlace: initShipsToPlace.slice(),
      startGame: ""
    })
    currentShipID = 1
  }

  componentDidMount = () => {
    if (this.props.playerBoard) {
      this.clearShips(this.placeShip)
    } else {
      this.clearShips(this.hit)
      for (var i = 0; i < this.state.shipsToPlace.length; i++) {
        this.aiPlacement(i + 1)
      }
    }
  }

  aiDirection = (x, y, id) => {
    var length = this.state.shipsToPlace[id - 1]
    var newGrid = this.state.grid;
    var i;

    while(true) {
      var direction = randInt(0, 4);

			if (direction === 0) {

				if (this.props.boardSize < y + length) {
					continue;
				}

				for (i = 0; i < length; i++) {
					if (this.state.grid[x][y + i].shipConfirm) {
						return false;
					}
				}

				for (i = 0; i < length; i++) {
          newGrid[x][y + i].shipConfirm = true
          newGrid[x][y + i].shipID = id
				}

        this.resetBoard(this.hit)

        this.setState({
          grid: newGrid
        })

				break;

      } else if (direction === 1) {

  			if (y - length + 1 < 0) {
  				continue;
  			}

  			for (i = 0; i < length; i++) {
  				if (this.state.grid[x][y - i].shipConfirm) {
  					return false;
  				}
  			}

  			for (i = 0; i < length; i++) {
          newGrid[x][y - i].shipConfirm = true
          newGrid[x][y - i].shipID = id
  			}

        this.resetBoard(this.hit)

        this.setState({
          grid: newGrid
        })

  			break;

      } else if (direction === 2) {

  			if (x - length + 1 < 0) {
  				continue;
  			}

  			for (i = 0; i < length; i++) {
  				if (this.state.grid[x - i][y].shipConfirm) {
  					return false;
  				}
  			}

  			for (i = 0; i < length; i++) {
          newGrid[x - i][y].shipConfirm = true
          newGrid[x - i][y].shipID = id
  			}

        this.resetBoard(this.hit)

        this.setState({
          grid: newGrid
        })

  			break;

      } else if (direction === 3) {

  			if (this.props.boardSize < x + length) {
  				continue;
  			}

  			for (i = 0; i < length; i++) {
  				if (this.state.grid[x + i][y].shipConfirm) {
  					return false;
  				}
  			}

  			for (i = 0; i < length; i++) {
          newGrid[x + i][y].shipConfirm = true
          newGrid[x + i][y].shipID = id
  			}

        this.resetBoard(this.hit)

        this.setState({
          grid: newGrid
        })

  			break;
      }
    }

    return true;
  }

  aiPlacement = (id) => {
    var x;
    var y;

    var placed = false;

    while(!placed) {
      x = randInt(0, 10)
      y = randInt(0, 10)

      placed = this.aiDirection(x, y, id)
    }
  }

  checkValidPlacement = (x, y) => {
    var invalidPlacement = true
    var n = 1
    while (invalidPlacement) {
      if (n === 4) {
        return false
      }
      n++
      invalidPlacement = false
      if (direction === 0 && x + this.state.shipsToPlace[0] > this.props.boardSize) {
        direction++
        invalidPlacement = true
        continue
      } else if (direction === 1 && y + this.state.shipsToPlace[0] > this.props.boardSize) {
        direction ++
        invalidPlacement = true
        continue
      } else if (direction === 2 && x - this.state.shipsToPlace[0]< -1) {
        direction ++
        invalidPlacement = true
        continue
      } else if (direction === 3 && y - this.state.shipsToPlace[0] < -1) {
        direction = 0
        invalidPlacement = true
        continue
      }

      for (var i = 0; i < this.state.shipsToPlace[0]; i++) {
        if (direction === 0 && this.state.grid[x + i][y].shipConfirm === true) {
          direction++
          invalidPlacement = true
          break
        } else if (direction === 1 && this.state.grid[x][y + i].shipConfirm === true) {
          direction++
          invalidPlacement = true
          break
        } else if (direction === 2 && this.state.grid[x - i][y].shipConfirm === true) {
          direction++
          invalidPlacement = true
          break
        } else if (direction === 3 && this.state.grid[x][y - i].shipConfirm === true) {
          direction = 0
          invalidPlacement = true
          break
        }
      }
    }

    return true
  }

  renderShip = (x, y, shipHere) => {
    var newGrid = this.state.grid
    for (var i = 0; i < this.state.shipsToPlace[0]; i++) {
      if (direction === 0) {
        newGrid[x + i][y].square = <Square onClick = {this.placeShip} coords = {{x: x + i, y: y}} isHit = {false} shipHere = {true} playerBoard = {this.props.playerBoard} />
        newGrid[x + i][y].shipHere = true
      } else if (direction === 1) {
        newGrid[x][y + i].square = <Square onClick = {this.placeShip} coords = {{x: x, y: y + i}} isHit = {false} shipHere = {true} playerBoard = {this.props.playerBoard} />
        newGrid[x][y + i].shipHere = true
      } else if (direction === 2) {
        newGrid[x - i][y].square = <Square onClick = {this.placeShip} coords = {{x: x - i, y: y}} isHit = {false} shipHere = {true} playerBoard = {this.props.playerBoard} />
        newGrid[x - i][y].shipHere = true
      } else if (direction === 3) {
        newGrid[x][y - i].square = <Square onClick = {this.placeShip} coords = {{x: x, y: y - i}} isHit = {false} shipHere = {true} playerBoard = {this.props.playerBoard} />
        newGrid[x][y - i].shipHere = true
      }

      newGrid[x][y].square = <Square onClick = {this.changeDirection} coords = {{x: x, y: y}} isHit = {false} shipHere = {true} playerBoard = {this.props.playerBoard} />
    }
    this.setState({
      grid: newGrid
    })
  }

  placeShip = (x, y, shipHere) => {
    shipDown = true
    if (!shipsPlaced) {
      direction = 0

      this.resetBoard(this.placeShip)
      if (this.checkValidPlacement(x, y)) {
        this.renderShip(x, y, shipHere)
      }
    }
  }

  changeDirection = (x, y, shipHere) => {
    direction++
    if (direction === 4) {
      direction = 0
    }

    this.resetBoard(this.placeShip)
    if (this.checkValidPlacement(x, y)) {
      this.renderShip(x, y, shipHere)
    }
  }

  confirmPlacement = () => {
    if (shipDown === true) {
      var newArray = this.state.shipsToPlace
      newArray.splice(0, 1)
      this.setState({
        shipsToPlace: newArray
      })

      var newGrid = this.state.grid
      for (var i = 0; i < this.props.boardSize; i++) {
        for (var j = 0; j < this.props.boardSize; j++) {
          if (this.state.grid[i][j].shipConfirm === false && this.state.grid[i][j].shipHere === true) {
            newGrid[i][j].shipConfirm = true
            newGrid[i][j].shipID = currentShipID
          }
        }
      }

      this.setState({
        grid: newGrid
      })

      if (this.state.shipsToPlace.length === 0) {
        this.setState({
          startGame: <button onClick = {() => this.props.startGame(this.state.grid)} >Start Game</button>
        })
      }

      currentShipID++
      shipDown = false
    }
  }

  hit = (x, y, shipHere) => {
    if (!this.state.disableButtons) {
      var newGrid = this.state.grid
      newGrid[x][y].square = <Square onClick = {this.hit} coords = {{x: x, y: y}} isHit = {true} shipHere = {shipHere} />
      newGrid[x][y].isHit = true

      var shipSunk = true
      if (shipHere) {
        for (var i = 0; i < this.props.boardSize; i++) {
          for (var j = 0; j< this.props.boardSize; j++) {
            if (newGrid[i][j].shipID === newGrid[x][y].shipID && newGrid[i][j].isHit === false) {
              shipSunk = false
            }
          }
        }
      } else {
        shipSunk = false
      }

      var gameOver = true
      for (i = 0; i < this.props.boardSize; i++) {
        for (var j = 0; j< this.props.boardSize; j++) {
          if (!newGrid[i][j].isHit && newGrid[i][j].shipConfirm) {
            gameOver = false
          }
        }
      }

      if (shipSunk === true) {
        this.setState({
          message: "You Sunk a Ship!"
        })
      } else {
        this.setState({
          message: ""
        })
      }

      this.setState({
        grid: newGrid
      })

      this.props.takeTurn(true, shipHere, gameOver)
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      disableButtons: nextProps.disableButtons
    })

    if (this.props.playerBoard) {
      this.setState({
        grid: nextProps.grid
      })
      this.resetBoard(this.placeShip)
    }


  }

  render() {

    var rows = [];
    for (var i = 0; i < this.props.boardSize; i++) {
      var row = [];
      for (var j = 0; j< this.props.boardSize; j++) {
        row.push(this.state.grid[i][j].square)
      }
      rows.push(<div className = 'board-row'>{row}</div>);
    }
    var buttons;
    if (this.props.playerBoard === true) {
      buttons = <div><button onClick = {this.confirmPlacement}>Place Ship</button>
                  <button onClick = {() => this.clearShips(this.placeShip)}>Clear All Ships</button></div>
    }

    return (
      <div className = 'board'>
      {rows}
      {buttons}
      {this.state.message}
      {this.state.startGame}
      </div>
    );
  }
}

function twoDArray(size) {
  var array = [];

  for (var x = 0; x < size; x++) {
    array.push([])
    for (var y = 0; y < size; y++) {
      array[x].push('')
    }
  }

  return array;
}

  function randInt(min , max) {
    let random_number = Math.random() * (max-min) + min;
    return Math.floor(random_number);
  }

export default Board;
