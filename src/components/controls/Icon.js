import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import ReactTooltip from 'react-tooltip';
import cn from 'classnames';
import { EnhanceWithConfirmation, EnhanceWithBusySpinner } from '../enhancers/index.js';
import t from '../../trans.js';

export class Icon extends Component {
  static propTypes = {
    fa: PropTypes.string.isRequired,
    color: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    className: PropTypes.string,
    label: PropTypes.string,
    title: PropTypes.string,
  };

  render() {
    const {fa, color, style, onClick, className, label, title, ...props} = this.props;
    var realClick = onClick;
    if (typeof onClick === 'string') {
      realClick = () => {
        browserHistory.push(onClick);
      };
    }

    const FinalIcon = (
      <i
        {...props}
        className={cn(fa, className, {clickable: !!onClick})}
        onClick={realClick}
        style={{color: color, ...style}}
      >
        {label ? <span style={{marginLeft: 6}}>{label}</span> : null}
      </i>
    );

    if (title) {
      return (
        <div style={{display: 'inline'}} data-tip={title}>
          <ReactTooltip />
          {FinalIcon}
        </div>
      );
    }

    return FinalIcon;
  }
}

export const VerifyIcon = ({...props}) => (
  <Icon fa="fa fa-check fa-2x" color="green" {...props} />
);
export const BusyVerifyIcon = connect(state => ({isBusy: state.app.isBusy}))(EnhanceWithBusySpinner(VerifyIcon));

export const SpinnerIcon = ({...props}) => (
  <Icon fa="fa fa-spinner fa-pulse fa-2x fa-fw" {...props} />
);

export const DeleteIcon = ({...props}) => (
  <Icon fa="fa fa-minus-circle fa-2x" color="#CC1100" title={t('delete')} {...props} />
);

export const AddIcon = ({...props}) => {
  return <Icon fa="fa fa-plus fa-2x" color="#FF8C00" {...props} />;
};

export const EditIcon = ({...props}) => {
  return <Icon fa="fa fa-pencil-square-o fa-2x" title={t('edit')} {...props} />;
};

export const ConfirmedDeleteIcon = EnhanceWithConfirmation(DeleteIcon);
