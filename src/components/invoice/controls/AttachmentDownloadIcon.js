import React, {Component, PropTypes} from 'react';
import {Icon, SpinnerIcon} from '../../controls/Icon.js';
import {downloadInvoice} from '../../../actions/index.js';
import t from '../../../trans.js';

export class AttachmentDownloadIcon extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
  }
  constructor() {
    super();
    this.state = {isBusy: false};
  }
  static defaultProps = {
    type: 'pdf'
  }
  render() {
    const {invoice, type, ...props} = this.props;
    const onClick = () => {
      this.setState({isBusy: true});
      downloadInvoice(invoice, type).then(() => this.setState({isBusy: false}));
    };

    if (this.state.isBusy) {
      const offset = type === 'pdf' ? -12 : 0;
      return <SpinnerIcon style={{marginLeft: offset}} />;
    }

    return (
      <Icon
        fa="fa fa-file-pdf-o fa-2x"
        title={t('invoice.downloadAttachment', {type})}
        {...props}
        onClick={() => onClick()}
        color={this.state.isBusy ? '#DCDAD1' : undefined} />
    );
  }
}
