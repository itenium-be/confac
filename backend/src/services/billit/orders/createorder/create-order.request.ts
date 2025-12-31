import {Customer} from './customer';
import {OrderLine} from './orderline';
import {OrderType} from './order-type';
import {OrderDirection} from './order-direction';
import {Attachment} from './attachment';
import {SavedAttachment} from './attachment/attachment';
import {InvoiceStatus} from '../../../../models/invoices';

export type BillitOrderStatus = InvoiceStatus;

export type BillitOrder = Omit<CreateOrderRequest, 'Attachments'> & {
  OrderID: number;
  OrderStatus: BillitOrderStatus;
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
  PaymentDiscountPercentage?: number;
  PaymentDiscountAmount?: number;
  ContractDocumentReference?: ContractDocumentReference[];
  Customer: Customer;
  OrderLines: OrderLine[];
  Attachments?: Attachment[];
  OrderPDF?: Attachment;
}
