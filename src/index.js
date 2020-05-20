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

class Board extends React.Component {
  renderSquare(player, i) {
    return(
        <Square
          value={this.props.bingo[i]}
          isActive={this.props.isActive[i]}
          onClick={() => this.props.onClick(player, i)}
        />
    )
  }

  renderSquareRow(player, row) {
    let rowSize = this.props.size;
    let renderRow = [];
    for(let i = 0; i < rowSize; i++) {
      renderRow.push(this.renderSquare(player, row * rowSize+i));
    }
    return(renderRow)
  }

  render() {
    const renderBoard = [];
    for(let row = 0; row < this.props.size; row++) {
      renderBoard.push((
        <div className="bingoRow">
          {this.renderSquareRow(this.props.player, row)}
        </div>
      ))
    }
    return(
      renderBoard
    )
  }
}

class Game extends React.Component{
  constructor(props) {
    super(props);
    const allBingo = initializePlayerBoard(this.props.player, this.props.size);
    this.state = {
      player: this.props.player,
      size: this.props.size,
      bingo: allBingo,
      bingoIndexLookup: initializePlayerBoardLookup(allBingo),
      isActive: initializePlayerBoardState(this.props.player, this.props.size),
      nextPlayer: 0,
      turn: 0,
      maxTurn: this.props.size * this.props.size,
      playerScore: Array(this.props.player).fill(0),
    }
  }

  handleClick(player, i) {
    if(player !== this.state.nextPlayer || 
      this.state.turn >= this.state.maxTurn ||
      this.state.isActive[player][i] === true) return;

    const activeValue = this.state.bingo[player][i] - 1;
    const isActive = [];
    const playerScore = [];
    for(let p = 0; p < this.state.player; p++) {
      const playerActiveState = this.state.isActive[p].slice();
      let playerActiveValueIndex = this.state.bingoIndexLookup[p][activeValue];
      playerActiveState[playerActiveValueIndex] = true;
      isActive.push(playerActiveState);
      let score = calculatePlayerScore(playerActiveState, this.state.size);
      playerScore.push(score);
    }



    this.setState({
      isActive: isActive,
      nextPlayer: (this.state.nextPlayer + 1) % this.state.player,
      turn: this.state.turn+1,
      playerScore: playerScore,
    })
  }


  render() {
    const gameBoard = this.state.bingo.map((squares, player) => {
      let className = 'bingoBoard';
      if(player === this.state.nextPlayer) {
        className += ' bingoPlayerTurn';
      }
      return(
        <div className={className}>
          Player #{player}, Score={this.state.playerScore[player]}
          <Board 
          size={this.state.size}
          bingo={this.state.bingo[player]}
          isActive={this.state.isActive[player]}
          onClick={(e, i) => this.handleClick(player, i)}
          />
        </div>
      )
    })
    return(
      <div>
        <h1>Next player {this.state.nextPlayer}</h1>
        {gameBoard}
      </div>
    )
  }
}


ReactDOM.render(
  <Game size={5} player={2} winnerRule={3}/>,
  document.getElementById('root')
);


function shuffle(old_array) {
  const array = old_array.slice();
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function initializePlayerBoard(player, boardLineSize) {
  let bingo = Array(boardLineSize * boardLineSize).fill(0)
              .map((e, i) => i + 1);
  let playerBoard = [];
  for(let i = 0; i < player; i++) {
    const shuffled_bingo = shuffle(bingo);
    playerBoard.push(shuffled_bingo);
  }
  return playerBoard;
}
function initializePlayerBoardLookup(allBingo) {
  const allbingoIndexLookup = [];
  for(let i = 0; i < allBingo.length; i++) {
    const bingo = allBingo[i].slice();
    const bingoIndexLookup = [];
    for(let j = 0; j < allBingo[i].length; j++) {
      bingoIndexLookup[bingo[j] - 1] = j;
    }
    allbingoIndexLookup.push(bingoIndexLookup);
  }
  return allbingoIndexLookup;
}
function initializePlayerBoardState(player, boardLineSize) {
  let isActive = Array(boardLineSize*boardLineSize).fill(false);
  let activeArray = [];
  for(let i = 0; i < player; i++) {
    activeArray.push(isActive);
  }
  return activeArray;
}

function getWinIndex(boardLineSize) {
  let winIndexArray = [];
  // row
  for(let i = 0; i < boardLineSize; i++) {
    let rowArray = [];
    for(let j = 0; j < boardLineSize; j++) {
      rowArray.push(i * boardLineSize + j);
    }
    winIndexArray.push(rowArray);
  }

  // col
  for(let i = 0; i < boardLineSize; i++) {
    let colArray = [];
    for(let j = 0; j < boardLineSize; j++) {
      colArray.push(j * boardLineSize + i);
    }
    winIndexArray.push(colArray);
  }

  // cross line
  let crossLine = [];
  for(let i = 0; i < boardLineSize; i++) {
    crossLine.push(i + boardLineSize * i);
  }
  winIndexArray.push(crossLine);

  let crossLine2 = [];

  for(let i = 0; i < boardLineSize; i++) {
    crossLine2.push((boardLineSize - 1) + (boardLineSize - 1) * i);
  }
  winIndexArray.push(crossLine2);

  return winIndexArray;
}

function calculateWinner(player, activeState) {
  let rowLength = activeState[0].length;
  const winIndexArray = getWinIndex(rowLength);
  for(let i = 0; i < player; i++) {
  }
}

function calculatePlayerScore(activeBoard, boardLineSize) {
  const winIndexArray = getWinIndex(boardLineSize);
  let score = 0;
  for(let i = 0; i < winIndexArray.length; i++) {
    let connect = true;
    for(const j of winIndexArray[i]) {
      connect &= activeBoard[j];
    }
    if(connect) score++;
  }
  return score;
}