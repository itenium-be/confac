export interface ApiConfig {
  /** The Billit API url, including the /v1 */
  apiUrl: string;
  apiKey: string;
  partyId: string;
  /** Only relevant for vendors, for us it's always the same as the partyId */
  contextPartyId: string;
}
