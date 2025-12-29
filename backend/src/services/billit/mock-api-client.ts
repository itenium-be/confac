import {ApiClient} from './api-client';
import {CreateOrderRequest} from './orders/createorder';
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

  async getParticipantInformation(vatNumber: string): Promise<GetParticipantInformationResponse> {
    return super.getParticipantInformation(vatNumber);
  }
}
