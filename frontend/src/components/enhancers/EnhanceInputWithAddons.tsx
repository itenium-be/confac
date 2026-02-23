import {InputGroup} from 'react-bootstrap';
import {formatDate} from '../utils';

export type EnhanceInputWithAddonsProps = {
  prefix?: string | React.ReactNode;
  prefixOptions?: {type: 'text' | 'button'};
  suffix?: string | React.ReactNode;
  suffixOptions?: {type: 'text' | 'button'};
  addOnMinWidth?: number;
  disabled?: boolean;
}


export const EnhanceInputWithAddons = <P extends object>(ComposedComponent: React.ComponentType<P>) => {
  const InputWithAddons = ({prefix, prefixOptions, suffix, suffixOptions, addOnMinWidth, disabled, ...props}: EnhanceInputWithAddonsProps & P) => {
    // ATTN: window.outerWidth is not part of the state, so a
    // rerender does not happen when the user resizes the window
    if ((!addOnMinWidth || addOnMinWidth < window.outerWidth) && (prefix || suffix)) {
      return (
        <InputGroup>
          {prefix ? <Addon add={prefix} options={prefixOptions} disabled={disabled} /> : null}
          <ComposedComponent {...props as P} disabled={disabled} />
          {suffix ? <Addon add={suffix} options={suffixOptions} disabled={disabled} /> : null}
        </InputGroup>
      );
    }
    return <ComposedComponent {...props as P} disabled={disabled} />;
  };
  return InputWithAddons;
};


type AddonProps = {
  add: string | React.ReactNode;
  options?: {type: 'text' | 'button'};
  disabled?: boolean;
};

const Addon = ({add, options, disabled}: AddonProps): React.ReactElement | null => {
  if (!options || options.type === 'text') {
    return <InputGroup.Text className={disabled ? 'disabled' : undefined}>{add}</InputGroup.Text>;
  }
  return <>{add}</>;
};



type ReactNodeFn = React.ReactNode | (() => React.ReactNode);

type DateLike = {
  toDate: () => Date;
};

export type EnhanceInputWithDisplayProps = {
  /** Display a label instead of an input */
  display?: 'label' | undefined | ReactNodeFn;
  value: string | number | DateLike | undefined;
}


export const EnhanceInputWithDisplay = <P extends object>(ComposedComponent: React.ComponentType<P>) => {
  const InputWithDisplay = ({display, ...props}: EnhanceInputWithDisplayProps & P) => {
    if (display === 'label') {
      if (!props.value) {
        return <span>&nbsp;</span>;
      }

      if (typeof props.value === 'string') {
        return <span>{props.value}</span>;
      }

      if (typeof props.value.toDate === 'function') {
        return <span>{formatDate(props.value)}</span>;
      }

      return <span>{props.value.toString()}</span>;
    }

    if (display) {
      return display;
    }

    return <ComposedComponent {...props as P} />;
  };
  return InputWithDisplay;
};
