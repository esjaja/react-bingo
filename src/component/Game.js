import React from 'react';
import Board from './Board';

function PlayerScore(props) {
    return (
        <div className='bingoPlayerText'>
            <span className='playerNumber'>
                Player #{props.player}
            </span>
            <span className={props.playerClass}>
                {'Score:' + props.playerScore + ' '}
            </span>
        </div>
    )
}


export default class Game extends React.Component {
    constructor(props) {
        super(props);
        let allBingo = initBingoBoard(this.props.player, this.props.size);
        this.state = {
            player: this.props.player,
            size: this.props.size,
            winnerRule: this.props.winnerRule,
            bingo: allBingo,
            bingoIndexLookup: initBingoLookup(allBingo),
            blockState: initState(this.props.player, this.props.size),
            nextPlayer: 0,
            playerScore: initScore(this.props.player),
        }
        this.handleClick.bind(this);
    }

    getBoardLookupIndexByValue(player, value) {
        return this.state.bingoIndexLookup[player][value];
    }

    handleClick(player, index) {
        const winner = this.state.playerScore.find((score) =>
            score >= this.state.winnerRule
        );

        if (player !== this.state.nextPlayer ||
            this.state.blockState[player][index] >= 1
            || winner) return;

        const clickedNumber = this.state.bingo[player][index] - 1;
        const blockState = [];
        const playerScore = [];
        for (let p = 0; p < this.state.player; p++) {
            let lookupIndex = this.getBoardLookupIndexByValue(p, clickedNumber);
            const playerBoardState = this.state.blockState[p].slice();
            playerBoardState[lookupIndex] = 1;
            let score = calculatePlayerScore(playerBoardState, this.state.size);
            blockState.push(playerBoardState);
            playerScore.push(score);
        }
        this.setState({
            blockState: blockState,
            nextPlayer: (this.state.nextPlayer + 1) % this.state.player,
            playerScore: playerScore,
        })
    }


    render() {

        const winner = this.state.playerScore.map((score) =>
            score >= this.state.winnerRule
        );

        const gameBoard = this.state.bingo.map((squares, player) => {
            let className = 'bingoBoard';
            if (winner[player]) {
                className += ' bingoPlayerWin';
            }
            if (player === this.state.nextPlayer && !winner.find(e => e === true)) {
                className += ' bingoPlayerTurn';
            }

            let scoreClass = 'playerScore';
            if (winner[player]) {
                scoreClass += ' active';
            }

            return (
                <div
                    className={className}>
                    <PlayerScore
                        player={player}
                        playerClass={scoreClass}
                        playerScore={this.state.playerScore[player]}
                    />
                    <Board 
                        key={''+player}
                        size={this.state.size}
                        bingo={this.state.bingo[player]}
                        blockState={this.state.blockState[player]}
                        onClick={(e, i) => this.handleClick(player, i)}
                    />
                </div>
            )
        })

        let gameText = 'Next player ' + this.state.nextPlayer;
        if (winner.find(t => t === true)) {
            gameText = 'Congrats!! Winner: player ';
            // eslint-disable-next-line array-callback-return
            winner.map((val, ind) => {
                if (val === true) {
                    gameText += '#' + ind + ' ';
                }
            })
        }


        return (
            <div className="game">
                <h1>{gameText}</h1>
                {gameBoard}
            </div>
        )
    }
}






function calculatePlayerScore(activeBoard, boardLineSize) {
    const winIndexArray = getWinIndex(boardLineSize);
    let score = 0;
    for (let i = 0; i < winIndexArray.length; i++) {
        let connect = true;
        for (const j of winIndexArray[i]) {
            connect &= (activeBoard[j] >= 1 ? true : false);
        }
        if (connect) {
            score++;
            for (const j of winIndexArray[i]) {
                activeBoard[j] = 2;
            }
        }
    }
    return score;
}

function initScore(player) {
    let playerScore = new Array(player).fill(0);
    for (let i = 0; i < player; i++) playerScore[i] = 0;
    return playerScore;
}

function initBingoBoard(player, boardLineSize) {
    let bingo = Array(boardLineSize * boardLineSize).fill(0)
        .map((e, i) => i + 1);
    const playerBoard = [];
    for (let i = 0; i < player; i++) {
        const shuffled_bingo = shuffle(bingo);
        playerBoard.push(shuffled_bingo);
    }
    return playerBoard;
}
function initBingoLookup(allBingo) {
    const allbingoIndexLookup = [];
    for (let i = 0; i < allBingo.length; i++) {
        const bingo = allBingo[i].slice();
        const bingoIndexLookup = [];
        for (let j = 0; j < allBingo[i].length; j++) {
            bingoIndexLookup[bingo[j] - 1] = j;
        }
        allbingoIndexLookup.push(bingoIndexLookup);
    }
    return allbingoIndexLookup;
}
function initState(player, boardLineSize) {
    let blockState = Array(boardLineSize * boardLineSize).fill(0);
    let activeArray = [];
    for (let i = 0; i < player; i++) {
        activeArray.push(blockState);
    }
    return activeArray;
}

function getWinIndex(boardLineSize) {
    let winIndexArray = [];
    // row
    for (let i = 0; i < boardLineSize; i++) {
        let rowArray = [];
        for (let j = 0; j < boardLineSize; j++) {
            rowArray.push(i * boardLineSize + j);
        }
        winIndexArray.push(rowArray);
    }

    // col
    for (let i = 0; i < boardLineSize; i++) {
        let colArray = [];
        for (let j = 0; j < boardLineSize; j++) {
            colArray.push(j * boardLineSize + i);
        }
        winIndexArray.push(colArray);
    }

    // cross line
    let crossLine = [];
    for (let i = 0; i < boardLineSize; i++) {
        crossLine.push(i + boardLineSize * i);
    }
    winIndexArray.push(crossLine);

    let crossLine2 = [];

    for (let i = 0; i < boardLineSize; i++) {
        crossLine2.push((boardLineSize - 1) + (boardLineSize - 1) * i);
    }
    winIndexArray.push(crossLine2);

    return winIndexArray;
}


function shuffle(old_array) {
    const array = old_array.slice();
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}