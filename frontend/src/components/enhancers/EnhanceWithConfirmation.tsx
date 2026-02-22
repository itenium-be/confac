import {Component} from 'react';
import {Popup, PopupButton} from '../controls/Popup';
import {t} from '../utils';


type EnhanceWithConfirmationProps = {
  onClick: () => void;
  /** Confirmation dialog title */
  title: string;
  /** Confirmation dialog content */
  children?: any;
  /** Button text */
  componentChildren?: string;
}

type EnhanceWithConfirmationState = {
  popupActive: boolean;
}

// eslint-disable-next-line max-len
export const EnhanceWithConfirmation = <P extends object>(ComposedComponent: React.ComponentType<P>) => {
  class WithConfirmation extends Component<EnhanceWithConfirmationProps & P, EnhanceWithConfirmationState> {
    constructor(props: EnhanceWithConfirmationProps & P) {
      super(props);
      this.state = {popupActive: false};
    }

    render() {
      const {onClick, title, children, componentChildren, ...props} = this.props;
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
        <div style={{display: 'inline'}} className="button">
          {this.state.popupActive ? (
            <div style={{display: 'inline'}}>
              <Popup
                title={title}
                buttons={buttons}
                onHide={() => this.setState({popupActive: false})}
              >
                {children}
              </Popup>
              <ComposedComponent {...props as P} onClick={() => this.setState({popupActive: false})}>
                {componentChildren}
              </ComposedComponent>
            </div>
          ) : (
            <ComposedComponent {...props as P} onClick={() => this.setState({popupActive: true})}>
              {componentChildren}
            </ComposedComponent>
          )}
        </div>
      );
    }
  }
  return WithConfirmation;
};
