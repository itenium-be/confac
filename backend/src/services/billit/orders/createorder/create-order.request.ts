import {Customer} from './customer';
import {OrderLine} from './orderline';
import {OrderType} from './order-type';
import {OrderDirection} from './order-direction';
import {Attachment} from './attachment';
import {SavedAttachment} from './attachment/attachment';

export type BillitOrder = Omit<CreateOrderRequest, 'Attachments'> & {
  Attachments: SavedAttachment[];
};

export type ContractDocumentReference = {
  ID: string;
};

export type CreateOrderRequest = {
  OrderType: OrderType;
  OrderDirection: OrderDirection;
  OrderNumber?: string;
  OrderDate: string; // YYYY-MM-DD format
  ExpiryDate: string; // YYYY-MM-DD format
  PeriodFrom?: string; // YYYY-MM-DD format
  PeriodTill?: string; // YYYY-MM-DD format
  Reference?: string;
  OrderTitle?: string;
  Comments?: string;
  InternalInfo?: string;
  Currency?: string;
  PaymentReference?: string;
  ContractDocumentReference?: ContractDocumentReference[];
  Customer: Customer;
  OrderLines: OrderLine[];
  Attachments?: Attachment[];
  OrderPDF?: Attachment;
}
