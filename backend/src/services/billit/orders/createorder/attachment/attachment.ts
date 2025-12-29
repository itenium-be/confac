export type Attachment = {
  // ATTN: While the FileID exists in the Billit documentation
  // actually sending it along does not have an impact, Billit
  // still assigns a different UUID
  // FileID: string;
  FileName: string;
  MimeType: string;
  FileContent: string;
}
