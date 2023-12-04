import { Attachment } from '../../../models';

export function getAwesomeFileType(att: Attachment | undefined): string {
  console.log(att);
  if (!att) {
    return 'fa fa-file-upload';
  }
  if (att.type === 'pdf') {
    return 'far fa-file-pdf';
    // invoice(-dollar) doesn't have a "far"
    // --> Looks too busy in the InvoiceList
    // return 'fa fa-file-invoice-dollar';
  }
  if (att.type === 'xml') {
    return 'far fa-file-invoice';
  }
  if (att.fileType === 'application/pdf') {
    return 'far fa-file-pdf';
  }

  // file-code, file-audio
  // extension = att.fileName.substring(att.fileName.lastIndexOf('.') + 1)
  // console.log(att.type, ':', att.fileType);
  // file-contract, file-invoice-dollar, file-signature

  const type = att.fileType;
  if (type.startsWith('image/')) {
    return 'far fa-file-image';
  }

  if (type === 'text/plain') {
    return 'far fa-file';
  }

  switch (type) {
    case 'application/vnd.oasis.opendocument.spreadsheet':
      return 'far fa-file-excel';
    case 'application/vnd.oasis.opendocument.text':
      return 'far fa-file-word';
    case 'application/vnd.oasis.opendocument.presentation':
      return 'far fa-file-powerpoint';


    case 'application/x-rar-compressed':
    case 'application/x-7z-compressed':
    case 'application/x-bzip2':
    case 'application/x-tar':
    case 'application/x-gtar':
    case 'application/zip':
    case 'application/x-zip-compressed':
      return 'far fa-file-archive';

    case 'application/xml':
      return 'far fa-file-invoice';

    default:
  }

  // if (type === 'application/octet-stream') {
  const ext = att.fileName.substring(att.fileName.lastIndexOf('.') + 1);
  switch (ext) {
    case 'xls':
    case 'xlsx':
    case 'ods':
      return 'far fa-file-excel';

    case 'doc':
    case 'docx':
    case 'odt':
      return 'far fa-file-word';

    case 'zip':
    case '7z':
    case 'tar':
    case 'bz2':
    case 'gz':
    case 'rar':
      return 'far fa-file-archive';

    case 'ppt':
    case 'pptx':
    case 'odp':
      return 'far fa-file-powerpoint';

    case 'csv':
      return 'fa fa-file-csv';

    default:
      return 'far fa-file';
  }
}
