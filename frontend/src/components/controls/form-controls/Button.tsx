import {useNavigate} from 'react-router-dom';
import {Button as ReactButton} from 'react-bootstrap';
import {Icon} from '../Icon';
import {BootstrapVariant, ChildrenType} from '../../../models';
import {Tooltip} from '../Tooltip';
import {EnhanceWithClaim} from '../../enhancers/EnhanceWithClaim';

export type ButtonSize = 'lg' | 'sm' | 'md';

export type ButtonProps = {
  onClick: Function | string,
  /** Full fa. ex: "far fa-xxx" */
  icon?: string,
  variant?: BootstrapVariant,
  size?: ButtonSize,
  children?: ChildrenType,
  style?: React.CSSProperties,
  disabled?: boolean;
  className?: string;
  title?: string;
}

const ButtonComponent = ({variant = 'primary', size = 'md', disabled, className, style, title, ...props}: ButtonProps) => {
  const navigate = useNavigate();
  const {children, icon, onClick, ...rest} = props;

  let realClick: any = onClick;
  if (typeof onClick === 'string') {
    realClick = () => {
      navigate(onClick);
    };
  }

  let FinalButton = (
    <ReactButton
      className={className}
      variant={variant}
      size={size === 'md' ? undefined : size}
      onClick={realClick}
      disabled={disabled}
      style={style}
      {...rest}
    >
      {icon ? <Icon fa={icon} size={1} style={{marginRight: children ? 6 : 0}} /> : null}
      {children}
    </ReactButton>
  );

  if (title) {
    if (disabled) {
      // WORKAROUND: Tooltip not going away when the button is disabled
      // https://github.com/react-component/tooltip/issues/18#issuecomment-411476678
      const identifier = Math.floor(Math.random() * Date.now()).toString(36)
      FinalButton = (
        <Tooltip
          title={title}
          identifier={identifier}
        >
          <div>
            <ReactButton
              className={className}
              variant={variant}
              size={size === 'md' ? undefined : size}
              onClick={realClick}
              active={false}
              disabled={true}
              style={{...style, pointerEvents: 'none'}}
              onPointerLeave={()=>{
                const tooltips = document.getElementsByClassName(identifier);
                for(let i = 0; i < tooltips.length; i++)
                {
                  tooltips[i].classList.add("rc-tooltip-hidden");
                }
              }}
              onPointerEnter={()=>{
                const tooltips = document.getElementsByClassName(identifier);
                for(let i = 0; i < tooltips.length; i++)
                {
                  tooltips[i].classList.remove("rc-tooltip-hidden");
                }
              }}
              {...rest}
            >
              {icon ? <Icon fa={icon} size={1} style={{marginRight: children ? 6 : 0}} /> : null}
              {children}
            </ReactButton>
          </div>
        </Tooltip>
      );

    } else {
      FinalButton = (
        <Tooltip title={title}>
          {FinalButton}
        </Tooltip>
      );
    }
  }

  return FinalButton;
};



export const Button = EnhanceWithClaim(ButtonComponent);
