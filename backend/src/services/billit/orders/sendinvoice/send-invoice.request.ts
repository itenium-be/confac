import {TransportType} from './transport-type';

export interface SendInvoiceRequest {
  OrderIDs: number[];
  TransportType: TransportType;
  PrintType?: string;
}
