import React, {useState} from 'react';
import {connect} from 'react-redux';
import {FormLabel, FormGroup, Alert} from 'react-bootstrap';

import {t} from '../../utils';
import {Attachment} from '../../../models';
import {ConfacState} from '../../../reducers/app-state';
import {PopupButton, Popup} from '../Popup';
import {SimpleCreatableSelect} from '../form-controls/select/SimpleCreatableSelect';
import {AddIcon} from '../Icon';
import {AttachmentDropzone} from './AttachmentDropzone';


type AddAttachmentPopupProps = {
  attachments: Attachment[],
  onAdd: ({file: File, type: string}) => void,
  attachmentTypes: string[],
}

const AddAttachmentPopupComponent = (props: AddAttachmentPopupProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const _onUpload = () => {
    props.onAdd({type, file});
    setIsModalOpen(false);
  };

  const {attachments} = props;
  const canAddFile = type && !attachments.map(a => a.type.toUpperCase()).includes(type.toUpperCase());

  const buttons: PopupButton[] = [{
    text: t('cancel'),
    onClick: () => setIsModalOpen(false),
    variant: 'light',
  }, {
    text: t('add'),
    variant: 'primary',
    onClick: _onUpload,
    disabled: !canAddFile || !file,
  }];

  return (
    <>
      <AddIcon
        style={{marginTop: 0, marginLeft: 16, marginBottom: 26}}
        onClick={() => setIsModalOpen(true)}
        label={t('invoice.attachmentsAdd')}
        size={1}
      />

      {isModalOpen && (
      <Popup title={t('invoice.attachmentsAdd')} buttons={buttons} onHide={() => setIsModalOpen(false)}>
        <FormGroup>
          <FormLabel>{t('attachment.type')}</FormLabel>
          <SimpleCreatableSelect
            value={type}
            options={props.attachmentTypes}
            onChange={(text: string) => setType(text)}
          />
        </FormGroup>

        {!canAddFile && type ? (
          <Alert variant="danger">{t('attachment.typeExists')}</Alert>
        ) : null}

        {canAddFile && type
        && (
        <div style={{maxWidth: '50%'}}>
          <AttachmentDropzone className="attachment" onUpload={(f: File) => setFile(f)} fileType={type} />
        </div>
        )}
      </Popup>
      )}
    </>
  );
};

export const AddAttachmentPopup = connect((state: ConfacState) => ({
  attachmentTypes: state.config.attachmentTypes,
}), {})(AddAttachmentPopupComponent);
