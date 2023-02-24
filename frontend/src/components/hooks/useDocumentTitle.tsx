import {useEffect} from 'react';
import {t} from '../utils';

const AppName = 'confac';

export function getDocumentTitle(title: string): string {
  return `${title} - ${AppName}`;
}

export function useDocumentTitle(titleTransKey: string, params?: {[key: string]: string} | 'already-translated'): void {
  useEffect(() => {
    if (params === 'already-translated') {
      document.title = titleTransKey;
    } else {
      document.title = titleTransKey ? `${t(`titles.${titleTransKey}`, params)} - ${AppName}` : AppName;
    }
  }, [titleTransKey, params]);
}
