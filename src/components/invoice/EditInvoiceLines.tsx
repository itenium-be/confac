import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {t, EditInvoiceViewModel} from '../util';

import * as Control from '../controls';
import {Table} from 'react-bootstrap';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {createEditInvoiceLine} from './invoice-lines/EditInvoiceLineFactory';
import {EditInvoiceLineIcons, EditInvoiceDragHandle} from './invoice-lines/EditInvoiceLineIcons';

export default class EditInvoiceLines extends Component {
  static propTypes = {
    invoice: PropTypes.instanceOf(EditInvoiceViewModel).isRequired,
    onChange: PropTypes.func.isRequired,
  }
  constructor() {
    super();
    this.state = {notesVisible: false};
  }

  onDragEnd(result) {
    // dropped outside the list or didn't actually move
    if (!result.destination || result.source.index === result.destination.index) {
      return;
    }

    // console.log('onDragEnd', result);
    this.props.onChange(this.props.invoice.reorderLines(result.source.index, result.destination.index));
  }

  render() {
    const {invoice, onChange} = this.props;
    const lines = invoice.lines;

    const tp = transKey => t(invoice.getType() + transKey);
    // console.log('lines', invoice.lines);

    const {notesVisible} = this.state;
    const nrOfColumns = 7;
    return (
      <Table size="sm">
        <thead>
          <tr>
            <th width="1%">&nbsp;</th>
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
        <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <tbody ref={provided.innerRef}>
                {lines.map((item, index) => (
                  <Draggable key={item.sort} draggableId={item.sort} index={index}>
                    {(provided, snapshot) => {
                      const EditInvoiceLine = createEditInvoiceLine(item);
                      const props = {index, line: item, ...this.props};
                      return (
                        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <EditInvoiceDragHandle />
                          <EditInvoiceLine {...props} />
                          <EditInvoiceLineIcons {...props} />
                        </tr>
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </DragDropContext>
        <tbody>
          <tr>
            <td colSpan={nrOfColumns}>
              <Control.AddIcon onClick={() => onChange(invoice.addLine())} label={tp('.addLine')} size={1} data-tst="line-add" />
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}
