import React, { Component, PropTypes } from 'react';
import t from '../trans.js';

import { NumericInput, StringInput, Icon } from '../controls/index.js';
import { Table } from 'react-bootstrap';

export default class CreateInvoiceLines extends Component {
  static propTypes = {
    lines: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  updateLine(index, updateWith) {
    var newArr = this.props.lines.slice();
    newArr[index] = Object.assign({}, newArr[index], updateWith);
    this.props.onChange(newArr);
  }
  addLine() {
    var newArr = this.props.lines.slice();
    newArr.push({desc: '', hours: 0, rate: 0});
    this.props.onChange(newArr);
  }
  removeLine(index) {
    var newArr = this.props.lines.slice();
    newArr.splice(index, 1);
    this.props.onChange(newArr);
  }

  render() {
    return (
      <Table condensed>
        <thead>
          <tr>
            <th width="60%">{t('client.projectDesc')}</th>
            <th width="20%">{t('invoice.hours')}</th>
            <th width="19%">{t('client.hourlyRate')}</th>
            <th width="1%">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {this.props.lines.map((line, index) => {
            return (
              <tr key={index}>
                <td>
                  <StringInput
                    value={line.desc}
                    onChange={value => this.updateLine(index, {desc: value})}
                  />
                </td>

                <td>
                  <NumericInput
                    float
                    value={line.hours}
                    onChange={value => this.updateLine(index, {hours: value})}
                  />
                </td>

                <td>
                  <NumericInput
                    float
                    value={line.rate}
                    onChange={value => this.updateLine(index, {rate: value})}
                  />
                </td>

                <td>
                  {index > 0 ? <Icon fa="fa fa-minus-circle fa-2x" onClick={() => this.removeLine(index)} color="#CC1100" /> : <div />}
                </td>
              </tr>
            );
          })}
          {this.props.lines.length ? (
            <tr>
              <td colSpan={4}>
                <Icon fa="fa fa-plus fa-2x" onClick={() => this.addLine()} color="#FF8C00" />
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>
    );
  }
}
