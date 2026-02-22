import {Component} from 'react';
import {Modal} from 'react-bootstrap';
import {Button} from './form-controls/Button';
import {BootstrapVariant} from '../../models';
import {BusyButton} from './form-controls/BusyButton';


export type PopupButton = {
  text: string;
  onClick: () => void;
  variant?: BootstrapVariant;
  busy?: boolean;
  disabled?: boolean;
}

type PopupProps = {
  title: string;
  children: any;
  onHide: () => void;
  buttons: PopupButton[];
}

// eslint-disable-next-line react/prefer-stateless-function
export class Popup extends Component<PopupProps> {
  render() {
    return (
      <Modal onHide={this.props.onHide} show>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.children}
        </Modal.Body>

        <Modal.Footer>
          {this.props.buttons.map((button, i) => {
            const UsedButton = button.busy ? BusyButton : Button;
            return (
              <UsedButton
                className="tst-popup-footer"
                key={i}
                variant={button.variant}
                onClick={button.onClick}
                disabled={button.disabled || false}
              >
                {button.text}
              </UsedButton>
            );
          })}
        </Modal.Footer>
      </Modal>
    );
  }
}
