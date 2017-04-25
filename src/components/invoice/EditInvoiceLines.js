import React, {Component, PropTypes} from 'react';
import {t, EditInvoiceViewModel} from '../util.js';

import * as Control from '../controls.js';
import {Table} from 'react-bootstrap';

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
                />
              </div>
            </th>
            <th width="1%">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => {
            return (
              <tr key={index}>
                <td>
                  <Control.StringInput
                    value={line.desc}
                    onChange={value => onChange(invoice.updateLine(index, {desc: value}))}
                    data-tst={`line-${index}-desc`}
                  />
                </td>

                <td>
                  <Control.InvoiceLineTypeSelect
                    type={line.type}
                    onChange={value => onChange(invoice.updateLine(index, {type: value}))}
                    data-tst={`line-${index}-type`}
                  />
                </td>

                <td>
                  <Control.NumericInput
                    float
                    value={line.amount}
                    onChange={value => onChange(invoice.updateLine(index, {amount: value}))}
                    data-tst={`line-${index}-amount`}
                  />
                </td>

                <td>
                  <Control.NumericInput
                    prefix="€"
                    addOnMinWidth={925}
                    float
                    value={line.price}
                    onChange={value => onChange(invoice.updateLine(index, {price: value}))}
                    data-tst={`line-${index}-price`}
                  />
                </td>

                <td>
                  <Control.NumericInput
                    suffix="%"
                    addOnMinWidth={925}
                    float
                    value={line.tax}
                    onChange={value => onChange(invoice.updateLine(index, {tax: value}))}
                    data-tst={`line-${index}-tax`}
                  />
                </td>

                <td>
                  <Control.TextareaInput
                    style={{height: 35}}
                    value={line.notes}
                    onChange={value => onChange(invoice.updateLine(index, {notes: value}))}
                    data-tst={`line-${index}-notes`}
                  />
                </td>

                <td>
                  {index > 0 ? <Control.DeleteIcon onClick={() => onChange(invoice.removeLine(index))} /> : <div />}
                </td>
              </tr>
            );
          })}
          {lines.length ? (
            <tr>
              <td colSpan={nrOfColumns}>
                <Control.AddIcon onClick={() => onChange(invoice.addLine())} label={t('invoice.addLine')} size={1} />
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>
    );
  }
}
