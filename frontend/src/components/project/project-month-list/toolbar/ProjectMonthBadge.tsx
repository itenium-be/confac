import React from 'react';
import { Badge as ReactBadge } from 'react-bootstrap';
import { BadgeProps as ReactBadgeProps } from 'react-bootstrap/Badge';
import RcTooltip from 'rc-tooltip';

type BadgeProps = Omit<ReactBadgeProps, 'title'> & {
  title?: string | string[];
  children: any;
};

/** Wrapper for the ProjectMonth closed month badges */
export const ProjectMonthBadge = ({ title, children, ...props }: BadgeProps) => {
  if (!title) {
    return <ReactBadge {...props}>{children}</ReactBadge>;
  }

  let overlay: any;
  if (typeof title === 'string') {
    overlay = title;
  } else {
    overlay = title.map(x => <div key={x}>{x}</div>);
  }

  return (
    <RcTooltip overlay={overlay}>
      <ReactBadge {...props}>{children}</ReactBadge>
    </RcTooltip>
  );
};
