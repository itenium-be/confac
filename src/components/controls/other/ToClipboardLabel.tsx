/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import {info} from '../../../actions/appActions';
import {t} from '../../utils';



/** Click on Label to put text on clipboard */
export const ToClipboardLabel = ({label}: {label: string}) => {
  const copyToClipBoard = async (copyMe: string) => {
    console.log('To clipboard', copyMe);
    try {
      await navigator.clipboard.writeText(copyMe);
      info(t('controls.clipboard.success'));
    } catch (err) {
      // TODO: Requires localhost or https
      console.error('Clipboard err', err);
      info(t('controls.clipboard.failure'));
    }
  };

  return <span onClick={() => copyToClipBoard(label)}>{label}</span>;
};
