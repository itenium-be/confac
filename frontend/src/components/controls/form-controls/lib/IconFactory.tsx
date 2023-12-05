import React from 'react';
import {Icon} from '../../Icon';

export type InputIcons = 'phone' | 'email' | 'website' | 'bank' | 'building'
  | 'user' | 'wrench';


const iconMap = {
  phone: 'fa fa-phone tst-icon-phone',
  email: 'fa fa-envelope tst-icon-mail',
  website: 'fa fa-globe tst-icon-website',
  bank: 'fa fa-piggy-bank tst-icon-money',
  building: 'fa fa-building tst-icon-building',
  user: 'fa fa-user tst-icon-user',
  wrench: 'fa fa-wrench tst-icon-wrench',
  hours: 'fa fa-hourglass-half tst-icon-hourglass',
  invoice: 'fa fa-file-invoice tst-icon-invoice',
};


export function getIconOrText(str: InputIcons | string): string | React.ReactElement {
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
