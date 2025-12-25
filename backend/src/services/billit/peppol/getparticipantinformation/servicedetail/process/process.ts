import {Endpoint} from './endpoint';

/**
 * Details about a single supported process for a document type
 */
export interface Process {
  /** The Peppol process ID, e.g. "urn:peppol:bis:billing" */
  ProcessIdentifier: string;

  /** The scheme for the process identifier (typically indicates how the process ID should be interpreted) */
  ProcessIdentifierScheme: string;

  Endpoints: Endpoint[];
}
