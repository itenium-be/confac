import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Dropzone from 'react-dropzone';
import {t} from '../util.js';

import {Row, Col, FormLabel, FormGroup, Alert} from 'react-bootstrap';
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
    const modelType = model === client ? 'client' : model.getType();

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
    modelType: PropTypes.oneOf(['invoice', 'client', 'quotation']),
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
    const canDeleteAttachments = this.props.attachments.length > (this.props.modelType === 'client' ? 0 : 1);
    const transPrefix = this.props.modelType;
    return (
      <Row className="tst-attachments"><Col>
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
          data-tst="add-attachment"
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
              <AttachmentDownloadIcon
                model={this.props.model}
                attachment={att}
                modelType={this.props.modelType}
                data-tst={`att-download-${att.type}`}
                actionType="download"
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
      </Col></Row>
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
            onChange={text => this.setState({type: text})}
            formatCreateLabel={text => t('controls.addLabelText', {text})}
            data-tst="add-att-type"
          />
        </FormGroup>

        {!canAdd && currentType ? (
          <Alert size="sm" variant="danger" data-tst="add-att-type-warning">{t('attachment.typeExists')}</Alert>
        ) : null}

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
        <Dropzone onDrop={this.onDrop.bind(this)} multiple={false} style={style} className="tst-dropzone">
          <div>{t('invoice.attachmentsDropzone')}</div>
        </Dropzone>
      </div>
    );
  }
}
