import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';
import cn from 'classnames';
import { EnhanceWithConfirmation } from './Popup.js';

export class Icon extends Component {
  static propTypes = {
    fa: PropTypes.string.isRequired,
    color: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    className: PropTypes.string,
    label: PropTypes.string,
  };

  render() {
    const {fa, color, style, onClick, className, label, ...props} = this.props;
    var realClick = onClick;
    if (typeof onClick === 'string') {
      realClick = () => {
        browserHistory.push(onClick);
      };
    }

    return (
      <i
        {...props}
        className={cn(fa, className, {clickable: !!onClick})}
        onClick={realClick}
        style={{color: color, ...style}}
      >
        {label ? <span style={{marginLeft: 6}}>{label}</span> : null}
      </i>
    );
  }
}

export const SpinnerIcon = ({...props}) => (
  <Icon fa="fa fa-spinner fa-pulse fa-2x fa-fw" {...props} />
);

export const DeleteIcon = ({...props}) => (
  <Icon fa="fa fa-minus-circle fa-2x" color="#CC1100" {...props} />
);

export const AddIcon = ({...props}) => {
  return <Icon fa="fa fa-plus fa-2x" color="#FF8C00" {...props} />;
};

export const EditIcon = ({...props}) => {
  return <Icon fa="fa fa-pencil-square-o fa-2x" {...props} />;
};

export const ConfirmedDeleteIcon = EnhanceWithConfirmation(DeleteIcon);
