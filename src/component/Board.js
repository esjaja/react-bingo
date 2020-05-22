import React from 'react';
import Square from './Square';

export default class Board extends React.Component {
    renderSquare(i) {
      return(
          <Square
            key={''+i}
            value={this.props.bingo[i]}
            blockState={this.props.blockState[i]}
            onClick={(e) => this.props.onClick(e, i)}
          />
      )
    }
  
    renderSquareRow(row) {
      let rowSize = this.props.size;
      let renderRow = [];
      for(let i = 0; i < rowSize; i++) {
        renderRow.push(this.renderSquare(row * rowSize+i));
      }
      return renderRow;
    }
  
    render() {
      const renderBoard = [];
      for(let row = 0; row < this.props.size; row++) {
        renderBoard.push((
          <div className="bingoRow">
            {this.renderSquareRow(row)}
          </div>
        ))
      }
      return renderBoard;
    }
  }