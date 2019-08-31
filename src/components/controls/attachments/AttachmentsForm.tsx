import React, { Component } from 'react';
import { Attachment, IAttachment } from '../../../models';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { HeaderWithEditIcon } from '../Headers';
import { t } from '../../util';
import { AddIcon, ConfirmedDeleteIcon } from '../Icon';
import { AddAttachmentPopup } from './AddAttachmentPopup';
import { AttachmentDownloadIcon } from '../../controls';
import {updateAttachment, deleteAttachment} from '../../../actions/index';
import { ProposedAttachmentsDropzones } from './ProposedAttachmentsDropzones';

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
    const canDeleteAttachments = this.props.attachments.length > (this.props.modelType === 'client' ? 0 : 1);
    const transPrefix = this.props.modelType;

    return (
      <Row className="tst-attachments">
        <Col sm={12}>
          <HeaderWithEditIcon
            size={2}
            label={t('invoice.attachments')}
            editIconVisible={canDeleteAttachments}
            onEditClick={() => this.setState({isFormOpen: !this.state.isFormOpen})}
          />

          <AddIcon
            style={{marginTop: 0, marginLeft: 16}}
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

        {this.props.attachments.map(att => (
          <Col sm={3} key={att.type} style={{height: 45}}>
            <div
              style={{padding: 5, marginTop: 10, border: this.state.isFormOpen && att.type === this.state.hoverId ? '1px gray dotted' : ''}}
              onMouseOver={() => this.setState({hoverId: att.type !== 'pdf' ? att.type : null})}
              onMouseOut={() => this.setState({hoverId: null})}
            >
              <AttachmentDownloadIcon
                model={this.props.model}
                attachment={att}
                modelType={this.props.modelType}
                data-tst={`att-download-${att.type}`}
                label={att.type !== 'pdf' ? att.type : t(transPrefix + '.pdfName')}
              />
              {this.state.isFormOpen && att.type !== 'pdf' ? (
                <div style={{display: 'inline', position: 'absolute', right: 20}}>
                  <ConfirmedDeleteIcon
                    title={t('attachment.deleteTitle')}
                    onClick={this.props.onDelete.bind(this, att)}
                    data-tst={`att-delete-${att.type}`}
                  >
                    {t('attachment.deletePopup')}
                  </ConfirmedDeleteIcon>
                </div>
              ) : null}
            </div>
          </Col>
        ))}

        <ProposedAttachmentsDropzones model={this.props.model} modelType={this.props.modelType} />
      </Row>
    );
  }
}
