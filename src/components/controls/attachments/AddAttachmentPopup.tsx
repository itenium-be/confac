import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FormLabel, FormGroup, Alert} from 'react-bootstrap';
import {t} from '../../utils';
import {Popup, SimpleCreatableSelect, PopupButton} from '../../controls'; // TODO: Dependency cycle detected
import {Attachment} from '../../../models';
import {ConfacState} from '../../../reducers/app-state';
import {AttachmentDropzone} from './AttachmentDropzone';


type AddAttachmentPopupProps = {
  attachments: Attachment[],
  onClose: (...args: any[]) => any,
  onAdd: ({file: File, type: string}) => void,
  attachmentTypes: string[],
  isOpen: boolean,
}

type AddAttachmentPopupState = {
  type: string,
  file: File | null,
}

class AddAttachmentPopupComponent extends Component<AddAttachmentPopupProps, AddAttachmentPopupState> {
  constructor(props: AddAttachmentPopupProps) {
    super(props);
    this.state = {
      type: '',
      file: null,
    };
  }

  _onUpload() {
    this.props.onAdd(this.state);
    this.props.onClose();
  }

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    const {attachments, onClose} = this.props;
    const currentType = this.state.type;
    const canAdd = currentType && !attachments.map(a => a.type.toUpperCase()).includes(currentType.toUpperCase());

    const buttons: PopupButton[] = [{
      text: t('cancel'),
      onClick: () => onClose(),
      variant: 'light',
    }, {
      text: t('add'),
      variant: 'primary',
      onClick: this._onUpload.bind(this),
      disabled: !canAdd || !this.state.file,
    }];
    return (
      <Popup title={t('invoice.attachmentsAdd')} buttons={buttons} onHide={onClose} data-tst="add-att">
        <FormGroup>
          <FormLabel>{t('attachment.type')}</FormLabel>
          <SimpleCreatableSelect
            value={currentType}
            options={this.props.attachmentTypes}
            onChange={(text: string) => this.setState({type: text})}
            data-tst="add-att-type"
          />
        </FormGroup>

        {!canAdd && currentType ? (
          <Alert variant="danger" data-tst="add-att-type-warning">{t('attachment.typeExists')}</Alert>
        ) : null}

        <AttachmentDropzone onAdd={(file: File) => this.setState({file})} />
      </Popup>
    );
  }
}

export const AddAttachmentPopup = connect((state: ConfacState) => ({
  attachmentTypes: state.config.attachmentTypes,
}), {})(AddAttachmentPopupComponent);
