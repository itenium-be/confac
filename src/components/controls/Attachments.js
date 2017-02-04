import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Dropzone from 'react-dropzone';
import {t} from '../util.js';

import {Row, Col, ControlLabel, FormGroup, Alert} from 'react-bootstrap';
import {AttachmentDownloadIcon, AddIcon, Popup, SimpleCreatableSelect, ConfirmedDeleteIcon, HeaderWithEditIcon} from '../controls.js';
import {updateAttachment, deleteAttachment} from '../../actions/index.js';

class AttachmentsFormComponent extends Component {
  static propTypes = {
    deleteAttachment: PropTypes.func.isRequired,
    updateAttachment: PropTypes.func.isRequired,
    invoice: PropTypes.object,
    client: PropTypes.object,
  }

  render() {
    const {invoice, client} = this.props;
    const model = invoice || client;
    const modelType = model === invoice ? 'invoice' : 'client';

    if (!model._id) {
      return <div />;
    }

    return (
      <AbstractAttachmentsForm
        attachments={model.attachments}
        onDelete={att => this.props.deleteAttachment(model, modelType, att)}
        onAdd={att => this.props.updateAttachment(model, modelType, att)}
        model={model}
        modelType={modelType}
      />
    );
  }
}

export const AttachmentsForm = connect(() => ({}), {updateAttachment, deleteAttachment})(AttachmentsFormComponent);


class AbstractAttachmentsForm extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    modelType: PropTypes.oneOf(['invoice', 'client']),
  }

  constructor() {
    super();
    this.state = {
      isOpen: false,
      isFormOpen: false,
      hoverId: null,
    };
  }

  render() {
    const canDeleteAttachments = this.props.attachments.length > (this.props.modelType === 'invoice' ? 1 : 0);
    return (
      <Row>
        <HeaderWithEditIcon
          label={t('invoice.attachments')}
          editIconVisible={canDeleteAttachments}
          onEditClick={() => this.setState({isFormOpen: !this.state.isFormOpen})}
        />

        <AddIcon
          style={{marginTop: 0, marginLeft: 16}}
          onClick={() => this.setState({isOpen: true})}
          label={t('invoice.attachmentsAdd')}
          size={1}
        />

        <AddAttachmentPopup
          isOpen={this.state.isOpen}
          attachments={this.props.attachments}
          onClose={() => this.setState({isOpen: false})}
          onAdd={att => this.props.onAdd(att)}
        />

        <br />

        {this.props.attachments.map(att => (
          <Col sm={3} key={att.type} style={{height: 45}}>
            <div
              style={{padding: 5, marginTop: 10, border: this.state.isFormOpen && att.type === this.state.hoverId ? '1px gray dotted' : ''}}
              onMouseOver={() => this.setState({hoverId: att.type !== 'pdf' ? att.type : null})}
              onMouseOut={() => this.setState({hoverId: null})}
            >
              <AttachmentDownloadIcon model={this.props.model} attachment={att} modelType={this.props.modelType} />
              <span style={{marginLeft: 10}}>{att.type !== 'pdf' ? att.type : t('invoice.invoice')}</span>
              {this.state.isFormOpen && att.type !== 'pdf' ? (
                <div style={{display: 'inline', position: 'absolute', right: 20}}>
                  <ConfirmedDeleteIcon title={t('attachment.deleteTitle')} onClick={this.props.onDelete.bind(this, att)}>
                    {t('attachment.deletePopup')}
                  </ConfirmedDeleteIcon>
                </div>
              ) : null}
            </div>
          </Col>
        ))}
      </Row>
    );
  }
}


class AddAttachmentPopupComponent extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    attachmentTypes: PropTypes.array.isRequired,
    isOpen: PropTypes.bool.isRequired,
  }

  constructor() {
    super();
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
      return <div />;
    }

    const {attachments, onClose} = this.props;
    const currentType = this.state.type;
    const canAdd = currentType && !attachments.map(a => a.type.toUpperCase()).includes(currentType.toUpperCase());

    const buttons = [{
      text: t('cancel'),
      onClick: () => onClose(),
    }, {
      text: t('add'),
      bsStyle: 'primary',
      onClick: this._onUpload.bind(this),
      disabled: !canAdd || !this.state.file,
    }];
    return (
      <Popup title={t('invoice.attachmentsAdd')} buttons={buttons} onHide={onClose}>
        <FormGroup>
          <ControlLabel>{t('attachment.type')}</ControlLabel>
          <SimpleCreatableSelect
            value={currentType}
            options={this.props.attachmentTypes}
            onChange={text => this.setState({type: text})}
            promptTextCreator={text => t('controls.addLabelText', {text})}
          />
        </FormGroup>

        {!canAdd && currentType ?<Alert bsSize="small" bsStyle="danger">{t('attachment.typeExists')}</Alert>: null}

        <AddAttachment onAdd={file => this.setState({file})} />
      </Popup>
    );
  }
}

export const AddAttachmentPopup = connect(state => ({
  attachmentTypes: state.config.attachmentTypes,
}), {})(AddAttachmentPopupComponent);





class AddAttachment extends Component {
  static propTypes = {
    onAdd: PropTypes.func.isRequired,
  }

  onDrop(acceptedFiles, rejectedFiles) {
    this.props.onAdd(acceptedFiles[0]);
    // console.log('Accepted files: ', acceptedFiles);
    // console.log('Rejected files: ', rejectedFiles);
  }

  render() {
    const style = {
      width: 250,
      height: 55,
      borderWidth: 2,
      borderColor: '#666',
      borderStyle: 'dashed',
      borderRadius: 5,
      padding: 5,
      marginTop: 7,
    };

    return (
      <div>
        <Dropzone onDrop={this.onDrop.bind(this)} multiple={false} style={style}>
          <div>{t('invoice.attachmentsDropzone')}</div>
        </Dropzone>
      </div>
    );
  }
}
