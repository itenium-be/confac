import {useNavigate} from 'react-router-dom';
import cn from 'classnames';
import {Tooltip} from './Tooltip';
import t from '../../trans';
import {EnhanceWithClaim, EnhanceWithClaimProps} from '../enhancers/EnhanceWithClaim';


const EnhanceIconWithCenter = <P extends object>(EnhancedComponent: React.ComponentType<P>) => (
  {center, ...props}: {center?: boolean} & P,
) => {
  if (center) {
    return (
      <div style={{textAlign: 'center'}}>
        <EnhancedComponent {...props as P} />
      </div>
    );
  }
  return <EnhancedComponent {...props as P} />;
};



export const Icon = EnhanceWithClaim(EnhanceIconWithCenter(
  (props: IconProps) => <IconComponent {...props} />
));

export type IconProps = EnhanceWithClaimProps & {
  /** Full fa. ex: "far fa-xxx" */
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
  children?: any,
}


const IconComponent = ({fa, onClick, href, dispatch, className, label, labelStyle, title, size = 2, children, ...props}: IconProps) => {
  const navigate = useNavigate();
  let realClick: any = onClick;
  if (typeof onClick === 'string') {
    realClick = () => {
      navigate(onClick);
    };
  }

  let FinalIcon = (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <i
      {...props}
      className={cn(fa, `fa-${size}x`, className, {clickable: !!onClick || !!href})}
      onClick={realClick}
      style={{color: props.color, ...props.style}}
    >
      {label ? <span style={{marginLeft: 6, ...labelStyle}}>{label}</span> : null}
      {children}
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
    // Peformance: The tooltips take quite some rendering time: 500ms for 5k+ icons
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


export const SpinnerIcon = ({...props}: IconProps) => (
  <Icon className="tst-icon-spinner" fa="fa fa-spinner fa-pulse fa-fw" {...props} />
);

export const AddIcon = ({...props}: IconProps) => <Icon className="tst-add" fa="fa fa-plus" {...props} />;

export const DragAndDropIcon = ({...props}: IconProps) => <Icon className="tst-drag" fa="fa fa-arrows-alt" color="#EEE9E9" {...props} />;

export const EditIcon = ({...props}: IconProps) => <Icon className="tst-edit" fa="far fa-edit" title={t('edit')} {...props} />;

export const ExpandIcon = ({...props}: IconProps) => <Icon className="tst-expand" fa="fa fa-expand-arrows-alt" {...props} />;

export const NotEmailedIcon = ({...props}) => (
  <span className="fa-stack fa-2x tst-not-mailed"  {...props}>
    <i className="fas fa-envelope fa-stack-1x" />
    <Icon  fa="fas fa-ban fa-stack-2x" size={1} title={t('email.notMailed')} color="#CC1100" />
  </span>
);

export const EmailedIcon = ({...props}) => (
  <Icon fa="fa-stack fa-2x tst-mailed-success" {...props}>
    <i className="fas fa-envelope fa-stack-1x" />
    <Icon fa="fas fa-check fa-stack-2x" size={1} color="green" />
  </Icon>
);
