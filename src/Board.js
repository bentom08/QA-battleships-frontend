import React, { Component } from 'react';
import Square from './Square.js'
import './main.css'

var direction;

class Board extends Component {
  constructor(props) {
    super(props);

    var grid = [];

    for (var x = 0; x < this.props.boardSize; x++) {
      grid.push([])
      for (var y = 0; y < this.props.boardSize; y++) {
        grid[x].push('')
      }
    }

    this.state = ({
      grid: grid,
      shipsToPlace: [5, 4, 4, 3, 3, 2]
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

  componentDidMount = () => {
    var newGrid = this.state.grid
    for (var i = 0; i < this.props.boardSize; i++) {
      for (var j = 0; j < this.props.boardSize; j++) {
        newGrid[i][j] = {square: <Square onClick={this.placeShip} coords = {{x: i, y: j}} isHit = {false} shipHere = {false} playerBoard = {this.props.playerBoard}/>, shipHere: false, shipConfirm: false};
      }
    }
    this.setState({
      grid: newGrid
    })
  }

  checkValidPlacement = (x, y) => {
    var invalidPlacement = true
    while (invalidPlacement) {
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
  }

  renderShip = (x, y, shipHere) => {
    var newGrid = this.state.grid
    for (var i = 0; i < this.state.shipsToPlace[0]; i++) {
      if (direction === 0) {
        newGrid[x + i][y].square = <Square onClick = {this.placeShip} coords = {{x: x + i, y: y}} isHit = {true} shipHere = {true} playerBoard = {this.props.playerBoard} />
        newGrid[x + i][y].shipHere = true
      } else if (direction === 1) {
        newGrid[x][y + i].square = <Square onClick = {this.placeShip} coords = {{x: x, y: y + i}} isHit = {true} shipHere = {true} playerBoard = {this.props.playerBoard} />
        newGrid[x][y + i].shipHere = true
      } else if (direction === 2) {
        newGrid[x - i][y].square = <Square onClick = {this.placeShip} coords = {{x: x - i, y: y}} isHit = {true} shipHere = {true} playerBoard = {this.props.playerBoard} />
        newGrid[x - i][y].shipHere = true
      } else if (direction === 3) {
        newGrid[x][y - i].square = <Square onClick = {this.placeShip} coords = {{x: x, y: y - i}} isHit = {true} shipHere = {true} playerBoard = {this.props.playerBoard} />
        newGrid[x][y - i].shipHere = true
      }

      newGrid[x][y].square = <Square onClick = {this.changeDirection} coords = {{x: x, y: y}} isHit = {true} shipHere = {true} playerBoard = {this.props.playerBoard} />
    }
    this.setState({
      grid: newGrid
    })
  }

  placeShip = (x, y, shipHere) => {
    direction = 0

    this.resetBoard()
    this.checkValidPlacement(x, y)
    this.renderShip(x, y, shipHere)
  }

  changeDirection = (x, y, shipHere) => {
    direction++
    if (direction === 4) {
      direction = 0
    }

    this.checkValidPlacement(x, y)
    this.resetBoard()
    this.renderShip(x, y, shipHere)
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
        if (this.state.grid[i][j].shipConfirm === false) {
          console.log(this.state.grid[i][j].shipHere)
          newGrid[i][j].shipConfirm = this.state.grid[i][j].shipHere
        }
      }
    }

    this.setState({
      grid: newGrid
    })
  }

  hit = (x, y, shipHere) => {
    var newGrid = this.state.grid
    newGrid[x][y].square = <Square onClick = {this.hit} coords = {{x: x, y: y}} isHit = {true} shipHere = {shipHere} />
    this.setState({
      grid: newGrid
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
    return (
      <div>
      {rows}
      <button onClick = {this.confirmPlacement}>Place Ship</button>
      </div>
    );
  }
}

export default Board;
