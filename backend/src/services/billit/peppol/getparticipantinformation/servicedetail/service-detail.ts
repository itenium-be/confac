import {Process} from './process';

/**
 * (Optional) Detailed information on a specific service advertised by the participant
 */
export interface ServiceDetail {
  /**
   * Full document identifier, usually including namespace URIs,
   * customization and version, e.g.
   * urn:oasis:names:specification:ubl:schema:xsd:Invoice-2::Invoice##...::2.1
   */
  DocumentIdentifier: string;

  /**
   * The scheme used for the DocumentIdentifier,
   * commonly "busdox-docid-qns" or similar Peppol standardized schemes
   */
  DocumentIdentifierScheme: string;

  /** List of supported processes for this document type (profile IDs) */
  Processes: Process[];
}
