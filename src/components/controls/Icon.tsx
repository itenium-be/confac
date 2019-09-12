import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Tooltip} from './Tooltip';
import cn from 'classnames';
import {EnhanceWithConfirmation, EnhanceWithBusySpinner} from '../enhancers/index';
import t from '../../trans';
import { ConfacState } from '../../reducers/app-state';


const EnhanceIconWithCenter = <P extends object>(Component: React.ComponentType<P>) => ({center, ...props}: {center?: boolean} & P) => {
  if (center) {
    return (
      <div style={{textAlign: 'center'}}>
        <Component {...props as P} />
      </div>
    );
  }
  return <Component {...props as P} />;
};


type RouterProps = {
  match: any,
  location: any,
  history: any,
  staticContext: any,
}

export const Icon = EnhanceIconWithCenter(
  withRouter(({ match, location, history, staticContext, ...props }: IconProps & RouterProps) =>
    <IconComponent history={history} {...props as IconProps} />
  )
);

export type IconProps = {
  fa?: string,
  color?: string,
  style?: React.CSSProperties,
  /**
   * string: A react-router link
   * or a function
   */
  onClick?: string | Function,
  /**
   * A link to outside React
   */
  href?: string,
  className?: string,
  label?: string | React.ReactNode,
  labelStyle?: React.CSSProperties,
  title?: string,
  size?: number,
  history?: any,
  center?: boolean,
  dispatch?: any,
}


class IconComponent extends Component<IconProps> {
  static defaultProps = {
    size: 2
  }

  render() {
    const {fa, color, style, onClick, href, dispatch, className, label, labelStyle, title, size, history, ...props} = this.props;
    var realClick: any = onClick;
    if (typeof onClick === 'string') {
      realClick = () => {
        history.push(onClick);
      };
    }

    let FinalIcon = (
      <i
        {...props}
        className={cn(fa, `fa-${size}x`, className, {clickable: !!onClick || !!href})}
        onClick={realClick}
        style={{color: color, ...style}}
      >
        {label ? <span style={{marginLeft: 6, ...labelStyle}}>{label}</span> : null}
      </i>
    );

    if (href) {
      FinalIcon = (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {FinalIcon}
        </a>
      );
    }

    if (title) {
      // TODO: inline doesn't seem to be always working (for example in EditInvoiceLines:Notes th)
      // TODO: Not sure if the above still holds: changed tooltip from react-tooltip to rc-tooltip
      //       --> Probably the inline div was added for the previous Tooltip to work?
      return (
        <div style={{display: 'inline'}}>
          <Tooltip title={title}>
            {FinalIcon}
          </Tooltip>
        </div>
      );
    }

    return FinalIcon;
  }
}


export const VerifyIcon = ({...props}: IconProps) => (
  <Icon fa="fa fa-check" color="green" {...props} />
);
export const BusyVerifyIcon = connect((state: ConfacState) => ({isBusy: state.app.isBusy}))(EnhanceWithBusySpinner(VerifyIcon));

export const SpinnerIcon = ({...props}: IconProps) => (
  <Icon fa="fa fa-spinner fa-pulse fa-fw" {...props} />
);

export const DeleteIcon = ({...props}: IconProps) => (
  <Icon fa="fa fa-minus-circle" color="#CC1100" title={t('delete')} {...props} />
);

export const AddIcon = ({...props}: IconProps) => {
  return <Icon fa="fa fa-plus" {...props} />;
};

export const DragAndDropIcon = ({...props}: IconProps) => {
  return <Icon fa="fa fa-arrows" color="#EEE9E9" data-tst="dnd" {...props} />;
};

export const EditIcon = ({...props}: IconProps) => {
  return <Icon fa="far fa-edit" title={t('edit')} {...props} />;
};

export const ClientEditIcon = ({client, ...props}) => {
  if (props.onClick) {
    return <EditIcon {...props} />;
  }
  return <EditIcon onClick={'/clients/' + client.slug} {...props} />;
};

export const ExpandIcon = ({...props}: IconProps) => {
  return <Icon fa="fa fa-expand-arrows-alt" {...props} />;
};

export const NotEmailedIcon = ({...props}) => {
  return (
    <span className="fa-stack fa-2x" {...props}>
      <i className="fas fa-envelope fa-stack-1x" />
      <Icon fa="fas fa-ban fa-stack-2x" size={1} title={t('email.notMailed')} color="#CC1100" />
    </span>
  );
}

export const ConfirmedDeleteIcon = EnhanceWithConfirmation(DeleteIcon);
