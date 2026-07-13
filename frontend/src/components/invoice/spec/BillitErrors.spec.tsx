import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {BillitErrors} from '../controls/BillitErrors';
import {InvoiceBillitError} from '../models/InvoiceModel';

const poNumberError: InvoiceBillitError = {
  date: '2026-07-13T08:00:00.000Z',
  operation: 'sendInvoice',
  message: 'Failed to send invoice via Peppol',
  billitErrors: [{
    Code: 'PleaseSupplyAValidPONumberInTheFieldYourReference',
    Description: 'Voor deze klant is een geldig PO of ordernummer nodig',
  }],
};

const billitWasDownError: InvoiceBillitError = {
  date: '2026-07-12T08:00:00.000Z',
  operation: 'createOrder',
  message: 'Failed to create order at Billit: 503',
};

describe('BillitErrors', () => {
  it('shows the Billit error code and its description', () => {
    render(<BillitErrors errors={[poNumberError]} />);

    expect(screen.getByText(/PleaseSupplyAValidPONumberInTheFieldYourReference/)).toBeInTheDocument();
    expect(screen.getByText(/Voor deze klant is een geldig PO of ordernummer nodig/)).toBeInTheDocument();
  });

  it('falls back to the raw message when Billit returned no error codes', () => {
    render(<BillitErrors errors={[billitWasDownError]} />);

    expect(screen.getByText(/Failed to create order at Billit: 503/)).toBeInTheDocument();
  });

  it('shows which call failed and when', () => {
    render(<BillitErrors errors={[poNumberError]} />);

    expect(screen.getByText(/sendInvoice/)).toBeInTheDocument();
    expect(screen.getByText(/13\/07\/2026/)).toBeInTheDocument();
  });

  it('renders every error of the history', () => {
    render(<BillitErrors errors={[billitWasDownError, poNumberError]} />);

    expect(screen.getByText(/Failed to create order at Billit: 503/)).toBeInTheDocument();
    expect(screen.getByText(/PleaseSupplyAValidPONumberInTheFieldYourReference/)).toBeInTheDocument();
  });

  it('renders nothing when there are no errors', () => {
    const {container} = render(<BillitErrors errors={undefined} />);

    expect(container).toBeEmptyDOMElement();
  });
});
