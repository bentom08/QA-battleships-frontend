import React, { Component } from 'react';

class Square extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHit: this.props.isHit,
      shipHere: this.props.shipHere
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      isHit: nextProps.isHit
    })
  }

  hit = () => {
    console.log(this.props.coords.x, this.props.coords.y)
    this.props.onClick(this.props.coords.x, this.props.coords.y)
  }

  render() {
    var square;
    if (this.state.isHit && this.state.shipHere) {
      square = <button id = 'sqaure' className='hit' onClick = {this.hit}></button>
    } else if (this.state.isHit && !this.state.shipHere) {
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
