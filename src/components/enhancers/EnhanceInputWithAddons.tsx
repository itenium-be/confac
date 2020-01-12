import React from 'react';
import {InputGroup} from 'react-bootstrap';

export type EnhanceInputWithAddonsProps = {
  prefix?: string | React.ReactNode,
  prefixOptions?: {type: 'text' | 'button'},
  suffix?: string | React.ReactNode,
  suffixOptions?: {type: 'text' | 'button'},
  addOnMinWidth?: number,
}

export const EnhanceInputWithAddons = <P extends object>(ComposedComponent: React.ComponentType<P>) => ({prefix, prefixOptions, suffix, suffixOptions, addOnMinWidth, ...props}: EnhanceInputWithAddonsProps & P) => {
  // ATTN: window.outerWidth is not part of the state, so a
  // rerender does not happen when the user resizes the window
  if ((!addOnMinWidth || addOnMinWidth < window.outerWidth) && (prefix || suffix)) {
    return (
      <InputGroup>
        {prefix ? <InputGroup.Prepend><Addon add={prefix} options={prefixOptions} /></InputGroup.Prepend> : null}
        <ComposedComponent {...props as P} />
        {suffix ? <InputGroup.Append><Addon add={suffix} options={suffixOptions} /></InputGroup.Append> : null}
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
