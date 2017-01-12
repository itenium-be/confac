import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Icon, SpinnerIcon, VerifyIcon } from './Icon.js';
import { downloadInvoice } from '../../actions/index.js';
import t from '../../trans.js';
import { updateInvoice } from '../../actions/index.js';

class InvoiceVerifyIcon extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    updateInvoice: PropTypes.func.isRequired,
  }
  render() {
    const {invoice} = this.props;
    const successMsg = invoice.verified ? t('invoice.isNotVerified') : t('invoice.isVerified');
    return (
      <BusyVerifyIcon
        model={invoice}
        style={{marginLeft: 8}}
        onClick={() => this.props.updateInvoice({...invoice, verified: !invoice.verified}, successMsg)}
        title={t('invoice.verifyAction')}
      />
    );
  }
}
export const InvoiceVerifyIconToggle = connect(() => ({}), {updateInvoice})(InvoiceVerifyIcon);

export const EnhanceWithBusySpinner = ComposedComponent => class extends Component {
  static propTypes = {
    isBusy: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    model: PropTypes.any.isRequired,
  };
  constructor() {
    super();
    this.state = {isBusy: false};
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.isBusy && this.props.model !== nextProps.model) {
      this.setState({isBusy: false});
    }
  }
  render() {
    const {isBusy, onClick, dispatch, model, ...props} = this.props; // eslint-disable-line
    if (isBusy && this.state.isBusy) {
      return <SpinnerIcon style={{marginLeft: 0}} />;
    }

    const realOnclick = () => {
      this.setState({isBusy: true});
      onClick();
    };
    return <ComposedComponent {...props} onClick={realOnclick} />;
  }
};

const BusyVerifyIcon = connect(state => ({isBusy: state.app.isBusy}))(EnhanceWithBusySpinner(VerifyIcon));


export class AttachmentDownloadIcon extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['pdf', 'timesheet']),
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
