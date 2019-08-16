import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';
import {Button, BusyButton} from './Button.js';

export class Popup extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    title: PropTypes.string,
    children: PropTypes.node,
    buttons: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.required,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.string,
      busy: PropTypes.bool,
      disabled: PropTypes.bool
    })),
    onHide: PropTypes.func.isRequired,
  };
  render() {
    return (
      <Modal onHide={this.props.onHide} show={true}>
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
                key={i}
                variant={button.variant || 'default'}
                onClick={button.onClick}
                disabled={button.disabled}
                data-tst={this.props['data-tst'] + '-btn-' + i}
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
