declare module 'react-ios-switch' {
  import {Component} from 'react';

  interface SwitchProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    onColor?: string;
    offColor?: string;
    [key: string]: unknown;
  }

  export default class Switch extends Component<SwitchProps> {}
}
