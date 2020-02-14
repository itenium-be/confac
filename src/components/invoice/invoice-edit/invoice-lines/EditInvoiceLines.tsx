import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
import {t} from '../../../utils';
import {createEditInvoiceLine} from './EditInvoiceLineFactory';
import {EditInvoiceLineIcons, EditInvoiceDragHandle} from './EditInvoiceLineIcons';
import InvoiceModel from '../../models/InvoiceModel';
import {AddIcon, EditIcon} from '../../../controls/Icon';


type EditInvoiceLinesProps = {
  invoice: InvoiceModel,
  onChange: any,
}

type EditInvoiceLinesState = {
  notesVisible: boolean,
}

export default class EditInvoiceLines extends Component<EditInvoiceLinesProps, EditInvoiceLinesState> {
  constructor(props: EditInvoiceLinesProps) {
    super(props);
    this.state = {notesVisible: false};
  }

  onDragEnd(result: DropResult): void {
    // dropped outside the list or didn't actually move
    if (!result.destination || result.source.index === result.destination.index) {
      return;
    }

    // console.log('onDragEnd', result);
    this.props.onChange(this.props.invoice.reorderLines(result.source.index, result.destination.index));
  }

  render() {
    const {invoice, onChange} = this.props;
    const {lines} = invoice;

    const tp = (transKey: string): string => t(invoice.getType() + transKey);
    // console.log('lines', invoice.lines);

    const {notesVisible} = this.state;
    const nrOfColumns = 7;
    return (
      <Table size="sm">
        <thead>
          <tr>
            <th style={{width: '1%'}}>&nbsp;</th>
            <th style={{width: '30%'}}>{t('client.projectDesc')}</th>
            <th style={{width: '10%'}}>{t('rates.type')}</th>
            <th style={{width: '10%'}}>{t('rates.value')}</th>
            <th style={{width: '10%'}}>{t('rates.rate')}</th>
            <th style={{width: '10%'}}>{t('config.company.btw')}</th>
            <th style={{width: notesVisible ? '30%' : '1%'}}>
              <div style={{whiteSpace: 'nowrap', display: 'inline'}}>
                {t('notes')}
                <EditIcon
                  style={{marginLeft: 6}}
                  title=""
                  size={1}
                  onClick={() => this.setState({notesVisible: !notesVisible})}
                  data-tst="line-notes-toggle"
                />
              </div>
            </th>
            <th style={{width: '1%'}}>&nbsp;</th>
          </tr>
        </thead>
        <DragDropContext onDragEnd={drag => this.onDragEnd(drag)}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <tbody ref={provided.innerRef}>
                {lines.map((item, index) => (
                  <Draggable key={item.sort} draggableId={(typeof item.sort === 'number' ? item.sort : index).toString()} index={index}>
                    {(providedInner, snapshotInner) => {
                      const EditInvoiceLine = createEditInvoiceLine(item);
                      const props = {index, line: item, ...this.props};
                      return (
                        <tr ref={providedInner.innerRef} {...providedInner.draggableProps} {...providedInner.dragHandleProps}>
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
              <AddIcon onClick={() => onChange(invoice.addLine())} label={tp('.addLine')} size={1} data-tst="line-add" />
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}
