import {connect} from 'react-redux';
import {ConfacState} from '../../../reducers/app-state';
import {Button} from './Button';

type ButtonWithClickOnceProps = {
  isBusy: boolean;
  disabled?: boolean;
}

const EnhanceButtonWithClickOnce = <P extends object>(Component: React.ComponentType<P>): React.FC<P & ButtonWithClickOnceProps> => (
  {isBusy, disabled, ...props}: ButtonWithClickOnceProps,
) => <Component {...props as P} disabled={isBusy || disabled} />;



export const BusyButton = connect((state: ConfacState) => ({isBusy: state.app.isBusy}), {})(EnhanceButtonWithClickOnce(Button));
