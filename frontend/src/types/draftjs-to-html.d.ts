declare module 'draftjs-to-html' {
  import {RawDraftContentState} from 'draft-js';

  function draftToHtml(rawContentState: RawDraftContentState): string;
  export default draftToHtml;
}
