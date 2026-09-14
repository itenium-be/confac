export type ContractStatus = 'NoContract' | 'Sent' | 'Verified' | 'WeSigned' | 'TheySigned' | 'BothSigned' | 'NotNeeded';

export interface IContract {
  status: ContractStatus;
  notes: string;
}
