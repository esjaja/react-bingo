import React from 'react';
import '../sass/style.sass';

export default class Square extends React.Component{
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
          onClick={this.props.onClick}> 
          {this.props.value} 
        </div>
      )
    }
  }