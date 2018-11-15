import React, { Component } from 'react';

class Square extends Component {
  hit = () => {
    if (this.props.playerBoard === false) {
      if (this.props.isHit === false) {
        this.props.onClick(this.props.coords.x, this.props.coords.y, this.props.shipHere)
      }
    } else {
      this.props.onClick(this.props.coords.x, this.props.coords.y, this.props.shipHere)
    }
  }

  render() {
    var square;
    if ((this.props.isHit && this.props.shipHere) || (this.props.shipHere && this.props.playerBoard)) {
      square = <button id = 'sqaure' className='hit' onClick = {this.hit}></button>
    } else if (this.props.isHit && !this.props.shipHere && !this.props.playerBoard) {
      square = <button id = 'sqaure' className='miss' onClick = {this.hit}></button>
    } else {
      square = <button id = 'sqaure' className='sea' onClick = {this.hit}></button>
    }

    return (
      square
    )
  }
}

export default Square
