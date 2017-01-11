import React, { Component, PropTypes } from 'react';
import { PdfIcon } from '../controls.js';
import { downloadInvoice } from '../../actions/index.js';

export class AttachmentDownloadIcon extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['pdf', 'timesheet']),
  }
  static defaultProps = {
    type: 'pdf'
  }
  render() {
    return (
      <PdfIcon onClick={() => downloadInvoice(this.props.invoice, this.props.type)} />
    );
  }
}
