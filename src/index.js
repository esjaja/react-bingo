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
      submitted: false,
      game: () => <Game 
        size={this.state.size} 
        player={this.state.player} 
        winnerRule={this.state.winnerRule}
        />
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
    event.preventDefault();
    this.setState({
      game: () => <Game 
      size={this.state.size} 
      player={this.state.player} 
      winnerRule={this.state.winnerRule}
      />
    })
  }

  render() {
    const ActiveGame = this.state.game;
    return (
      <div>
      <form onSubmit={this.handleSubmit}>
      <label>
          Player Number:
          <input
            name="player"
            type="number"
            min="1"
            value={this.state.player}
            onChange={this.handleChange} />
        </label>        
        <label>
          Borad Line Size: 
          <input
            name="size"
            type="number"
            min="1"
            value={this.state.size}
            onChange={this.handleChange} />
        </label>        
        <label>
          {'Winner Score ( 1 ~ ' + (this.state.size*2 + 2) + ' )'}: 
          <input
            name="winnerRule"
            type="number"
            min="1"
            max={(this.state.size*2 + 2)}
            value={this.state.winnerRule}
            onChange={this.handleChange} />
        </label>
        <input className='submitButton' type="submit" value="Start New Game"/>
      </form>        
      {
        <ActiveGame/>
      }
      </div>
    );
  }
}

ReactDOM.render(
  <GameStarter size={5} player={2} winnerRule={3}/>,
  document.getElementById('root')
);





