import React, {Component, PropTypes } from 'react';
import {Modal } from 'react-bootstrap';
import {Button, BusyButton } from './Button.js';

export class Popup extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    buttons: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.required,
      onClick: PropTypes.func.isRequired,
      bsStyle: PropTypes.string,
      busy: PropTypes.bool,
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
            return <UsedButton key={i} bsStyle={button.bsStyle || 'default'} onClick={button.onClick}>{button.text}</UsedButton>;
          })}
        </Modal.Footer>
      </Modal>
    );
  }
}
