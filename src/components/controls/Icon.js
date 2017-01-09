import React, { PropTypes, Component } from 'react';
import cn from 'classnames';

export class Icon extends Component {
  static propTypes = {
    fa: PropTypes.string.isRequired,
    color: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    className: PropTypes.string,
  };

  render() {
    const {fa, color, style, onClick, className, ...props} = this.props;
    return (
      <i
        {...props}
        className={cn(fa, className, {
          clickable: !!onClick,
        })}
        onClick={onClick}
        style={{color: color, ...style}}></i>
    );
  }
}