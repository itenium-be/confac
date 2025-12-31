import {Customer} from './customer';
import {OrderLine} from './orderline';
import {OrderType} from './order-type';
import {OrderDirection} from './order-direction';
import {Attachment} from './attachment';
import {SavedAttachment} from './attachment/attachment';
import {InvoiceStatus} from '../../../../models/invoices';

export type BillitOrderStatus = InvoiceStatus;

export type BillitDocumentDeliveryStatus = 'Pending' | 'Sent' | 'Delivered' | 'Failed';

export type BillitDocumentDeliveryDetails = {
  DocumentDeliveryDate: string;
  DocumentDeliveryInfo: string;
  IsDocumentDelivered: boolean;
  DocumentDeliveryStatus: BillitDocumentDeliveryStatus;
};

export type BillitMessageDirection = 'Incoming' | 'Outgoing';

export type BillitMessage = {
  Description: string;
  FileID: string;
  CreationDate: string;
  TransportType: string;
  Success: boolean;
  Trials: number;
  Destination: string;
  MessageDirection: BillitMessageDirection;
};

export type BillitOrder = Omit<CreateOrderRequest, 'Attachments'> & {
  OrderID: number;
  OrderStatus: BillitOrderStatus;
  Attachments: SavedAttachment[];
  CurrentDocumentDeliveryDetails?: BillitDocumentDeliveryDetails;
  Messages?: BillitMessage[];
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
