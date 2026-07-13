import {vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import '@testing-library/jest-dom';
import {DeleteInvoiceModal, DeleteInvoiceModalProps} from '../invoice-edit/DeleteInvoiceModal';
import InvoiceModel from '../models/InvoiceModel';

const buildInvoice = (billitOrderId?: number) => ({
  number: 42,
  client: {name: 'ACME'},
  billit: billitOrderId ? {orderId: billitOrderId} : undefined,
}) as InvoiceModel;

const renderModal = (props: Partial<DeleteInvoiceModalProps> = {}) => {
  const allProps: DeleteInvoiceModalProps = {
    invoice: buildInvoice(),
    canArchive: false,
    isNotLastInvoice: false,
    onClose: vi.fn(),
    onDelete: vi.fn(),
    onArchive: vi.fn(),
    onBackToDraft: vi.fn(),
    ...props,
  };

  render(<MemoryRouter><DeleteInvoiceModal {...allProps} /></MemoryRouter>);
  return allProps;
};

describe('DeleteInvoiceModal', () => {
  it('deletes the invoice', () => {
    const {onDelete} = renderModal();

    fireEvent.click(screen.getByRole('button', {name: 'Verwijderen'}));

    expect(onDelete).toHaveBeenCalled();
  });

  it('warns about the gap in the invoice numbering', () => {
    renderModal({isNotLastInvoice: true});

    expect(screen.getByText(/gat ontstaan in de factuurnummering/)).toBeInTheDocument();
  });

  it('only offers archiving when the invoice can be archived', () => {
    renderModal();
    expect(screen.queryByRole('button', {name: 'Archiveren'})).not.toBeInTheDocument();

    const {onArchive} = renderModal({canArchive: true});
    expect(screen.getByRole('button', {name: 'Archiveren'})).toBeInTheDocument();
    expect(onArchive).not.toHaveBeenCalled();
  });

  it('only offers back to draft when the invoice has a Billit order', () => {
    renderModal();

    expect(screen.queryByRole('button', {name: 'Terug naar draft'})).not.toBeInTheDocument();
  });

  it('deletes the Billit order and puts the invoice back to draft', () => {
    const {onBackToDraft, onDelete} = renderModal({invoice: buildInvoice(1234)});

    fireEvent.click(screen.getByRole('button', {name: 'Terug naar draft'}));

    expect(onBackToDraft).toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });
});
