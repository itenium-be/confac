import React, {Component, PropTypes} from 'react';
import {t, EditInvoiceViewModel} from '../util.js';

import * as Control from '../controls.js';
import {Table} from 'react-bootstrap';
// import {DragSource} from 'react-dnd';
import {EditInvoiceDefaultLine} from './invoice-lines/EditInvoiceDefaultLine.js';
import {EditInvoiceSectionLine} from './invoice-lines/EditInvoiceSectionLine.js';


const lineTypeComponentMapping = {
  section: EditInvoiceSectionLine
};



export default class EditInvoiceLines extends Component {
  static propTypes = {
    invoice: PropTypes.instanceOf(EditInvoiceViewModel).isRequired,
    onChange: PropTypes.func.isRequired,
  }
  constructor() {
    super();
    this.state = {notesVisible: false};
  }

  render() {
    const {invoice, onChange} = this.props;
    const lines = invoice.lines;

    const {notesVisible} = this.state;
    const nrOfColumns = 7;
    return (
      <Table condensed>
        <thead>
          <tr>
            <th width="30%">{t('client.projectDesc')}</th>
            <th width="10%">{t('rates.type')}</th>
            <th width="10%">{t('rates.value')}</th>
            <th width="10%">{t('rates.rate')}</th>
            <th width="10%">{t('config.company.btw')}</th>
            <th width={notesVisible ? '30%' : '1%'}>
              <div style={{whiteSpace: 'nowrap', display: 'inline'}}>
                {t('notes')}
                <Control.EditIcon
                  style={{marginLeft: 6}}
                  title=""
                  size={1}
                  onClick={() => this.setState({notesVisible: !notesVisible})}
                  data-tst="line-notes-toggle"
                />
              </div>
            </th>
            <th width="1%">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => {
            const CustomLineComponent = lineTypeComponentMapping[line.type];
            if (CustomLineComponent) {
              return (
                <CustomLineComponent
                  key={index}
                  index={index}
                  onChange={onChange}
                  invoice={invoice}
                  line={line}
                />
              );
            }

            return <EditInvoiceDefaultLine key={index} index={index} line={line} {...this.props} />;
          })}
          {lines.length ? (
            <tr>
              <td colSpan={nrOfColumns}>
                <Control.AddIcon onClick={() => onChange(invoice.addLine())} label={t('invoice.addLine')} size={1} data-tst="line-add" />
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>
    );
  }
}
