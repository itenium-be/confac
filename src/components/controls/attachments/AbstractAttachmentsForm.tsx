import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {HeaderWithEditIcon} from '../Headers';
import {t} from '../../utils';
import {AddIcon, ConfirmedDeleteIcon} from '../Icon';
import {AddAttachmentPopup} from './AddAttachmentPopup';
import {ProposedAttachmentsDropzones} from './ProposedAttachmentsDropzones';
import {AttachmentForm} from './AttachmentForm';
import {AttachmentPreviewIcon} from '../../controls';
import {AbstractAttachmentsFormProps, AbstractAttachmentsFormState} from './AttachmentsForm';


export class AbstractAttachmentsForm extends Component<AbstractAttachmentsFormProps, AbstractAttachmentsFormState> {
  constructor(props: AbstractAttachmentsFormProps) {
    super(props);
    this.state = {
      isOpen: false,
      isFormOpen: false,
      hoverId: null,
    };
  }

  render() {
    const attachments = this.props.attachments.filter(att => att.type !== 'pdf');
    const canDeleteAttachments = attachments.length > 0;
    return (
      <Row className="tst-attachments attachments-form">
        <Col sm={12}>
          <HeaderWithEditIcon
            size={2}
            label={t('invoice.attachments')}
            editIconVisible={canDeleteAttachments}
            onEditClick={() => this.setState(prevState => ({isFormOpen: !prevState.isFormOpen}))}
          />

          <AddIcon
            style={{marginTop: 0, marginLeft: 16, marginBottom: 26}}
            onClick={() => this.setState({isOpen: true})}
            label={t('invoice.attachmentsAdd')}
            size={1}
            data-tst="add-attachment"
          />

          <AddAttachmentPopup
            isOpen={this.state.isOpen}
            attachments={this.props.attachments}
            onClose={() => this.setState({isOpen: false})}
            onAdd={(att: { file: File; type: string; }) => this.props.onAdd(att)}
          />
        </Col>

        {attachments.map(att => (
          <Col
            lg={4}
            md={6}
            key={att.type}
            onMouseEnter={() => this.setState({hoverId: att.type})}
            onMouseLeave={() => this.setState({hoverId: null})}
          >
            <AttachmentForm model={this.props.model} modelType={this.props.modelType} attachment={att}>
              {this.state.isFormOpen && (
                <div className="delete">
                  <ConfirmedDeleteIcon
                    title={t('attachment.deleteTitle')}
                    onClick={() => this.props.onDelete(att)}
                    data-tst={`att-delete-${att.type}`}
                  >
                    {t('attachment.deletePopup')}
                  </ConfirmedDeleteIcon>
                </div>
              )}
              {!this.state.isFormOpen && this.state.hoverId === att.type && (
                <div className="delete">
                  <AttachmentPreviewIcon model={this.props.model} modelType={this.props.modelType} attachment={att} />
                </div>
              )}
            </AttachmentForm>
          </Col>
        ))}

        <ProposedAttachmentsDropzones model={this.props.model} modelType={this.props.modelType} />
      </Row>
    );
  }
}
