import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {t, EditInvoiceViewModel} from '../util.js';

import * as Control from '../controls.js';
import {Table} from 'react-bootstrap';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {createEditInvoiceLine} from './invoice-lines/EditInvoiceLineFactory.js';


export default class EditInvoiceLines extends Component {
  static propTypes = {
    invoice: PropTypes.instanceOf(EditInvoiceViewModel).isRequired,
    onChange: PropTypes.func.isRequired,
  }
  constructor() {
    super();
    this.state = {notesVisible: false};
  }

  // onDragEnd(result) {
  //   // dropped outside the list
  //   console.log('onDragEnd', result);
  //   if (!result.destination) {
  //     return;
  //   }

  //   this.props.onChange(this.props.invoice.reorderLines(result.source.index, result.destination.index));
  // }

  render() {
    const {invoice, onChange} = this.props;
    const lines = invoice.lines;

    // console.log('lines', invoice.lines);

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
          {lines.map((item, index) => {
            const EditInvoiceLine = createEditInvoiceLine(item);
            return (
              <EditInvoiceLine key={index} index={index} line={item} {...this.props} />
            )
          })}

          {/*<DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {lines.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => {
                      const EditInvoiceLine = createEditInvoiceLine(item);
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <EditInvoiceLine key={index} index={index} line={item} {...this.props} />
                        </div>
                      )
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
            </Droppable>
          </DragDropContext>*/}
          <tr>
            <td colSpan={nrOfColumns}>
              <Control.AddIcon onClick={() => onChange(invoice.addLine())} label={t('invoice.addLine')} size={1} data-tst="line-add" />
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}
