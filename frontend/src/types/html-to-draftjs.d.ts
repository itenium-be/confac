declare module 'html-to-draftjs' {
  import {ContentBlock} from 'draft-js';

  interface HtmlToDraftResult {
    contentBlocks: ContentBlock[];
    entityMap: Record<string, unknown>;
  }

  function htmlToDraft(html: string): HtmlToDraftResult;
  export default htmlToDraft;
}
