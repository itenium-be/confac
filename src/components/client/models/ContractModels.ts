export enum ContractStatus {
  NoContract = "NoContract",
  Sent = "Sent",
  Verified = "Verified",
  WeSigned = "WeSigned",
  TheySigned = "TheySigned",
  BothSigned = "BothSigned",
  NotNeeded = "NotNeeded",
}

export type IContractModel = {
  status: ContractStatus;
  notes: string;
};


export function isFinalContractStatus(status?: ContractStatus): boolean {
  if (status === ContractStatus.BothSigned || status === ContractStatus.NotNeeded)
    return true;

  return false;
}
