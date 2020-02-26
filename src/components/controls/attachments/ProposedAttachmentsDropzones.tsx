import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Col} from 'react-bootstrap';
import {ConfacState} from '../../../reducers/app-state';
import {IAttachment} from '../../../models';
import {updateAttachment} from '../../../actions/attachmentActions';
import {AttachmentDropzone} from './AttachmentDropzone';

type ProposedAttachmentsProps = {
  model: IAttachment,
  modelType: 'client' | 'invoice' | 'quotation',
}

/**
 * Display easier upload capability for config.attachmentTypes
 * if these attachment types have not yet been uploaded
 */
export const ProposedAttachmentsDropzones = ({model, modelType}: ProposedAttachmentsProps) => {
  const proposedAttachmentTypes = useSelector((state: ConfacState) => state.config.attachmentTypes);
  const dispatch = useDispatch();

  if (!model._id || modelType !== 'invoice') {
    return null;
  }

  const attachmentKeys = model.attachments.map(a => a.type);
  const extraAttachments: string[] = proposedAttachmentTypes.filter((type: string) => !attachmentKeys.includes(type));

  if (extraAttachments.length === 0) {
    return null;
  }

  const onDrop = (file: File, fileType: string): void => {
    dispatch(updateAttachment(model, modelType, {file, type: fileType}));
  };

  return (
    <>
      {extraAttachments.map((fileType: string) => (
        <Col key={fileType} lg={4} md={6}>
          <AttachmentDropzone
            className="attachment"
            onUpload={(file: File) => onDrop(file, fileType)}
            fileType={fileType}
          />
        </Col>
      ))}
    </>
  );
};
