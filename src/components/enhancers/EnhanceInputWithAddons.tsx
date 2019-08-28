import React from 'react';
import {InputGroup} from 'react-bootstrap';

type EnhanceInputWithAddonsProps = {
  prefix?: string,
  suffix?: string,
  addOnMinWidth?: number,
}

export const EnhanceInputWithAddons = <P extends object>(ComposedComponent: React.ComponentType<P>) =>
  ({prefix, suffix, addOnMinWidth, ...props}: EnhanceInputWithAddonsProps & P) => {
    // ATTN: window.outerWidth is not part of the state, so a
    // rerender does not happen when the user resizes the window
    if ((!addOnMinWidth || addOnMinWidth < window.outerWidth) && (prefix || suffix)) {
      return (
        <InputGroup>
          {prefix ? <InputGroup.Prepend><InputGroup.Text>{prefix}</InputGroup.Text></InputGroup.Prepend> : null}
          <ComposedComponent {...props as P} />
          {suffix ? <InputGroup.Append><InputGroup.Text>{suffix}</InputGroup.Text></InputGroup.Append> : null}
        </InputGroup>
      );
    }
    return <ComposedComponent {...props as P} />;
  };
