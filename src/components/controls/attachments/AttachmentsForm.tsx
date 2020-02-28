import React from 'react';
import {Row, Col} from 'react-bootstrap';
import {connect, useDispatch} from 'react-redux';

import {updateAttachment, deleteAttachment} from '../../../actions/index';
import {AdvancedAttachmentDropzone} from './AdvancedAttachmentDropzone';
import {IAttachment, Attachment} from '../../../models';
import {AddAttachmentPopup} from './AddAttachmentPopup';
import {ClientModel} from '../../client/models/ClientModels';
import InvoiceModel from '../../invoice/models/InvoiceModel';
import {ProposedAttachmentsDropzones} from './ProposedAttachmentsDropzones';
import {t} from '../../utils';

export type AttachmentModelTypes = {
  invoice: string;
  quotation: string;
  client: string;
}

type AttachmentsFormProps = {
  updateAttachment: (model: IAttachment, modelType: keyof AttachmentModelTypes, {file: File, type: string}) => void;
  model: ClientModel | InvoiceModel;
  modelType: keyof AttachmentModelTypes;
  createDownloadUrl: (downloadType: 'download' | 'preview', att: Attachment) => string;
}

export const _AttachmentsForm = (props: AttachmentsFormProps) => {
  const dispatch = useDispatch();
  const {model, modelType, createDownloadUrl} = props;

  return (
    <>
      <h2>{t('invoice.attachments')}</h2>
      <AddAttachmentPopup
        attachments={model.attachments}
        onAdd={(att: { file: File; type: string; }) => props.updateAttachment(props.model, modelType, att)}
      />
      <Row>
        {model.attachments.filter(att => att.type !== 'pdf').map(att => (
          <Col
            lg={4}
            md={6}
            key={att.type}
            style={{marginBottom: '15px'}}
          >
            <AdvancedAttachmentDropzone
              attachment={att}
              downloadUrl={createDownloadUrl}
              onDelete={() => dispatch(deleteAttachment(props.model, modelType, att.type))}
            />
          </Col>
        ))}

        <ProposedAttachmentsDropzones model={props.model} modelType={modelType} />
      </Row>
    </>
  );
};

export const AttachmentsForm = connect(null, {updateAttachment, deleteAttachment})(_AttachmentsForm);
