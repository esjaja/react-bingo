import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './sass/style.sass';
import Game from './component/Game';

class GameStarter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      player: this.props.player,
      size: this.props.size,
      winnerRule: this.props.winnerRule,
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit(event) {
    this.setState({
      submitted: true,
    })
    event.preventDefault();
  }

  render() {
    return (
      <div>
      <form onSubmit={this.handleSubmit}>
      <label>
          Player Number:
          <input
            name="player"
            type="number"
            value={this.state.player}
            onChange={this.handleChange} />
        </label>        
        <label>
          Borad Line Size: 
          <input
            name="size"
            type="number"
            value={this.state.size}
            onChange={this.handleChange} />
        </label>        
        <label>
          {'Winner Score ( <= ' + (this.state.size*2 + 2) + ' )'}: 
          <input
            name="winnerRule"
            type="number"
            value={this.state.winnerRule}
            onChange={this.handleChange} />
        </label>
        <input className='submitButton' type="submit" value="Submit"/>
      </form>        
      {this.state.submitted && <Game 
        size={this.state.size} 
        player={this.state.player} 
        winnerRule={this.state.winnerRule}
        />
      }
      </div>
    );
  }
}

ReactDOM.render(
  <GameStarter size={5} player={2} winnerRule={3}/>,
  document.getElementById('root')
);





