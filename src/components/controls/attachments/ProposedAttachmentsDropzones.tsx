import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Dropzone from 'react-dropzone';
import {Col} from 'react-bootstrap';
import {ConfacState} from '../../../reducers/app-state';
import {IAttachment} from '../../../models';
import {t} from '../../utils';
import {Icon} from '../Icon';
import {updateAttachment} from '../../../actions/attachmentActions';

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

  const style = {
    cursor: 'pointer',
    opacity: 0.5,
  };

  const onDrop = (uploaded: File, attachmentType: string): void => {
    // console.log('uploaded', attachmentType, uploaded);
    dispatch(updateAttachment(model, modelType, {file: uploaded, type: attachmentType}));
  };

  return (
    <>
      {extraAttachments.map((a: string) => (
        <Col key={a} lg={4} md={6}>
          <div style={style} className="attachment">
            <Dropzone
              onDrop={(accepted: File[], rejected: File[]) => onDrop(accepted[0], a)}
              multiple={false}
              style={{textAlign: 'left'}}
            >
              <Icon fa="fa fa-file-upload" style={{marginRight: 8}} />
              <span style={{paddingBottom: 5}}>{t('invoice.attachmentsProposed', {type: a})}</span>
            </Dropzone>
          </div>
        </Col>
      ))}
    </>
  );
};
