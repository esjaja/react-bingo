import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './sass/style.sass';

class Square extends React.Component{
  render() {
    let className = 'bingoBlock';
    if(this.props.isActive) {
      className += ' bingoClick';
    }
    return (
      <div 
      className={className}
      onClick={() => this.props.onClick()}> 
      {this.props.value} 
      </div>
    )
  }
}

class Game extends React.Component{
  constructor(props) {
    super(props);
    const allBingo = this.initializePlayerBoard();
    this.state = {
      player: this.props.player,
      size: this.props.size,
      bingo: allBingo,
      key: this.initializePlayerBoardKey(allBingo),
      isActive: this.initializePlayerBoardState(),
      nextPlayer: 0,
      turn: 0,
      maxTurn: this.props.size * this.props.size,
    }
  }

  initializePlayerBoard() {
    let bingo = Array(this.props.size * this.props.size).fill(0)
                .map((e, i) => i + 1);
    let playerBoard = [];
    for(let i = 0; i < this.props.player; i++) {
      const shuffled_bingo = shuffle(bingo);
      playerBoard.push(shuffled_bingo);
    }
    return playerBoard;
  }

  initializePlayerBoardKey(allBingo) {
    const allKey = [];
    for(let i = 0; i < allBingo.length; i++) {
      const bingo = allBingo[i].slice();
      const key = [];
      for(let j = 0; j < allBingo[i].length; j++) {
        key[bingo[j] - 1] = j;
      }
      allKey.push(key);
    }
    return allKey;
  }

  initializePlayerBoardState() {
    let isActive = Array(this.props.size*this.props.size).fill(false);
    let activeArray = [];
    for(let i = 0; i < this.props.player; i++) {
      activeArray.push(isActive);
    }
    return activeArray;
  }

  handleClick(player, i) {
    if(player !== this.state.nextPlayer || this.state.turn >= this.state.maxTurn) return;
    const activeValue = this.state.bingo[player][i] - 1;
    const isActive = [];
    for(let p = 0; p < this.state.player; p++) {
      const playerActiveState = this.state.isActive[p].slice();
      let playerActiveValueIndex = this.state.key[p][activeValue];
      if(playerActiveState[playerActiveValueIndex]) return;
      playerActiveState[playerActiveValueIndex] = true;
      isActive.push(playerActiveState);
    }

    this.setState({
      isActive: isActive,
      nextPlayer: (this.state.nextPlayer + 1) % this.state.player,
      turn: this.state.turn+1,
    })
  }

  renderSquare(player, i) {
    return(
        <Square
          value={this.state.bingo[player][i]}
          isActive={this.state.isActive[player][i]}
          onClick={() => this.handleClick(player, i)}
        />
    )
  }

  renderSquareRow(player, row) {
    let rowSize = this.state.size;
    let renderRow = [];
    for(let i = 0; i < rowSize; i++) {
      renderRow.push(this.renderSquare(player, row*rowSize+i));
    }
    return(renderRow)
  }

  renderBoard(player) {
    let renderBoard = [];
    for(let i = 0; i < this.state.size; i++) {
      renderBoard.push((
        <div className="bingoRow">
          {this.renderSquareRow(player, i)}
        </div>
      ))
    }
    let className = 'bingoBoard';
    if(player === this.state.nextPlayer) {
      className += ' bingoPlayerTurn';
    }
    return(
      <div className={className}>
        Player #{player}
        {renderBoard}
      </div>
    )
  }

  render() {
    let gameBoard = [];
    for(let i = 0; i < this.state.player; i++) {
      gameBoard.push(this.renderBoard(i));
    }
    return(
      <div>
        <h1>Next player {this.state.nextPlayer}</h1>
        {gameBoard}
      </div>
    )
  }
}





ReactDOM.render(
  <Game size={4} player={3}/>,
  document.getElementById('root')
);


function shuffle(old_array) {
  const array = old_array.slice()
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}