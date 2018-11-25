import React, { Component } from 'react';
import Board from './Board.js'
import Timer from './Timer.js'
import Stats from './Stats.js'

var previousHit = [-1, -1]
var direction;
var turnsSinceHit = 0

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      AITurn: true,
      playerCoords: [-1, -1],
      opponentCoords: [-1, -1],
      playerGrid: "",
      gameOver: false,
      gameOverMessage: ""
    }
  }

  startGame = (grid) => {
    this.setState({
      AITurn: false,
      playerGrid: grid
    })

    this.refs.timer.toggleTimer()
  }

  endGame = (playerWon) => {
    this.refs.timer.toggleTimer()
  }

  takeTurn = (player, shipHere, gameOver) => {
    if (gameOver) {
      this.setState({
        gameOver: true,
        gameOverMessage: "You Win!"
      })
      this.endGame(true)
    }

    if (!this.state.gameOver) {
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
        setTimeout(() => this.takeTurn(false, false, false), 1500)
        gameOver = true
        for (i = 0; i < this.props.boardSize; i++) {
          for (var j = 0; j< this.props.boardSize; j++) {
            if (!this.state.playerGrid[i][j].isHit && this.state.playerGrid[i][j].shipConfirm) {
              gameOver = false
            }
          }
        }

        if (gameOver) {
          this.setState({
            gameOver: true,
            gameOverMessage: "The Opponent Has Won!"
          })
          this.endGame(false)
        }
      }
    }
  }

  sinkShip = (id) => {
    var newGrid = this.state.playerGrid
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
    } else if (this.props.difficulty === 4) {
      return this.veryHardDiff()
    }
  }

  easyDiff = () => {
    return this.getRandomSquare()
  }

  mediumDiff = () => {
    var hitSquares = this.getUnsunkSquares()

    if (hitSquares.length === 0) {
      previousHit[0] = -1;
      return this.getRandomSquare()
    } else {
      return this.getAdjacentSquare(hitSquares)
    }
  }

  hardDiff = () => {
    var hitSquares = this.getUnsunkSquares();
    var coords = [-1, -1]

		if (hitSquares.length === 0) {
			coords = this.getRandomSquare();
      if (this.state.playerGrid[coords[0]][coords[1]].shipConfirm) {
        turnsSinceHit = 0
      } else {
        turnsSinceHit++
      }
			previousHit[0] = -1;
		} else if (previousHit[0] !== -1) {
			switch (direction) {
				case 0:
					coords[0] = previousHit[0] + 1;
					coords[1] = previousHit[1];
					break;
				case 1:
					coords[0] = previousHit[0] - 1;
					coords[1] = previousHit[1];
					break;
				case 2:
					coords[0] = previousHit[0];
					coords[1] = previousHit[1] + 1;
					break;
				case 3:
					coords[0] = previousHit[0];
					coords[1] = previousHit[1] - 1;
					break;
        default:
          break;
			}

			var reverse = false;
			var reverseNow;


			if (coords[0] >= 0 && coords[1] >= 0 && coords[0] < this.props.boardSize && coords[1] < this.props.boardSize) {
				reverse = !this.state.playerGrid[coords[0]][coords[1]].shipConfirm;
				reverseNow = this.state.playerGrid[coords[0]][coords[1]].isHit;
			} else {
				reverseNow = true;
			}

			var nextHit = [previousHit[0], previousHit[1]];
			previousHit[0] = coords[0];
			previousHit[1] = coords[1];

			if (reverse || reverseNow) {

				try {
					while (this.state.playerGrid[nextHit[0]][nextHit[1]].isHit && this.state.playerGrid[nextHit[0]][nextHit[1]].shipConfirm) {
						switch (direction) {
							case 0:
								nextHit[0] -= 1;
								break;
							case 1:
								nextHit[0] += 1;
								break;
							case 2:
								nextHit[1] -= 1;
								break;
							case 3:
								nextHit[1] += 1;
								break;
              default:
                break;
						}
					}
				} catch {
					previousHit[0] = -1;
					return this.getAdjacentSquare(hitSquares);
				}

				if (this.state.playerGrid[nextHit[0]][nextHit[1]].isHit) {
					previousHit[0] = -1;
					return coords;
				}

				if (reverseNow) {
					coords[0] = nextHit[0];
					coords[1] = nextHit[1];
					previousHit[0] = coords[0];
					previousHit[1] = coords[1];
				}

				switch (direction) {
					case 0:
						if (!reverseNow) {
							previousHit[0] = nextHit[0] + 1;
						}
						direction = 1;
						break;
					case 1:
						direction = 0;
						if (!reverseNow) {
							previousHit[0] = nextHit[0] - 1;
						}
						break;
					case 2:
						direction = 3;
						if (!reverseNow) {
							previousHit[1] = nextHit[1] + 1;
						}
						break;
					case 3:
						direction = 2;
						if (!reverseNow) {
							previousHit[1] = nextHit[1] - 1;
						}
						break;
          default:
            break;
				}
			}
		} else {
			coords = this.getAdjacentSquare(hitSquares);
		}

		return coords;

  }

  veryHardDiff = () => {
    var whenToCheat = randInt(2, 5)
    if (turnsSinceHit >= whenToCheat) {
      var unHitShips = [];
      for (var i = 0; i < this.props.boardSize; i++) {
        for (var j = 0; j< this.props.boardSize; j++) {
          if (this.state.playerGrid[i][j].shipConfirm && !this.state.playerGrid[i][j].isHit) {
            unHitShips.push([i, j])
          }
        }
      }

      turnsSinceHit = 0
      return unHitShips[randInt(0, unHitShips.length)]

    } else {
      return this.hardDiff()
    }
  }

  getAdjacentSquare = (hitSquares) => {
    var coords = [-1, -1]
    var i = randInt(0, hitSquares.length)
    direction = randInt(0, 4)
    var n = 0

    while (true) {
      if (direction === 0) {
          coords[0] = hitSquares[i][0] + 1
          coords[1] = hitSquares[i][1]
      } else if (direction === 1) {
          coords[0] = hitSquares[i][0] - 1
          coords[1] = hitSquares[i][1]
      } else if (direction === 2) {
          coords[0] = hitSquares[i][0]
          coords[1] = hitSquares[i][1] + 1
      } else {
          coords[0] = hitSquares[i][0]
          coords[1] = hitSquares[i][1] - 1
      }

      if (coords[0] >= 0 && coords[1] >= 0 && coords[0] < this.props.boardSize && coords[1] < this.props.boardSize && !this.state.playerGrid[coords[0]][coords[1]].isHit) {
				break;
			} else {
        direction++
        n++
      }

      if (direction > 3) {
        direction = 0
      }

      if (n === 4) {
        i++
        n = 0
      }

      if (i >= hitSquares.length) {
        i = 0
      }
    }

    if (this.state.playerGrid[coords[0]][coords[1]].shipConfirm) {
      previousHit[0] = coords[0]
      previousHit[1] = coords[1]
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
      <div className = 'centered'>
          <p>{this.state.message}</p>
          <h2>{this.state.gameOverMessage}</h2>
          <Timer ref = "timer" />
          <Board playerBoard = {true} boardSize = {this.props.boardSize} port = {this.props.port} startGame = {this.startGame} takeTurn = {this.takeTurn} grid = {this.state.grid} />
          <Board playerBoard = {false} boardSize = {this.props.boardSize} port = {this.props.port} disableButtons =  {this.state.AITurn} takeTurn = {this.takeTurn} />
          <Stats />
      </div>
    )
  }
}

function randInt(min , max) {
  let random_number = Math.random() * (max-min) + min;
  return Math.floor(random_number);
}

export default Game;
