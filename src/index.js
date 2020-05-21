import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './sass/style.sass';

class Square extends React.Component{
  render() {
    let className = 'bingoBlock';
    if(this.props.blockState >= 1) {
      className += ' bingoClick';
    }
    if(this.props.blockState === 2) {
      className += ' active';
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
          blockState={this.props.blockState[i]}
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
    let allBingo = initBingoBoard(this.props.player, this.props.size);
    this.state = {
      bingo: allBingo,
      bingoIndexLookup: initBingoLookup(allBingo),
      blockState: initState(this.props.player, this.props.size),
      nextPlayer: 0,
      playerScore: initScore(this.props.player),
    }
  }

  getBoardLookupIndexByValue(player, value) {
    return this.state.bingoIndexLookup[player][value];
  }

  handleClick(player, index) {

    const winner = this.state.playerScore.find((score) => 
      score >= this.props.winnerRule
    );


    if(player !== this.state.nextPlayer || 
      this.state.blockState[player][index] >= 1
      || winner) return;

    const clickedNumber = this.state.bingo[player][index] - 1;
    const blockState = [];
    const playerScore = [];
    for(let p = 0; p < this.props.player; p++) {
      let lookupIndex = this.getBoardLookupIndexByValue(p, clickedNumber);
      const playerBoardState = this.state.blockState[p].slice();
      playerBoardState[lookupIndex] = 1;
      let score = calculatePlayerScore(playerBoardState, this.props.size);
      blockState.push(playerBoardState);
      playerScore.push(score);
    }
    this.setState({
      blockState: blockState,
      nextPlayer: (this.state.nextPlayer + 1) % this.props.player,
      playerScore: playerScore,
    })
  }


  render() {

    const winner = this.state.playerScore.map((score) => 
      score >= this.props.winnerRule
    );

    const gameBoard = this.state.bingo.map((squares, player) => {
      let className = 'bingoBoard';
      if(winner[player]) {
        className += ' bingoPlayerWin';
      }
      if(player === this.state.nextPlayer && !winner.find(e => e === true)) {
        className += ' bingoPlayerTurn';
      }

      let scoreClass = 'playerScore';
      if(winner[player]) {
        scoreClass += ' active';
      }

      return(
        <div className={className}>
          <div className='bingoPlayerText'>
            <span className='playerNumber'>
              Player #{player}
            </span>
            <span className={scoreClass}>
              {'Score:' + this.state.playerScore[player] +  ' '}
            </span>
          </div>
          <Board 
          size={this.props.size}
          bingo={this.state.bingo[player]}
          blockState={this.state.blockState[player]}
          onClick={(e, i) => this.handleClick(player, i)}
          />
        </div>
      )
    })

    let gameText = 'Next player ' + this.state.nextPlayer;
    if(winner.find(t=> t === true)) {
      gameText = 'Congrats!! Winner: player ';
      winner.map((val, ind) => {
        if(val === true) gameText += '#' + ind + ' ';
      })
    }


    return(
      <div className="game">
        <h1>{gameText}</h1>
        {gameBoard}
      </div>
    )
  }
}

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


function shuffle(old_array) {
  const array = old_array.slice();
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function initBingoBoard(player, boardLineSize) {
  let bingo = Array(boardLineSize * boardLineSize).fill(0)
              .map((e, i) => i + 1);
  const playerBoard = [];
  for(let i = 0; i < player; i++) {
    const shuffled_bingo = shuffle(bingo);
    playerBoard.push(shuffled_bingo);
  }
  return playerBoard;
}
function initBingoLookup(allBingo) {
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
function initState(player, boardLineSize) {
  let blockState = Array(boardLineSize*boardLineSize).fill(0);
  let activeArray = [];
  for(let i = 0; i < player; i++) {
    activeArray.push(blockState);
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

function calculatePlayerScore(activeBoard, boardLineSize) {
  const winIndexArray = getWinIndex(boardLineSize);
  let score = 0;
  for(let i = 0; i < winIndexArray.length; i++) {
    let connect = true;
    for(const j of winIndexArray[i]) {
      connect &= (activeBoard[j] >= 1? true: false);
    }
    if(connect) {
      score++;
      for(const j of winIndexArray[i]) {
        activeBoard[j] = 2;
      }
    }
  }
  return score;
}

function initScore(player) {
  let playerScore = new Array(player).fill(0);
  for(let i = 0; i < player; i++) playerScore[i] = 0;
  return playerScore;
}