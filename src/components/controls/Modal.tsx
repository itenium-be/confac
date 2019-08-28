import React, {Component} from 'react';
import {t} from '../util';
import {Button, Modal as ReactModal} from 'react-bootstrap';

type ModalProps = {
  show: boolean,
  onClose: () => void,
  onConfirm: Function,
  title: string,
  children: any,
}

export class Modal extends Component<ModalProps> {
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
          <Button onClick={this.props.onClose} variant="light">{t('close')}</Button>
        </ReactModal.Footer>
      </ReactModal>
    );
  }
}
