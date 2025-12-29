import {ApiClient} from './api-client';
import {CreateOrderRequest} from './orders/createorder';
import {BillitOrder} from './orders/createorder/create-order.request';
import {SendInvoiceRequest} from './orders/sendinvoice';
import {GetParticipantInformationResponse} from './peppol/getparticipantinformation';

export class MockApiClient extends ApiClient {
  // eslint-disable-next-line class-methods-use-this
  createOrder(request: CreateOrderRequest, idempotencyKey: string): Promise<number> {
    // console.log('createOrder', JSON.stringify(request, null, 2)); // eslint-disable-line
    return Promise.resolve(1000);
  }

  // eslint-disable-next-line class-methods-use-this
  sendInvoice(request: SendInvoiceRequest, idempotencyKey: string): Promise<void> {
    // console.log('sendInvoice', JSON.stringify(request, null, 2)); // eslint-disable-line
    return Promise.resolve();
  }

  // eslint-disable-next-line class-methods-use-this
  getOrder(billitOrderId: number): Promise<BillitOrder> {
    return Promise.resolve({} as unknown as BillitOrder);
  }

  async getParticipantInformation(vatNumber: string): Promise<GetParticipantInformationResponse> {
    return super.getParticipantInformation(vatNumber);
  }
}
