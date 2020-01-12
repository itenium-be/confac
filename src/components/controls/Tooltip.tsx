import React from 'react';
import RcTooltip from 'rc-tooltip';

type TooltipProps = {
  title: string,
  placement?: 'left' | 'right' | 'top' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight',
  children: React.ReactNode,
  mouseEnterDelay?: number;
}

export const Tooltip = ({children, title, placement = 'left', mouseEnterDelay = 0.6}: TooltipProps) => (
  <RcTooltip
    placement={placement} // ['left','right','top','bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight']
    trigger={['hover'/* , 'click', 'focus' */]}
    overlay={title.split('<br>').map((line, i) => <div key={i}>{line}</div>)}
    mouseEnterDelay={mouseEnterDelay}
    mouseLeaveDelay={0.1}
  >
    {children}
  </RcTooltip>
);
