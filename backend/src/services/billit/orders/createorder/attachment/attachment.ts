export type Attachment = {
  FileName: string;
  MimeType: string;
  FileContent: string;
}

export type SavedAttachment = Attachment & {
  /** The generated UUID for the Attachment */
  FileID: string;
}
