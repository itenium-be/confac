import {useEffect, useState} from 'react';
import {EditIcon} from '../../controls/Icon';
import {t} from '../../utils';
import InvoiceModel from '../models/InvoiceModel';
import {ListSelect, ListSelectionItem} from '../../controls/table/ListSelect';
import {Modal} from '../../controls/Modal';
import {SearchStringInput} from '../../controls/form-controls/inputs/SearchStringInput';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../../reducers/app-state';
import {searchInvoices} from '../models/getInvoiceFeature';


export type InvoiceCreditNotasModalProps = {
  onConfirm: (invoiceIds: ListSelectionItem<string>) => void;
  model: InvoiceModel;
}

export const InvoiceCreditNotasModal = ({model, onConfirm}: InvoiceCreditNotasModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>(model.creditNotas);

  useEffect(() => {
    setSelectedInvoices(model.creditNotas);
  }, [model.creditNotas]);

  return (
    <>
      <EditIcon onClick={() => setOpen(true)} label={t('invoice.creditNotas.addLine')} size={1} />

      {open && (
        <Modal
          show
          onClose={() => setOpen(false)}
          onConfirm={() => onConfirm(selectedInvoices)}
          title={t('invoice.creditNotas.title')}
          dialogClassName="linked-invoices-modal"
        >
          <ModalBody
            model={model}
            selectedInvoices={selectedInvoices}
            setSelectedInvoices={setSelectedInvoices}
          />
        </Modal>
      )}
    </>
  );
};


type ModelBodyProps = {
  model: InvoiceModel;
  selectedInvoices: string[];
  setSelectedInvoices: (invoiceIds: string[]) => void;
}

const ModalBody = ({model, selectedInvoices, setSelectedInvoices}: ModelBodyProps) => {
  const [needle, setNeedle] = useState<string>('');
  const invoices = useSelector((state: ConfacState) => state.invoices.filter(i => !i.isQuotation && i._id !== model._id));
  const selectedInvoiceModels = selectedInvoices.map(id => invoices.find(i => i._id === id)!);

  let filteredInvoices = invoices;
  if (needle) {
    const filters = {freeText: needle};
    filteredInvoices = invoices.filter(invoice => searchInvoices(filters, invoice));
  }
  filteredInvoices = filteredInvoices.sort((a, b) => b.number - a.number);

  return (
    <>
      <SearchStringInput
        value={needle}
        onChange={str => setNeedle(str)}
      />
      <ListSelect
        data={filteredInvoices}
        value={selectedInvoiceModels}
        onChange={selection => setSelectedInvoices(selection.map(i => i._id))}
        listSize={10}
      />
    </>
  );
};
