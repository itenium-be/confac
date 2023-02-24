import React, {ReactElement} from 'react';
import RcTooltip from 'rc-tooltip';

type TooltipProps = {
  title: string,
  placement?: 'left' | 'right' | 'top' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight',
  children: ReactElement,
  mouseEnterDelay?: number;
}


// ATTN: The dangerouslySetInnerHTML is quite dangerous in this case:
// --> The user can craft a malicious script with the NotesModalButton and this will just execute it!


export const Tooltip = ({children, title, placement = 'left', mouseEnterDelay = 0.6}: TooltipProps) => (
  <RcTooltip
    placement={placement} // ['left','right','top','bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight']
    trigger={['hover'/* , 'click', 'focus' */]}
    overlay={<div dangerouslySetInnerHTML={{__html: title}} />}
    mouseEnterDelay={mouseEnterDelay}
    mouseLeaveDelay={0.1}
  >
    {children}
  </RcTooltip>
);

type EllipsisProps = {
  title: string | undefined;
  children: any;
  width: number;
}


export const Ellipsis = ({children, title, width}: EllipsisProps) => {
  if (!title) {
    return children || null;
  }

  return (
    <Tooltip title={title}>
      <div style={{width}} className="ellipsis">
        {children}
      </div>
    </Tooltip>
  );
};
