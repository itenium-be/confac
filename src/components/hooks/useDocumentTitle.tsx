import {useEffect} from 'react';
import {t} from '../utils';

const AppName = 'confac';

export function getDocumentTitle(title: string): string {
  return `${title} - ${AppName}`;
}

export function useDocumentTitle(titleTransKey: string, params?: {[key: string]: string}): void {
  useEffect(() => {
    document.title = titleTransKey ? `${t(`titles.${titleTransKey}`, params)} - ${AppName}` : AppName;
  }, [titleTransKey, params]);
}
