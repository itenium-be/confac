import React, {Component} from 'react';
import {SpinnerIcon} from '../controls/Icon';


type EnhanceWithBusySpinnerProps = {
  isBusy: boolean,
  onClick: Function,
  model: any,
}

type EnhanceWithBusySpinnerState = {
  isBusy: boolean,
}

// eslint-disable-next-line max-len
export const EnhanceWithBusySpinner = <P extends object>(ComposedComponent: React.ComponentType<P>) => (class extends Component<EnhanceWithBusySpinnerProps & P, EnhanceWithBusySpinnerState> {
  constructor(props: EnhanceWithBusySpinnerProps & P) {
    super(props);
    this.state = {isBusy: false};
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.isBusy && this.props.model !== nextProps.model) {
      this.setState({isBusy: false});
    }
  }

  render() {
    const {isBusy, onClick, model, ...props} = this.props;
    if (isBusy && this.state.isBusy) {
      return <SpinnerIcon style={{marginLeft: 0}} />;
    }

    const realOnclick = () => {
      this.setState({isBusy: true});
      onClick();
    };
    return <ComposedComponent {...props as P} onClick={realOnclick} />;
  }
});
