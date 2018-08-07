import React from 'react';
import {InputGroup} from 'react-bootstrap';

export const EnhanceInputWithAddons = ComposedComponent => ({prefix, suffix, addOnMinWidth, ...props}) => {
  // ATTN: window.outerWidth is not part of the state, so a
  // rerender does not happen when the user resizes the window
  if ((!addOnMinWidth || addOnMinWidth < window.outerWidth) && (prefix || suffix)) {
    return (
      <InputGroup>
        {prefix ? <InputGroup.Addon>{prefix}</InputGroup.Addon> : null}
        <ComposedComponent {...props} />
        {suffix ? <InputGroup.Addon>{suffix}</InputGroup.Addon> : null}
      </InputGroup>
    );
  }
  return <ComposedComponent {...props} />;
};
