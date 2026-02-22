import {ApiClient} from './api-client';
import {CreateOrderRequest} from './orders/createorder';
import {BillitOrder} from './orders/createorder/create-order.request';
import {SendInvoiceRequest} from './orders/sendinvoice';
import {GetParticipantInformationResponse} from './peppol/getparticipantinformation';

export class MockApiClient extends ApiClient {
   
  createOrder(request: CreateOrderRequest, idempotencyKey: string): Promise<number> {
    // console.log('createOrder', JSON.stringify(request, null, 2)); // eslint-disable-line
    return Promise.resolve(1000);
  }

   
  sendInvoice(request: SendInvoiceRequest, idempotencyKey: string): Promise<void> {
    // console.log('sendInvoice', JSON.stringify(request, null, 2)); // eslint-disable-line
    return Promise.resolve();
  }

   
  getOrder(billitOrderId: number): Promise<BillitOrder> {
    return Promise.resolve({} as unknown as BillitOrder);
  }

  async getParticipantInformation(vatNumber: string): Promise<GetParticipantInformationResponse> {
    return super.getParticipantInformation(vatNumber);
  }
}
