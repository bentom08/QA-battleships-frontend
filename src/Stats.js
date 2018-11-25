import React, { Component } from 'react';
import axios from 'axios'

class Stats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      userStats: [],
      aiStats: [],
      playerStats: false
    }
  }

  componentWillMount = () => {
    this.getAllStats()
  }

  getAllStats = () => {
    axios.get("http://" + this.props.ip + ":" + this.props.port + "/battleships-1.0/api/battleships/getAllGames").then( (response) => {
      this.setState({
        aiStats: eval(response.data)
      })
    })
  }

  getUserStats = () => {
    axios.get("http://" + this.props.ip + ":" + this.props.port + "/battleships-1.0/api/battleships/getUserGames/" + this.state.user).then( (response) => {
      this.setState({
        userStats: eval(response.data)
      })
    })
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      user: nextProps.user
    })

    this.getUserStats()
  }

  changeStats = () => {
    if (this.state.playerStats) {
      this.getAllStats()
    } else {
      this.getUserStats()
    }

    this.setState({
      playerStats: !this.state.playerStats
    })
  }

  splitDiff = (diff, stats) => {
    var games = []
    for (var i = 0; i < stats.length; i++) {
      if (diff === stats[i].difficulty) {
        games.push(stats[i])
      }
    }

    var row = []
    row.push(games.length)

    var wins = 0
    var hits = 0
    var misses = 0
    var time = 0
    for (var i = 0; i < games.length; i++) {
      if (stats === this.state.userStats) {
        hits += games[i].numberOfHits
        misses += games[i].numberOfMisses
      } else {
        hits += games[i].aiHits
        misses += games[i].aiMisses
      }

      time += games[i].time

      if (games[i].gameWon && stats === this.state.userStats) {
        wins++
      } else if (!games[i].gameWon && stats === this.state.aiStats) {
        wins++
      }
    }

    row.push(<td>{((wins/games.length)*100).toFixed(2) + '%'}</td>)
    row.push(<td>{(hits/games.length).toFixed(2)}</td>)
    row.push(<td>{(misses/games.length).toFixed(2)}</td>)
    row.push(<td>{formatTime(time/games.length)}</td>)

    return row
  }

  render() {
    var rows = []
    if (this.state.playerStats) {
      var row = []
      row.push(<td>{this.state.userStats.length}</td>)

      var wins = 0
      var hits = 0
      var misses = 0
      var time = 0
      for (var i = 0; i < this.state.userStats.length; i++) {
        hits += this.state.userStats[i].numberOfHits
        misses += this.state.userStats[i].numberOfMisses
        time += this.state.userStats[i].time

        if (this.state.userStats[i].gameWon) {
          wins++
        }
      }

      row.push(<td>{((wins/this.state.userStats.length)*100).toFixed(2) + '%'}</td>)
      row.push(<td>{(hits/this.state.userStats.length).toFixed(2)}</td>)
      row.push(<td>{(misses/this.state.userStats.length).toFixed(2)}</td>)
      row.push(<td>{formatTime(time/this.state.userStats.length)}</td>)

      rows.push(row)
      rows.push(this.splitDiff(1, this.state.userStats))
      rows.push(this.splitDiff(2, this.state.userStats))
      rows.push(this.splitDiff(3, this.state.userStats))
      rows.push(this.splitDiff(4, this.state.userStats))
    } else {
      var row = []
      row.push(<td>{this.state.aiStats.length}</td>)

      var wins = 0
      var hits = 0
      var misses = 0
      var time = 0
      for (var i = 0; i < this.state.aiStats.length; i++) {
        hits += this.state.aiStats[i].aiHits
        misses += this.state.aiStats[i].aiMisses
        time += this.state.aiStats[i].time

        if (this.state.aiStats[i].gameWon) {
          wins++
        }
      }

      row.push(<td>{((wins/this.state.aiStats.length)*100).toFixed(2) + '%'}</td>)
      row.push(<td>{(hits/this.state.aiStats.length).toFixed(2)}</td>)
      row.push(<td>{(misses/this.state.aiStats.length).toFixed(2)}</td>)
      row.push(<td>{formatTime(time/this.state.aiStats.length)}</td>)

      rows.push(row)
      rows.push(this.splitDiff(1, this.state.aiStats))
      rows.push(this.splitDiff(2, this.state.aiStats))
      rows.push(this.splitDiff(3, this.state.aiStats))
      rows.push(this.splitDiff(4, this.state.aiStats))
    }


    var stats = <table>
                  <tbody>
                      <tr>
                        <th></th><th>Games Played</th><th>Winrate</th><th>Average Hits</th><th>Average Misses</th><th>Average Time</th>
                      </tr><tr>
                        <td><b>Over All Games</b></td>{rows[0]}
                      </tr><tr>
                        <td><b>Very Easy</b></td>{rows[1]}
                      </tr><tr>
                        <td><b>Easy</b></td>{rows[2]}
                      </tr><tr>
                        <td><b>Medium</b></td>{rows[3]}
                      </tr><tr>
                        <td><b>Hard</b></td>{rows[4]}
                      </tr>
                    </tbody>
                  </table>

    return (
      <div className = 'table'>
        <h3>{this.state.playerStats ? 'Player Statistics Table' : 'AI Statistics Table'}</h3><br />
        <button onClick = {this.changeStats}>{this.state.playerStats ? 'AI Stats' : 'Your Stats'}</button>
        {stats}
      </div>
    );
  }
}

function formatTime(time) {
  return leftPad(Math.floor(time/60), 2) + ':' + leftPad(Math.floor(time%60), 2)
}

function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

export default Stats;
