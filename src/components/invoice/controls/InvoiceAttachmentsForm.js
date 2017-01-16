import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Dropzone from 'react-dropzone';
import {t} from '../../util.js';

import {Row, Col, ControlLabel, FormGroup, Alert} from 'react-bootstrap';
import {AttachmentDownloadIcon, AddIcon, Popup, SimpleSelect} from '../../controls.js';
import {updateInvoiceAttachment} from '../../../actions/index.js';

export class InvoiceAttachmentsForm extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.state = {isOpen: false};
  }

  render() {
    const {invoice} = this.props;
    if (invoice.isNew) {
      return <div />;
    }
    return (
      <div>
        <Row>
          <h4>{t('invoice.attachments')}</h4>
          <Col sm={3} key="pdf">
            <AttachmentDownloadIcon invoice={invoice} />
          </Col>
          {invoice.attachments.filter(att => att !== 'pdf').map(att => (
            <Col sm={3} key={att}>
              <AttachmentDownloadIcon invoice={invoice} type={att} />
              <span style={{marginLeft: 10}}>{att}</span>
            </Col>
          ))}
        </Row>
        <Row>
          {!this.state.isOpen ? (
            <AddIcon onClick={() => this.setState({isOpen: true})} label={t('invoice.attachmentsAdd')} size={1} />
          ) : (
            <AddAttachmentPopup invoice={invoice} onClose={() => this.setState({isOpen: false})} />
          )}
        </Row>
      </div>
    );
  }
}

class AddAttachmentPopupComponent extends Component {
  static propTypes = {
    updateInvoiceAttachment: PropTypes.func.isRequired,
    invoice: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    attachmentTypes: PropTypes.array.isRequired,
  }

  constructor() {
    super();
    this.state = {
      type: '',
      file: null,
    };
  }

  _onUpload() {
    this.props.updateInvoiceAttachment(this.props.invoice, this.state);
    this.props.onClose();
  }

  render() {
    const {invoice, onClose} = this.props;
    const currentType = this.state.type;
    const canAdd = currentType && !invoice.attachments.map(a => a.toUpperCase()).includes(currentType.toUpperCase());

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
          <SimpleSelect
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
}), {updateInvoiceAttachment})(AddAttachmentPopupComponent);





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
