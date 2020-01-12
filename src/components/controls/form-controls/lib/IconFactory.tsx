import React from 'react';
import {Icon} from '../../Icon';

export type InputIcons = 'phone' | 'email' | 'website' | 'bank' | 'building'
  | 'user' | 'wrench';


const iconMap = {
  phone: 'fa fa-phone',
  email: 'fa fa-envelope',
  website: 'fa fa-globe',
  bank: 'fa fa-piggy-bank',
  building: 'fa fa-building',
  user: 'fa fa-user',
  wrench: 'fa fa-wrench',
  hours: 'fa fa-hourglass-half',
  invoice: 'fa fa-file-invoice',
};


export function getIconOrText(str: InputIcons | string): string | React.ReactNode {
  const iconClass = getIconClass(str);
  if (iconClass) {
    return <Icon fa={iconClass} size={1} />;
  }
  if (str.startsWith('fa')) {
    return <Icon fa={str} size={1} />;
  }
  return str;
}

function getIconClass(str: InputIcons | string): any {
  if (iconMap[str]) {
    return iconMap[str];
  }
  return null;
}
