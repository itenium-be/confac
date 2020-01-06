import React, { Component } from 'react';
import { t } from '../utils';
import { Button, Modal as ReactModal } from 'react-bootstrap';
import { BootstrapVariant } from '../../models';

export type BaseModalProps = {
  show: boolean,
  onClose: () => void,
}


type ModalProps = BaseModalProps & {
  /**
   * Optional confirm button
   */
  onConfirm?: () => void,
  /**
   * Confirm button text
   * Defaults to "Save"
   */
  confirmText?: string,
  confirmVariant?: BootstrapVariant,
  title: string | React.ReactNode,
  children: any,
}

export class Modal extends Component<ModalProps> {
  onConfirm() {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
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
          <Button onClick={this.props.onClose} variant="light">{t('close')}</Button>
          {this.props.onConfirm ? (
            <Button onClick={this.onConfirm.bind(this)} variant={this.props.confirmVariant || 'success'}>{this.props.confirmText || t('save')}</Button>
          ) : null}
        </ReactModal.Footer>
      </ReactModal>
    );
  }
}
