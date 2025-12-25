import {ServiceDetail} from './servicedetail';

/**
 * Response from GET /v1/peppol/participantInformation/{VATorCBE}
 */
export interface GetParticipantInformationResponse {
  /** Whether the participant is registered on PEPPOL */
  Registered: boolean;

  /** The identifier returned by Billit (scheme and value used in the search) */
  Identifier: string;

  /** List of supported document types by this participant (e.g. invoices, IMR, credit notes etc) */
  DocumentTypes: string[];

  /** (Optional) Additional information about services supported */
  ServiceDetails?: ServiceDetail[];
}
