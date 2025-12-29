import {ApiClient} from './api-client';
import {CreateOrderRequest} from './orders/createorder';
import {SendInvoiceRequest} from './orders/sendinvoice';
import {GetParticipantInformationResponse} from './peppol/getparticipantinformation';
import {ApiConfig} from './api-config';

export class MockApiClient extends ApiClient {
  constructor() {
    const apiConfig: ApiConfig = {
      apiUrl: '',
      apiKey: '',
      partyId: '',
      contextPartyId: '',
    };
    super(apiConfig);
  }

  // eslint-disable-next-line class-methods-use-this
  createOrder(request: CreateOrderRequest, idempotencyKey: string): Promise<number> {
    return Promise.resolve(1000);
  }

  // eslint-disable-next-line class-methods-use-this
  sendInvoice(request: SendInvoiceRequest, idempotencyKey: string): Promise<void> {
    return Promise.resolve();
  }

  async getParticipantInformation(vatNumber: string): Promise<GetParticipantInformationResponse> {
    return super.getParticipantInformation(vatNumber);
  }
}
