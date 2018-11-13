import React, { Component } from 'react';
import Square from './Square.js'
import './main.css'



class Board extends Component {
  constructor(props) {
    super(props);

    var grid = [];

    for (var x = 0; x < 10; x++) {
      grid.push([])
      for (var y = 0; y < 10; y++) {
        grid[x].push('')
      }
    }

    this.state = ({
      grid: grid
    })
  }

  componentDidMount = () => {
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        var newGrid = this.state.grid
        newGrid[i][j] = {square: <Square onClick={this.hit} coords = {{x: i, y: j}} isHit = {false} shipHere = {true}/>, shipHere: false};
        this.setState({
          grid: newGrid
        })
      }
    }
  }


  hit = (x, y) => {
    var newGrid = this.state.grid
    var shipHere = this.state.grid[x][y].shipHere
    newGrid[x][y].square = <Square onClick = {this.hit} coords = {{x: x, y: y}} isHit = {true} shipHere = {shipHere} />
    this.setState({
      grid: newGrid
    })
  }

  render() {

    var rows = [];
    for (var i = 0; i < 10; i++) {
      var row = [];
      for (var j = 0; j< 10; j++) {
        row.push(this.state.grid[i][j].square)
      }
      rows.push(<div className = 'board-row'>{row}</div>);
    }
    return (
      <div>{rows}</div>
    );
  }
}

export default Board;
