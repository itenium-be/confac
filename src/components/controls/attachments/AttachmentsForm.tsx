import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Attachment, IAttachment} from '../../../models';
import {updateAttachment, deleteAttachment} from '../../../actions/index';
import {AbstractAttachmentsForm} from './AbstractAttachmentsForm';

import './attachments.scss';


export type AttachmentsFormProps = {
  deleteAttachment: Function,
  updateAttachment: (model: IAttachment, modelType: 'invoice' | 'client', {file: File, type: string}) => void,
  model: IAttachment,
}


// eslint-disable-next-line react/prefer-stateless-function
export class AttachmentsFormComponent extends Component<AttachmentsFormProps> {
  render() {
    const {model} = this.props;
    if (!model._id) {
      return null;
    }


    // eslint-disable-next-line dot-notation
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



export type AbstractAttachmentsFormProps = {
  attachments: Attachment[],
  onDelete: Function,
  onAdd: ({file: File, type: string}) => void,
  model: IAttachment,
  modelType: 'invoice' | 'client',
}

export type AbstractAttachmentsFormState = {
  /** Show the attachment upload popup */
  isOpen: boolean,
  /** Show delete icons on the attachments */
  isFormOpen: boolean,
  /** The attachment.type to show the preview icon */
  hoverId: string | null,
}
