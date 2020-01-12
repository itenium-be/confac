import React, {Component} from 'react';
import {Popup, PopupButton} from '../controls/Popup';
import {t} from '../utils';


type EnhanceWithConfirmationProps = {
  onClick: Function,
  title: string,
  children?: any,
}

type EnhanceWithConfirmationState = {
  popupActive: boolean,
}

// eslint-disable-next-line max-len
export const EnhanceWithConfirmation = <P extends object>(ComposedComponent: React.ComponentType<P>) => class extends Component<EnhanceWithConfirmationProps & P, EnhanceWithConfirmationState> {
  constructor(props: EnhanceWithConfirmationProps & P) {
    super(props);
    this.state = {popupActive: false};
  }

  render() {
    const {onClick, title, children, ...props} = this.props;
    const buttons: PopupButton[] = [{
      text: t('no'),
      onClick: () => this.setState({popupActive: false}),
      busy: true,
      variant: 'light',
    }, {
      text: t('delete'),
      variant: 'danger',
      onClick: () => {
        this.setState({popupActive: false});
        onClick();
      },
      busy: true,
    }];
    return (
      <div style={{display: 'inline'}}>
        {this.state.popupActive ? (
          <div style={{display: 'inline'}}>
            <Popup title={title} buttons={buttons} onHide={() => this.setState({popupActive: false})} data-tst={`${props['data-tst']}-popup`}>
              {children}
            </Popup>
            <ComposedComponent {...props as P} onClick={() => this.setState({popupActive: false})} />
          </div>
        ) : (
          <ComposedComponent {...props as P} onClick={() => this.setState({popupActive: true})} />
        )}
      </div>
    );
  }
};
