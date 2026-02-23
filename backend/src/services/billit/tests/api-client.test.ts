// Mock node-fetch before imports
import fetch, {Response} from 'node-fetch';
import {ApiClient} from '../api-client';
import {BillitError} from '../billit-error';
import {CreateOrderRequest} from '../orders/createorder';
import {SendInvoiceRequest} from '../orders/sendinvoice';
import {logger} from '../../../logger';
import {ApiConfig} from '../api-config';
import {GetParticipantInformationResponse} from '../peppol/getparticipantinformation';
import {testApiConfig} from './api-config.fixture';

jest.mock('node-fetch');

// Mock logger before imports
jest.mock('../../../logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ApiClient', () => {
  let apiClient: ApiClient;
  const apiConfig: ApiConfig = testApiConfig;

  beforeEach(() => {
    apiClient = new ApiClient(apiConfig);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with provided config', () => {
      const client: ApiClient = new ApiClient(apiConfig);

      expect(client).toBeInstanceOf(ApiClient);
    });
  });

  describe('createOrder', () => {
    const createOrderRequest: CreateOrderRequest = {
      OrderType: 'Invoice',
      OrderDirection: 'Income',
      OrderNumber: '2024-001',
      OrderDate: '2024-12-19',
      ExpiryDate: '2024-12-19',
      Customer: {
        Name: 'Test Company',
        VATNumber: 'BE0123456789',
        PartyType: 'Customer',
        Addresses: [
          {
            AddressType: 'InvoiceAddress',
            Name: 'Test Company',
            Street: 'Test Street',
            StreetNumber: '1',
            City: 'Brussels',
            Zipcode: '1000',
            CountryCode: 'BE',
          },
        ],
      },
      OrderLines: [
        {
          Quantity: 1,
          UnitPriceExcl: 100,
          Description: 'Test Service',
          VATPercentage: 21,
        },
      ],
    };

    it('should create an order successfully', async () => {
      const orderId: number = 123456;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(orderId),
      } as unknown as Response);

      const result: number = await apiClient.createOrder(createOrderRequest, '2024-001');

      expect(result).toEqual(orderId);
      expect(mockFetch).toHaveBeenCalledWith(
        `${apiConfig.apiUrl}/orders`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ApiKey: apiConfig.apiKey,
            PartyID: apiConfig.partyId,
            ContextPartyID: apiConfig.contextPartyId,
            'Idempotency-Key': '2024-001',
          },
          body: JSON.stringify(createOrderRequest),
        }),
      );
      expect(logger.info).toHaveBeenCalledWith(`Billit order created successfully: ${orderId}`);
    });

    it('should throw error when API returns non-ok response', async () => {
      const errorMessage: string = 'Invalid order data';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve(errorMessage),
      } as unknown as Response);

      await expect(apiClient.createOrder(createOrderRequest, '2024-001')).rejects.toThrow(
        `Failed to create order at Billit: ${errorMessage}`,
      );

      expect(logger.error).toHaveBeenCalledWith(`Billit createOrder failed: 400 - ${errorMessage}`);
    });

    it('should include correct idempotency key', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('123456'),
      } as unknown as Response);

      await apiClient.createOrder(createOrderRequest, 'unique-key-123');

      expect(mockFetch).toHaveBeenCalledWith(
        `${apiConfig.apiUrl}/orders`,
        expect.objectContaining({headers: expect.objectContaining({'Idempotency-Key': 'unique-key-123'})}),
      );
    });

    it('should throw BillitError when API returns ErrorsResponse format', async () => {
      const errorsResponse = JSON.stringify({
        errors: [
          {Code: 'ERR001', Description: 'Invalid VAT number'},
          {Code: 'ERR002', Description: 'Missing required field'},
        ],
      });
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve(errorsResponse),
      } as unknown as Response);

      try {
        await apiClient.createOrder(createOrderRequest, '2024-001');
        fail('Expected BillitError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BillitError);
        expect((error as BillitError).billitErrors).toEqual([
          {Code: 'ERR001', Description: 'Invalid VAT number'},
          {Code: 'ERR002', Description: 'Missing required field'},
        ]);
      }
    });

    it('should throw regular Error when response is not ErrorsResponse format', async () => {
      const errorMessage: string = 'Plain text error';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve(errorMessage),
      } as unknown as Response);

      try {
        await apiClient.createOrder(createOrderRequest, '2024-001');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).not.toBeInstanceOf(BillitError);
        expect((error as Error).message).toContain(errorMessage);
      }
    });
  });

  describe('sendInvoice', () => {
    it('should send invoice via Peppol successfully', async () => {
      const request: SendInvoiceRequest = {
        TransportType: 'Peppol',
        OrderIDs: [123456, 123457],
      };

      mockFetch.mockResolvedValueOnce({ok: true} as unknown as Response);

      await apiClient.sendInvoice(request, 'send-123');

      expect(mockFetch).toHaveBeenCalledWith(
        `${apiConfig.apiUrl}/orders/commands/send`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ApiKey: apiConfig.apiKey,
            PartyID: apiConfig.partyId,
            ContextPartyID: apiConfig.contextPartyId,
            'Idempotency-Key': 'send-123',
          },
          body: JSON.stringify(request),
        }),
      );
      expect(logger.info).toHaveBeenCalledWith(`Invoice(s) ${request.OrderIDs.join(', ')} sent via ${request.TransportType}`);
    });

    it('should send invoice via SMTP successfully', async () => {
      const request: SendInvoiceRequest = {
        TransportType: 'SMTP',
        OrderIDs: [123456],
      };

      mockFetch.mockResolvedValueOnce({ok: true} as unknown as Response);

      await apiClient.sendInvoice(request, 'send-124');

      expect(mockFetch).toHaveBeenCalledWith(
        `${apiConfig.apiUrl}/orders/commands/send`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ApiKey: apiConfig.apiKey,
            PartyID: apiConfig.partyId,
            ContextPartyID: apiConfig.contextPartyId,
            'Idempotency-Key': 'send-124',
          },
          body: JSON.stringify(request),
        }),
      );
      expect(logger.info).toHaveBeenCalledWith(`Invoice(s) ${request.OrderIDs.join(', ')} sent via SMTP`);
    });

    it('should throw error when send fails', async () => {
      const errorMessage: string = 'Send failed';
      const request: SendInvoiceRequest = {
        TransportType: 'Peppol',
        OrderIDs: [123456],
      };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve(errorMessage),
      } as unknown as Response);

      await expect(apiClient.sendInvoice(request, 'key')).rejects.toThrow(
        `Failed to send invoice via ${request.TransportType}: ${errorMessage}`,
      );

      expect(logger.error).toHaveBeenCalledWith(`Billit sendInvoice failed: 500 - ${errorMessage}`);
    });

    it('should handle multiple order IDs', async () => {
      const request: SendInvoiceRequest = {
        TransportType: 'Peppol',
        OrderIDs: [111, 222, 333, 444, 555],
      };
      mockFetch.mockResolvedValueOnce({ok: true} as unknown as Response);

      await apiClient.sendInvoice(request, 'key');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({body: JSON.stringify(request)}),
      );
    });

    it('should throw BillitError when API returns ErrorsResponse format', async () => {
      const request: SendInvoiceRequest = {
        TransportType: 'Peppol',
        OrderIDs: [123456],
      };
      const errorsResponse = JSON.stringify({
        errors: [
          {Code: 'SEND001', Description: 'Invalid transport configuration'},
        ],
      });
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve(errorsResponse),
      } as unknown as Response);

      try {
        await apiClient.sendInvoice(request, 'key');
      } catch (error) {
        expect(error).toBeInstanceOf(BillitError);
        expect((error as BillitError).billitErrors).toEqual([
          {Code: 'SEND001', Description: 'Invalid transport configuration'},
        ]);
      }
    });
  });

  describe('getParticipantInformation', () => {
    it('should return full response when company is registered in Peppol', async () => {
      const vatNumber: string = 'BE0123456789';
      const response: GetParticipantInformationResponse = {
        Registered: true,
        Identifier: '9953:BE0123456789',
        DocumentTypes: [
          'Invoice4',
        ],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(response),
      } as unknown as Response);

      const result: GetParticipantInformationResponse = await apiClient.getParticipantInformation(vatNumber);

      expect(result).toEqual(response);
      expect(mockFetch).toHaveBeenCalledWith(
        `${apiConfig.apiUrl}/peppol/participantInformation/${vatNumber}`,
      );
    });

    it('should return full response when company is not registered in Peppol', async () => {
      const vatNumber: string = 'BE9876543210';
      const response: GetParticipantInformationResponse = {
        Registered: false,
        Identifier: '9925:BE9876543210',
        DocumentTypes: [],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(response),
      } as unknown as Response);

      const result: GetParticipantInformationResponse = await apiClient.getParticipantInformation(vatNumber);

      expect(result).toEqual(response);
      expect(mockFetch).toHaveBeenCalledWith(
        `${apiConfig.apiUrl}/peppol/participantInformation/${vatNumber}`,
      );
    });

    it('should throw error when API returns non-ok response', async () => {
      const errorMessage: string = 'Invalid VAT number';
      const vatNumber: string = 'INVALID';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve(errorMessage),
      } as unknown as Response);

      await expect(apiClient.getParticipantInformation(vatNumber)).rejects.toThrow(
        `Failed to check Peppol registration: ${errorMessage}`,
      );

      expect(logger.error).toHaveBeenCalledWith(`Billit getParticipantInformation failed: 400 - ${errorMessage}`);
    });

    it('should not require authentication', async () => {
      const response: GetParticipantInformationResponse = {
        Registered: false,
        Identifier: '9925:BE9876543210',
        DocumentTypes: [],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(response),
      } as unknown as Response);

      await apiClient.getParticipantInformation('BE0123456789');

      // Verify no headers are passed (public endpoint)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
      );
    });

    it('should throw BillitError when API returns ErrorsResponse format', async () => {
      const errorsResponse = JSON.stringify({
        errors: [
          {Code: 'VAT001', Description: 'VAT number format is invalid'},
        ],
      });
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve(errorsResponse),
      } as unknown as Response);

      try {
        await apiClient.getParticipantInformation('INVALID');
      } catch (error) {
        expect(error).toBeInstanceOf(BillitError);
        expect((error as BillitError).billitErrors).toEqual([
          {Code: 'VAT001', Description: 'VAT number format is invalid'},
        ]);
      }
    });
  });

  describe('error handling', () => {
    it('should handle network errors in createOrder', async () => {
      const networkError: Error = new Error('Network failure');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(
        apiClient.createOrder({} as CreateOrderRequest, 'key'),
      ).rejects.toThrow(networkError);
    });

    it('should handle network errors in sendInvoice', async () => {
      const networkError: Error = new Error('Network failure');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(
        apiClient.sendInvoice({TransportType: 'Peppol', OrderIDs: [123]}, 'key'),
      ).rejects.toThrow(networkError);
    });

    it('should handle network errors in getParticipantInformation', async () => {
      const networkError: Error = new Error('Network failure');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(apiClient.getParticipantInformation('BE0123456789')).rejects.toThrow(networkError);
    });
  });
});
