import {logger} from '../../logger';
import {CreateOrderRequest} from './orders/createorder';
import {SendInvoiceRequest} from './orders/sendinvoice';
import {GetParticipantInformationResponse} from './peppol/getparticipantinformation';
import {ApiConfig} from './api-config';
import {SavedAttachment} from './orders/createorder/attachment/attachment';
import {BillitOrder} from './orders/createorder/create-order.request';
import {BillitErrorFactory} from './billit-error.factory';

export class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  /**
   * Creates an order at Billit
   * @returns The Billit order ID
   */
  async createOrder(
    request: CreateOrderRequest,
    idempotencyKey: string,
  ): Promise<number> {
    const response: Response = await fetch(`${this.config.apiUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ApiKey: this.config.apiKey,
        PartyID: this.config.partyId,
        ContextPartyID: this.config.contextPartyId,
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText: string = await response.text();
      logger.error(`Billit createOrder failed: ${response.status} - ${errorText}`);
      throw BillitErrorFactory.createError(errorText, 'Failed to create order at Billit');
    }

    const orderIdText: string = await response.text();
    const orderId: number = parseInt(orderIdText, 10);
    logger.info(`Billit order created successfully: ${orderId}`);
    return orderId;
  }

  /**
   * Sends an existing Billit invoice via specified transport type to Peppol
   */
  async sendInvoice(request: SendInvoiceRequest, idempotencyKey: string): Promise<void> {
    const response: Response = await fetch(`${this.config.apiUrl}/orders/commands/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ApiKey: this.config.apiKey,
        PartyID: this.config.partyId,
        ContextPartyID: this.config.contextPartyId,
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`Billit sendInvoice failed: ${response.status} - ${errorText}`);
      throw BillitErrorFactory.createError(errorText, `Failed to send invoice via ${request.TransportType}`);
    }

    logger.info(`Invoice(s) ${request.OrderIDs.join(', ')} sent via ${request.TransportType}`);
  }

  /**
   * Checks if a party is registered in the Peppol network
   * Note: This endpoint does not require authentication
   * @param vatNumber The VAT number to check (should be cleaned of spaces and dots)
   * @returns The Peppol participant information response
   */
  async getParticipantInformation(vatNumber: string): Promise<GetParticipantInformationResponse> {
    const response: Response = await fetch(
      `${this.config.apiUrl}/peppol/participantInformation/${vatNumber}`,
    );

    if (!response.ok) {
      const errorText: string = await response.text();
      logger.error(`Billit getParticipantInformation failed: ${response.status} - ${errorText}`);
      throw BillitErrorFactory.createError(errorText, 'Failed to check Peppol registration');
    }

    const data: GetParticipantInformationResponse = await response.json();
    logger.info(`Peppol registration checked for VAT ${vatNumber}: ${data.Registered ? 'registered' : 'not registered'}`);
    return data;
  }

  async getOrder(billitOrderId: number): Promise<BillitOrder> {
    const response: Response = await fetch(`${this.config.apiUrl}/orders/${billitOrderId}`, {
      method: 'GET',
      headers: {
        ApiKey: this.config.apiKey,
        PartyID: this.config.partyId,
        ContextPartyID: this.config.contextPartyId,
      },
    });

    if (!response.ok) {
      const errorText: string = await response.text();
      logger.error(`Billit getOrder failed: ${response.status} - ${errorText}`);
      throw BillitErrorFactory.createError(errorText, 'Failed to get order from Billit');
    }

    return response.json();
  }

  /**
   * Updates the OrderStatus of an existing Billit order
   * Patchable properties: https://docs.billit.be/docs/patchable-properties
   */
  async patchOrderStatus(billitOrderId: number, status: 'ToPay' | 'Paid'): Promise<void> {
    const body = {
      Paid: status === 'Paid',
      PaidDate: status === 'Paid' ? new Date().toISOString() : null,
    };

    const response: Response = await fetch(`${this.config.apiUrl}/orders/${billitOrderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ApiKey: this.config.apiKey,
        PartyID: this.config.partyId,
        ContextPartyID: this.config.contextPartyId,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText: string = await response.text();
      logger.error(`Billit patchOrderStatus failed: ${response.status} - ${errorText}`);
      throw BillitErrorFactory.createError(errorText, 'Failed to patch order status at Billit');
    }

    logger.info(`Billit order ${billitOrderId} status updated to ${status}`);
  }

  /** Gets a file by its generated UUID */
  async getFile(fileId: string): Promise<SavedAttachment> {
    const response: Response = await fetch(`${this.config.apiUrl}/files/${fileId}`, {
      method: 'GET',
      headers: {
        ApiKey: this.config.apiKey,
        PartyID: this.config.partyId,
        ContextPartyID: this.config.contextPartyId,
      },
    });

    if (!response.ok) {
      const errorText: string = await response.text();
      logger.error(`Billit getFile failed: ${response.status} - ${errorText}`);
      throw BillitErrorFactory.createError(errorText, 'Failed to get file from Billit');
    }

    return response.json();
  }
}
