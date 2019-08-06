import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import ReactTooltip from 'react-tooltip';
import cn from 'classnames';
import {EnhanceWithConfirmation, EnhanceWithBusySpinner} from '../enhancers/index.js';
import t from '../../trans.js';

const EnhanceIconWithCenter = ComposedComponent => ({center, ...props}) => {
  if (center) {
    return (
      <div style={{textAlign: 'center'}}>
        <ComposedComponent {...props} />
      </div>
    );
  }
  return <ComposedComponent {...props} />;
};

export const Icon = EnhanceIconWithCenter(class Icon extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    fa: PropTypes.string.isRequired,
    color: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    className: PropTypes.string,
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    title: PropTypes.string,
    size: PropTypes.number,
  };
  static defaultProps = {
    size: 2
  }

  render() {
    const {fa, color, style, onClick, className, label, labelStyle, title, size, ...props} = this.props;
    var realClick = onClick;
    if (typeof onClick === 'string') {
      realClick = () => {
        browserHistory.push(onClick);
      };
    }

    const FinalIcon = (
      <i
        {...props}
        className={cn(fa, `fa-${size}x`, className, {clickable: !!onClick})}
        onClick={realClick}
        style={{color: color, ...style}}
      >
        {label ? <span style={{marginLeft: 6, ...labelStyle}}>{label}</span> : null}
      </i>
    );

    if (title) {
      // TODO: inline doesn't seem to be always working (for example in EditInvoiceLines:Notes th)
      return (
        <div style={{display: 'inline'}} data-tip={title}>
          <ReactTooltip multiline={true} />
          {FinalIcon}
        </div>
      );
    }

    return FinalIcon;
  }
});


export const VerifyIcon = ({...props}) => (
  <Icon fa="fa fa-check" color="green" {...props} />
);
export const BusyVerifyIcon = connect(state => ({isBusy: state.app.isBusy}))(EnhanceWithBusySpinner(VerifyIcon));

export const SpinnerIcon = ({...props}) => (
  <Icon fa="fa fa-spinner fa-pulse fa-fw" {...props} />
);

export const DeleteIcon = ({...props}) => (
  <Icon fa="fa fa-minus-circle" color="#CC1100" title={t('delete')} {...props} />
);

export const AddIcon = ({...props}) => {
  return <Icon fa="fa fa-plus" {...props} />;
};

export const DragAndDropIcon = ({...props}) => {
  return <Icon fa="fa fa-arrows" color="#EEE9E9" data-tst="dnd" {...props} />;
};

export const ViewIcon = ({...props}) => {
  return <Icon fa="fa fa-eye" title={t('view')} {...props} />;
};

export const EditIcon = ({...props}) => {
  return <Icon fa="fa fa-pencil-square-o" title={t('edit')} {...props} />;
};

export const ClientEditIcon = ({client, ...props}) => {
  if (props.onClick) {
    return <EditIcon {...props} />;
  }
  return <EditIcon onClick={'/client/' + client.slug} {...props} />;
};

export const DownArrowIcon = ({...props}) => {
  return <Icon fa="fa fa-chevron-circle-down" {...props} />;
};

export const ConfirmedDeleteIcon = EnhanceWithConfirmation(DeleteIcon);
