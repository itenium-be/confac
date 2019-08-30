import React from "react";
import { IAttachment } from "../../../models";
import { useSelector, useDispatch } from "react-redux";
import { ConfacState } from "../../../reducers/default-states";
import Dropzone from 'react-dropzone';
import { Col } from "react-bootstrap";
import { t } from "../../util";
import { Icon } from "../Icon";
import { updateAttachment } from "../../../actions/attachmentActions";

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
    borderWidth: 2,
    borderColor: '#666',
    borderStyle: 'dashed',
    borderRadius: 5,
    padding: 5,
    cursor: 'pointer',
    opacity: 0.5,
  };

  const onDrop = (uploaded: File, attachmentType: string): void => {
    // console.log('uploaded', attachmentType, uploaded);
    dispatch(updateAttachment(model, modelType, {file: uploaded, type: attachmentType}));
  }

  return (
    <>
      {extraAttachments.map((a: string) => {
        return (
          <Col key={a} sm={4}>
            <div style={style}>
              <Dropzone
                onDrop={(accepted: File[], rejected: File[]) => onDrop(accepted[0], a)}
                multiple={false}
                className={'tst-' + a}
                style={{textAlign: 'left'}}
              >
                <Icon fa="fa fa-file-upload" style={{marginRight: 8}} />
                <span style={{paddingBottom: 5}}>{t('invoice.attachmentsProposed', {type: a})}</span>
              </Dropzone>
            </div>
          </Col>
        );
      })}
    </>
  );
}
