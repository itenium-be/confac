import React, { Component } from 'react';
import { Attachment, IAttachment } from '../../../models';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { HeaderWithEditIcon } from '../Headers';
import { t } from '../../util';
import { AddIcon, ConfirmedDeleteIcon } from '../Icon';
import { AddAttachmentPopup } from './AddAttachmentPopup';
import {updateAttachment, deleteAttachment} from '../../../actions/index';
import { ProposedAttachmentsDropzones } from './ProposedAttachmentsDropzones';
import { AttachmentForm } from './AttachmentForm';


import './attachments.scss';


export type AttachmentsFormProps = {
  deleteAttachment: Function,
  updateAttachment: (model: IAttachment, modelType: 'invoice' | 'client', {file: File, type: string}) => void,
  model: IAttachment,
}


export class AttachmentsFormComponent extends Component<AttachmentsFormProps> {
  render() {
    const model = this.props.model;
    if (!model._id) {
      return null;
    }


    const modelType = model['getType'] ? model['getType']() : 'client';
    return (
      <AbstractAttachmentsForm
        attachments={model.attachments}
        onDelete={(att: Attachment) => this.props.deleteAttachment(model, modelType, att)}
        onAdd={att => this.props.updateAttachment(model, modelType, att)}
        model={model}
        modelType={modelType}
      />
    );
    }
}

export const AttachmentsForm = connect(null, {updateAttachment, deleteAttachment})(AttachmentsFormComponent);



type AbstractAttachmentsFormProps = {
  attachments: Attachment[],
  onDelete: Function,
  onAdd: ({file: File, type: string}) => void,
  model: IAttachment,
  modelType: 'invoice' | 'client',
}

type AbstractAttachmentsFormState = {
  isOpen: boolean,
  isFormOpen: boolean,
  hoverId: string | null,
}

export class AbstractAttachmentsForm extends Component<AbstractAttachmentsFormProps, AbstractAttachmentsFormState> {
  constructor(props: AbstractAttachmentsFormProps) {
    super(props);
    this.state = {
      isOpen: false,
      isFormOpen: false,
      hoverId: null,
    };
  }

  render() {
    const attachments = this.props.attachments.filter(att => att.type !== 'pdf');
    const canDeleteAttachments = attachments.length > 0;

    return (
      <Row className="tst-attachments attachments-form">
        <Col sm={12}>
          <HeaderWithEditIcon
            size={2}
            label={t('invoice.attachments')}
            editIconVisible={canDeleteAttachments}
            onEditClick={() => this.setState({isFormOpen: !this.state.isFormOpen})}
          />

          <AddIcon
            style={{marginTop: 0, marginLeft: 16, marginBottom: 26}}
            onClick={() => this.setState({isOpen: true})}
            label={t('invoice.attachmentsAdd')}
            size={1}
            data-tst="add-attachment"
          />

          <AddAttachmentPopup
            isOpen={this.state.isOpen}
            attachments={this.props.attachments}
            onClose={() => this.setState({isOpen: false})}
            onAdd={(att: {file: File, type: string}) => this.props.onAdd(att)}
          />
        </Col>

        {attachments.map(att => (
          <Col lg={4} md={6} key={att.type}>
            <AttachmentForm
              model={this.props.model}
              modelType={this.props.modelType}
              attachment={att}
            >
              {this.state.isFormOpen ? (
                <div className="delete">
                  <ConfirmedDeleteIcon
                    title={t('attachment.deleteTitle')}
                    onClick={this.props.onDelete.bind(this, att)}
                    data-tst={`att-delete-${att.type}`}
                  >
                    {t('attachment.deletePopup')}
                  </ConfirmedDeleteIcon>
                </div>
              ) : null}
            </AttachmentForm>
          </Col>
        ))}

        <ProposedAttachmentsDropzones model={this.props.model} modelType={this.props.modelType} />
      </Row>
    );
  }
}
