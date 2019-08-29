import { Icon } from "../../../controls";
import React from "react";

export type InputIcons = 'phone' | 'email' | 'website' | 'bank' | 'building';

export function getIcon(str: InputIcons): any {
  switch (str) {
  case 'phone':
    return <Icon fa="fa fa-phone" size={1} />;
  case 'email':
    return <Icon fa="fa fa-envelope" size={1} />;
  case 'website':
    return <Icon fa="fa fa-globe" size={1} />;
  case 'bank':
    return <Icon fa="fa fa-piggy-bank" size={1} />;
  case 'building':
    return <Icon fa="fa fa-building" size={1} />;
  default:
    return null;
  }
}
