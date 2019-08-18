import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {t} from '../util';

import {Button, Modal as ReactModal} from 'react-bootstrap';


export class Modal extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func,
    title: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
  }

  onConfirm() {
    this.props.onConfirm();
    this.props.onClose();
  }

  render() {
    return (
      <ReactModal show={this.props.show} onHide={this.props.onClose}>
        <ReactModal.Header closeButton>
          <ReactModal.Title>{this.props.title}</ReactModal.Title>
        </ReactModal.Header>
        <ReactModal.Body>
          {this.props.children}
        </ReactModal.Body>
        <ReactModal.Footer>
          {this.props.onConfirm ? (
            <Button onClick={this.onConfirm.bind(this)} variant="success">{t('save')}</Button>
          ) : null}
          <Button onClick={this.props.onClose} variant="default">{t('close')}</Button>
        </ReactModal.Footer>
      </ReactModal>
    );
  }
}
