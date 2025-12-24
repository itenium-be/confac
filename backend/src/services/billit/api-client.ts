import fetch from 'node-fetch';
import {logger} from '../../logger';
import {CreateOrderRequest} from './orders/createorder';
import {SendInvoiceRequest} from './orders/sendinvoice';
import {GetParticipantInformationResponse} from './peppol/getparticipantinformation';
import {ApiConfig} from './api-config';

export class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  /**
   * Creates an order (invoice or quotation) at Billit
   * @param request The order creation request
   * @param idempotencyKey Unique key to ensure idempotent requests
   * @returns The Billit order ID
   */
  async createOrder(
    request: CreateOrderRequest,
    idempotencyKey: string,
  ): Promise<number> {
    const response: fetch.Response = await fetch(`${this.config.apiUrl}/orders`, {
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
      throw new Error(`Failed to create order at Billit: ${errorText}`);
    }

    const orderIdText: string = await response.text();
    const orderId: number = parseInt(orderIdText, 10);
    logger.info(`Billit order created successfully: ${orderId}`);
    return orderId;
  }

  /**
   * Sends an invoice via specified transport type
   * @param request The send invoice request
   * @param idempotencyKey Unique key to ensure idempotent requests
   */
  async sendInvoice(request: SendInvoiceRequest, idempotencyKey: string): Promise<void> {
    const response: fetch.Response = await fetch(`${this.config.apiUrl}/orders/commands/send`, {
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
      throw new Error(`Failed to send invoice via ${request.TransportType}: ${errorText}`);
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
    const response: fetch.Response = await fetch(
      `${this.config.apiUrl}/peppol/participantInformation/${vatNumber}`,
    );

    if (!response.ok) {
      const errorText: string = await response.text();
      logger.error(`Billit getParticipantInformation failed: ${response.status} - ${errorText}`);
      throw new Error(`Failed to check Peppol registration: ${errorText}`);
    }

    const data: GetParticipantInformationResponse = await response.json();
    logger.info(`Peppol registration checked for VAT ${vatNumber}: ${data.Registered ? 'registered' : 'not registered'}`);
    return data;
  }
}
