import React, { Component } from 'react';
import Square from './Square.js'
import './main.css'
import axios from 'axios'

var direction;
var currentShipID = 1
var shipsPlaced = false
var initShipsToPlace = [5, 4, 4, 3, 3, 2]

class Board extends Component {
  constructor(props) {
    super(props);

    var grid = twoDArray(this.props.boardSize);

    this.state = ({
      grid: grid,
      shipsToPlace: initShipsToPlace.slice(),
      disableButtons: this.props.disableButtons,
      message: ""
    })
  }

  resetBoard = () => {
    var newGrid = this.state.grid
    for (var i = 0; i < this.props.boardSize; i++) {
      for (var j = 0; j < this.props.boardSize; j++) {
        newGrid[i][j].square = <Square onClick={this.placeShip} coords = {{x: i, y: j}} isHit = {false} shipHere = {this.state.grid[i][j].shipConfirm} playerBoard = {this.props.playerBoard} />
        newGrid[i][j].shipHere = false
      }
    }
    this.setState({
      grid: newGrid
    })
  }

  clearShips = () => {
    var newGrid = this.state.grid
    for (var i = 0; i < this.props.boardSize; i++) {
      for (var j = 0; j < this.props.boardSize; j++) {
        newGrid[i][j] = {square: <Square onClick={this.placeShip} coords = {{x: i, y: j}} isHit = {false} shipHere = {false} playerBoard = {this.props.playerBoard}/>, shipHere: false, shipConfirm: false, shipID: 0};
      }
    }
    this.setState({
      grid: newGrid,
      shipsToPlace: initShipsToPlace.slice()
    })
    currentShipID = 1
  }

  componentDidMount = () => {
    if (this.props.playerBoard) {
      this.clearShips()
    } else {

      axios.put("http://localhost:"+ this.props.port +"/battleships-1.0/api/battleships/placeAIShips", initShipsToPlace).then((response) => {
        var newGrid = this.state.grid
        for (var i = 0; i < this.props.boardSize; i++) {
          for (var j = 0; j < this.props.boardSize; j++) {
            newGrid[i][j] = {square: <Square onClick={this.hit} coords = {{x: i, y: j}} isHit = {false} shipHere = {response.data[i][j]} playerBoard = {this.props.playerBoard}/>, shipHere: response.data[i][j], shipConfirm: response.data[i][j], shipID: 0};
          }
        }
        this.setState({
          grid: newGrid
        })
      })

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
    if (!shipsPlaced) {
      direction = 0

      this.resetBoard()
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

    this.resetBoard()
    if (this.checkValidPlacement(x, y)) {
      this.renderShip(x, y, shipHere)
    }
  }

  confirmPlacement = () => {
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
      this.props.startGame()
    }

    currentShipID++
  }

  hit = (x, y, shipHere) => {
    if (!this.state.disableButtons) {
      var newGrid = this.state.grid
      newGrid[x][y].square = <Square onClick = {this.hit} coords = {{x: x, y: y}} isHit = {true} shipHere = {shipHere} />
      this.setState({
        grid: newGrid
      })
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      disableButtons: nextProps.disableButtons
    })
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
                  <button onClick = {this.clearShips}>Clear All Ships</button></div>
    }

    return (
      <div className = 'board'>
      {this.state.message}
      {rows}
      {buttons}
      </div>
    );
  }
}

async function wait(ms) {
  await sleep(ms)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
