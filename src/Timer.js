import React, { Component } from 'react';

class Timer extends Component {
  state = {
    status: false,
    runningTime: 0
  };
  startTimer = () => {
    this.setState(state => {
      if (state.status) {
        clearInterval(this.timer);
      } else {
        const startTime = Date.now() - this.state.runningTime;
        this.timer = setInterval(() => {
          this.setState({ runningTime: Date.now() - startTime });
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
      <div>
        <p>{runningTime/1000}s</p>
      </div>
    );
  }
}

export default Timer;
