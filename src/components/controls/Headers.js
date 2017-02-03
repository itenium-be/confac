import React from 'react';
import {EditIcon} from './Icon.js';

export const HeaderWithEditIcon = ({label, onEditClick, children, editIconVisible = true}) => {
  return (
    <h4>
      {label}
      {editIconVisible ? (
        <small>
          {children ? (
            children
          ) : (
            <EditIcon
              onClick={onEditClick}
              title=""
              size={1}
              style={{display: 'inline', marginLeft: 10}}
            />
          )}
        </small>
      ) : null}
    </h4>
  );
};
