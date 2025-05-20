/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {info} from '../../../actions/appActions';
import {t} from '../../utils';



/** Click on Label to put text on clipboard */
export const ToClipboardLabel = ({label, copyValue}: {label: string; copyValue?: string}) => {
  const copyToClipBoard = async (copyMe: string) => {
    console.log('To clipboard', copyMe); // eslint-disable-line

    if (!navigator.clipboard || document.location.protocol === 'http:') {
      const textArea = document.createElement('textarea');
      textArea.value = copyMe;

      // Avoid scrolling to bottom
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        info(t('controls.clipboard.success', {text: copyMe}));
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err); // eslint-disable-line
        info(t('controls.clipboard.failure'));
      }

      document.body.removeChild(textArea);

    } else {
      // TODO: Requires localhost or https
      // See: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
      try {
        await navigator.clipboard.writeText(copyMe);
        info(t('controls.clipboard.success', {text: copyMe}));
      } catch (err) {
        console.error('Clipboard err', err); // eslint-disable-line
        info(t('controls.clipboard.failure'));
      }
    }
  };

  return <span onClick={() => copyToClipBoard(copyValue || label)}>{label}</span>;
};
