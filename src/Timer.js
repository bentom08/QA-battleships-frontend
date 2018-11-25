import React, { Component } from 'react';

class Timer extends Component {
  state = {
    status: false,
    runningTime: 0
  };
  toggleTimer = () => {
    this.setState(state => {
      if (state.status) {
        clearInterval(this.timer);
      } else {
        const startTime = Date.now() - this.state.runningTime;
        this.timer = setInterval(() => {
          this.setState({
            runningTime: Date.now() - startTime
          });
        });
      }
      return { status: !state.status };
    });
  };

  handleReset = () => {
    this.setState({ runningTime: 0, status: false });
  };

  render() {
    const { status, runningTime } = this.state;
    return (
      <div className = "timer">
        <b>{leftPad(Math.floor(runningTime/60000), 2)}:{leftPad(Math.floor((runningTime/1000)%60), 2)}</b>
      </div>
    );
  }
}

function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

export default Timer;
