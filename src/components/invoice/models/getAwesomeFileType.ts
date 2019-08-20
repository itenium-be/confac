import { Attachment } from './../../../models';

export function getAwesomeFileType(att: {type: string, fileType: string, fileName: string} | Attachment): string {
  if (att.type === 'pdf' || att.fileType === 'application/pdf') {
    return 'fa-file-pdf-o';
  }

  // file-code-o, file-audio-o
  // extension = att.fileName.substring(att.fileName.lastIndexOf('.') + 1)
  // console.log(att.type, ':', att.fileType);


  const type = att.fileType;
  if (type.startsWith('image/')) {
    return 'fa-file-image-o';
  }

  if (type === 'text/plain') {
    return 'fa-file-text-o';
  }

  switch (type) {
  case 'application/vnd.oasis.opendocument.spreadsheet':
    return 'fa-file-excel-o';
  case 'application/vnd.oasis.opendocument.text':
    return 'fa-file-word-o';
  case 'application/vnd.oasis.opendocument.presentation':
    return 'fa-file-powerpoint-o';


  case 'application/x-rar-compressed':
  case 'application/x-7z-compressed':
  case 'application/x-bzip2':
  case 'application/x-tar':
  case 'application/x-gtar':
  case 'application/zip':
  case 'application/x-zip-compressed':
    return 'fa fa-file-archive-o';

  default:
  }

  if (type === 'application/octet-stream') {
    const ext = att.fileName.substring(att.fileName.lastIndexOf('.') + 1);
    switch (ext) {
    case 'xls':
    case 'xlsx':
    case 'ods':
      return 'fa-file-excel-o';

    case 'doc':
    case 'docx':
    case 'odt':
      return 'fa-file-word-o';

    case 'zip':
    case '7z':
    case 'tar':
    case 'bz2':
    case 'gz':
    case 'rar':
      return 'fa fa-file-archive-o';

    case 'ppt':
    case 'pptx':
    case 'odp':
      return 'fa-file-powerpoint-o';

    default:
      return 'fa-file-o';
    }
  }

  return 'fa-file-o';
}
