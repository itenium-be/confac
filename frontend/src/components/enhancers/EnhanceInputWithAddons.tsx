import {InputGroup} from 'react-bootstrap';
import {formatDate} from '../utils';

export type EnhanceInputWithAddonsProps = {
  prefix?: string | React.ReactNode,
  prefixOptions?: {type: 'text' | 'button'},
  suffix?: string | React.ReactNode,
  suffixOptions?: {type: 'text' | 'button'},
  addOnMinWidth?: number,
}

// eslint-disable-next-line max-len
export const EnhanceInputWithAddons = <P extends object>(ComposedComponent: React.ComponentType<P>) =>
  ({prefix, prefixOptions, suffix, suffixOptions, addOnMinWidth, ...props}: EnhanceInputWithAddonsProps & P) => {
  // ATTN: window.outerWidth is not part of the state, so a
  // rerender does not happen when the user resizes the window
  if ((!addOnMinWidth || addOnMinWidth < window.outerWidth) && (prefix || suffix)) {
    return (
      <InputGroup>
        {prefix ? <Addon add={prefix} options={prefixOptions} /> : null}
        <ComposedComponent {...props as P} />
        {suffix ? <Addon add={suffix} options={suffixOptions} /> : null}
      </InputGroup>
    );
  }
  return <ComposedComponent {...props as P} />;
};


const Addon = ({add, options}) => {
  if (!options || options.type === 'text') {
    return <InputGroup.Text>{add}</InputGroup.Text>;
  }
  return add;
};



type ReactNodeFn = any;


export type EnhanceInputWithDisplayProps = {
  /** Display a label instead of an input */
  display?: 'label' | undefined | ReactNodeFn,
  value: any,
}

// eslint-disable-next-line max-len
export const EnhanceInputWithDisplay = <P extends object>(ComposedComponent: React.ComponentType<P>) => ({display, ...props}: EnhanceInputWithDisplayProps & P) => {
  if (typeof display === 'function') {
    return display();
  }

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

  return <ComposedComponent {...props as P} />;
};
