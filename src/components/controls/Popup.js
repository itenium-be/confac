import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { t } from '../util.js';

export class Popup extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    buttons: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.required,
      onClick: PropTypes.func.isRequired,
      bsStyle: PropTypes.string,
    }))
  };
  render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.children}
        </Modal.Body>

        <Modal.Footer>
          {this.props.buttons.map((button, i) => (
            <Button key={i} bsStyle={button.bsStyle} onClick={button.onClick}>{button.text}</Button>
          ))}
        </Modal.Footer>

      </Modal.Dialog>
    );
  }
}

export const EnhanceWithConfirmation = ComposedComponent => class extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    title: PropTypes.string,
    children: PropTypes.node,
  };
  constructor() {
    super();
    this.state = {popupActive: false};
  }
  render() {
    const {onClick, title, children,...props} = this.props;
    const buttons = [{
      text: t('no'),
      onClick: () => this.setState({popupActive: false})
    }, {
      text: t('delete'),
      bsStyle: 'danger',
      onClick: () => onClick()
    }];
    return (
      <div>
        {this.state.popupActive ? (
          <div>
            <Popup title={title} buttons={buttons}>{children}</Popup>
            <ComposedComponent {...props} onClick={() => this.setState({popupActive: false})} />
          </div>
        ) : (
          <ComposedComponent {...props} onClick={() => this.setState({popupActive: true})} />
        )}
      </div>
    );
  }
};
