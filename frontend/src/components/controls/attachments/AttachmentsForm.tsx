import React from 'react';
import {Row, Col} from 'react-bootstrap';
import {connect, useDispatch} from 'react-redux';

import {updateAttachment, deleteAttachment} from '../../../actions/index';
import {AdvancedAttachmentDropzone} from './AdvancedAttachmentDropzone';
import {IAttachment, Attachment} from '../../../models';
import {AddAttachmentPopup, FileAttachment} from './AddAttachmentPopup';
import {ClientModel} from '../../client/models/ClientModels';
import InvoiceModel from '../../invoice/models/InvoiceModel';
import {ProposedAttachmentsDropzones} from './ProposedAttachmentsDropzones';
import {t} from '../../utils';
import {Claim} from '../../users/models/UserModel';


export type AttachmentModelTypes = {
  invoice: string;
  quotation: string;
  client: string;
}

type AttachmentsFormProps = {
  updateAttachment: (model: IAttachment, modelType: keyof AttachmentModelTypes, file: FileAttachment) => void;
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
        claim={mapModelType(modelType)}
        attachments={model.attachments}
        onAdd={(att: { file: File; type: string; }) => props.updateAttachment(props.model, modelType, att)}
      />
      <Row>
        {model.attachments.filter(att => att.type !== 'pdf').map(att => (
          <Col
            lg={4}
            md={6}
            key={att.type}
            style={{marginBottom: 15}}
          >
            <AdvancedAttachmentDropzone
              claim={mapModelType(modelType)}
              attachment={att}
              downloadUrl={createDownloadUrl}
              onDelete={() => dispatch(deleteAttachment(props.model, modelType, att.type) as any)}
              viewFileTooltip={t('invoice.attachmentViewTooltip', {type: att.type})}
            />
          </Col>
        ))}

        <ProposedAttachmentsDropzones claim={mapModelType(modelType)} model={props.model} modelType={modelType} />
      </Row>
    </>
  );
};

export const AttachmentsForm = connect(null, {updateAttachment, deleteAttachment})(_AttachmentsForm);


function mapModelType(modelType: keyof AttachmentModelTypes): Claim {
  switch (modelType) {
    case 'client':
      return Claim.ManageClients;
    case 'invoice':
      return Claim.ManageInvoices;
    case 'quotation':
      return Claim.ManageQuotations;
    default:
      throw new Error(`Attachment security for ${modelType} mapping not implemented`);
  }
}
