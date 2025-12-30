import fetch from 'node-fetch';
import {logger} from '../../logger';
import {CreateOrderRequest} from './orders/createorder';
import {SendInvoiceRequest} from './orders/sendinvoice';
import {GetParticipantInformationResponse} from './peppol/getparticipantinformation';
import {ApiConfig} from './api-config';
import {SavedAttachment} from './orders/createorder/attachment/attachment';
import {BillitOrder} from './orders/createorder/create-order.request';
import {ErrorsResponse} from './errors/errors.response';

export class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  /**
   * Parses error response and attaches errors array if present
   */
  private parseErrorResponse(errorText: string): {message: string; errors?: ErrorsResponse['errors']} {
    try {
      const parsed = JSON.parse(errorText);
      if (parsed && Array.isArray(parsed.errors)) {
        return {
          message: errorText,
          errors: parsed.errors,
        };
      }
    } catch {
      // Not JSON or doesn't match ErrorsResponse format
    }
    return {message: errorText};
  }

  /**
   * Creates an order at Billit
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

      const parsedError = this.parseErrorResponse(errorText);
      const error: any = new Error(`Failed to create order at Billit: ${parsedError.message}`);
      if (parsedError.errors) {
        error.billitErrors = parsedError.errors;
      }
      throw error;
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

      const parsedError = this.parseErrorResponse(errorText);
      const error: any = new Error(`Failed to send invoice via ${request.TransportType}: ${parsedError.message}`);
      if (parsedError.errors) {
        error.billitErrors = parsedError.errors;
      }
      throw error;
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

      const parsedError = this.parseErrorResponse(errorText);
      const error: any = new Error(`Failed to check Peppol registration: ${parsedError.message}`);
      if (parsedError.errors) {
        error.billitErrors = parsedError.errors;
      }
      throw error;
    }

    const data: GetParticipantInformationResponse = await response.json();
    logger.info(`Peppol registration checked for VAT ${vatNumber}: ${data.Registered ? 'registered' : 'not registered'}`);
    return data;
  }

  async getOrder(billitOrderId: number): Promise<BillitOrder> {
    const response: fetch.Response = await fetch(`${this.config.apiUrl}/orders/${billitOrderId}`, {
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

      const parsedError = this.parseErrorResponse(errorText);
      const error: any = new Error(`Failed to get order from Billit: ${parsedError.message}`);
      if (parsedError.errors) {
        error.billitErrors = parsedError.errors;
      }
      throw error;
    }

    return response.json();
  }

  /** Gets a file by its generated UUID */
  async getFile(fileId: string): Promise<SavedAttachment> {
    const response: fetch.Response = await fetch(`${this.config.apiUrl}/files/${fileId}`, {
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

      const parsedError = this.parseErrorResponse(errorText);
      const error: any = new Error(`Failed to get file from Billit: ${parsedError.message}`);
      if (parsedError.errors) {
        error.billitErrors = parsedError.errors;
      }
      throw error;
    }

    return response.json();
  }
}
