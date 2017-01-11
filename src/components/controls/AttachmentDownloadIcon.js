import React, { Component, PropTypes } from 'react';
import { Icon, SpinnerIcon } from './Icon.js';
import { downloadInvoice } from '../../actions/index.js';

export class AttachmentDownloadIcon extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['pdf', 'timesheet']),
  }
  constructor() {
    super();
    this.state = {isDownloading: false};
  }
  static defaultProps = {
    type: 'pdf'
  }
  render() {
    const {invoice, type, ...props} = this.props;
    const onClick = () => {
      this.setState({isDownloading: true});
      downloadInvoice(invoice, type).then(() => this.setState({isDownloading: false}));
    };

    if (this.state.isDownloading) {
      const offset = type === 'pdf' ? -12 : 0;
      return <SpinnerIcon style={{marginLeft: offset}} />;
    }

    return (
      <Icon
        fa="fa fa-file-pdf-o fa-2x"
        {...props}
        onClick={() => onClick()}
        color={this.state.isDownloading ? '#DCDAD1' : undefined} />
    );
  }
}
