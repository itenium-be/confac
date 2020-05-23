import React from 'react';
import {Table} from 'react-bootstrap';
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
import {t} from '../../../utils';
import {createEditInvoiceLine} from './EditInvoiceLineFactory';
import {EditInvoiceLineIcons} from './EditInvoiceLineIcons';
import {AddIcon, DragAndDropIcon} from '../../../controls/Icon';
import {BaseInputProps} from '../../../controls/form-controls/inputs/BaseInput';
import {InvoiceLineActions, InvoiceLine} from '../../models/InvoiceLineModels';
import InvoiceModel from '../../models/InvoiceModel';


type EditInvoiceLinesProps = BaseInputProps<InvoiceLine[]> & {
  translationPrefix: 'quotation' | 'invoice';
  allowEmpty?: boolean;
  invoice?: InvoiceModel;
};


export const EditInvoiceLines = ({value, onChange, invoice, translationPrefix = 'invoice', allowEmpty = false}: EditInvoiceLinesProps) => {
  function onDragEnd(result: DropResult): void {
    // dropped outside the list or didn't actually move
    if (!result.destination || result.source.index === result.destination.index) {
      return;
    }

    // console.log('onDragEnd', result);
    onChange(InvoiceLineActions.reorderLines(value, result.source.index, result.destination.index));
  }

  const tp = (transKey: string): string => t(translationPrefix + transKey);

  const nrOfColumns = 6;
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
          <th style={{width: '1%'}}>&nbsp;</th>
        </tr>
      </thead>
      <DragDropContext onDragEnd={drag => onDragEnd(drag)}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <tbody ref={provided.innerRef}>
              {value.map((item, index) => (
                <Draggable key={item.sort} draggableId={(typeof item.sort === 'number' ? item.sort : index).toString()} index={index}>
                  {(providedInner, snapshotInner) => {
                    const EditInvoiceLine = createEditInvoiceLine(item);
                    return (
                      <tr ref={providedInner.innerRef} {...providedInner.draggableProps} {...providedInner.dragHandleProps}>
                        <td><DragAndDropIcon /></td>
                        <EditInvoiceLine lines={value} index={index} onChange={onChange} line={item} invoice={invoice} />
                        <EditInvoiceLineIcons lines={value} index={index} allowEmpty={allowEmpty} onChange={onChange} />
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
            <AddIcon onClick={() => onChange(InvoiceLineActions.addEmptyLine(value))} label={tp('.addLine')} size={1} />
          </td>
        </tr>
      </tbody>
    </Table>
  );
};
