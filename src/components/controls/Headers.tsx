import React from 'react';
import {EditIcon, IconProps} from './Icon';

type ChildrenProps = {children: React.ReactNode}

const Header1 = ({children, ...props}: ChildrenProps) => (<h1 {...props}>{children}</h1>);
const Header2 = ({children, ...props}: ChildrenProps) => (<h2 {...props}>{children}</h2>);
const Header3 = ({children, ...props}: ChildrenProps) => (<h3 {...props}>{children}</h3>);
const Header4 = ({children, ...props}: ChildrenProps) => (<h4 {...props}>{children}</h4>);

function getHeader(size: number): any {
  switch (size) {
  case 1:
    return Header1;
  case 2:
    return Header2;
  case 3:
    return Header3;
  case 4:
    return Header4;
  default:
    return Header1;
  }
}



type HeaderWithEditIconProps = IconProps & {
  onEditClick?: Function,
  editIconVisible?: boolean,
  children?: React.ReactNode,
}

export const HeaderWithEditIcon = ({label, onEditClick, children, editIconVisible = true, size = 1}: HeaderWithEditIconProps) => {
  const Header = getHeader(size);
  return (
    <Header>
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
              data-tst="open-header-icon"
            />
          )}
        </small>
      ) : null}
    </Header>
  );
};
