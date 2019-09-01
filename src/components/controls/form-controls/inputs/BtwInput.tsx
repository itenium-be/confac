import React, { useState } from "react";
import { BaseInputProps } from "./BaseInput";
import { StringInput } from "./StringInput";
import { EnhanceInputWithLabel } from "../../../enhancers/EnhanceInputWithLabel";
import { EnhanceInputWithAddons } from "../../../enhancers/EnhanceInputWithAddons";
import { t } from "../../../util";
import { Icon } from "../../Icon";
import { buildUrl } from "../../../../actions/fetch";
import { Button } from "react-bootstrap";
import { useDebouncedCallback } from 'use-debounce';
import cn from 'classnames';

/** Default to this country code if none provided */
const DefaultBtwCountry = 'BE';
/** Spinning loader starts when > than this chars have been typed */
const SmallestPossibleBtwLength = 8;

type BtwInputProps = BaseInputProps<string> & {
  onBtwChange?: (val: BtwResponse) => void;
  onFinalize?: (btw: string) => void;
}


const BtwInputComponent = ({value, onChange, onBtwChange, onFinalize, ...props}: BtwInputProps) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const [debouncedCallback] = useDebouncedCallback(async val => {
    const cleanBtw = parseBtw(val);
    if (cleanBtw.length > SmallestPossibleBtwLength) {
      setLoading(true);
      const btwInfo = await fetchBtwInfo(cleanBtw);
      setValid(btwInfo.valid);
      if (onBtwChange && btwInfo.valid) {
        onBtwChange(btwInfo);
      }
    }
    setLoading(false);
  }, 500);

  if (value && !initialCheckDone) {
    setInitialCheckDone(true);
    debouncedCallback(value);
  }

  const onInputChange = async (val: string) => {
    setInputValue(val);
    debouncedCallback(val);
    onChange(val);

    const cleanBtw = parseBtw(val);
    if (cleanBtw.length > SmallestPossibleBtwLength) {
      setLoading(true);
    }
    setValid(false);
  };

  const formattedBtw = formatBtw(parseBtw(inputValue));
  return (
    <StringInput
      label=""
      value={inputValue}
      onChange={onInputChange}
      prefix={<Icon fa={cn('fa', (loading ? 'fa-spinner fa-spin' : 'fa-building'), (valid ? 'success' : 'danger'))} size={1} />}
      suffix={onFinalize && <Button variant="success" onClick={() => onFinalize(formattedBtw)}>{t('client.createNewButton')}</Button>}
      suffixOptions={{type: 'button'}}
      onBlur={() => onInputChange(formattedBtw)}
      {...props}
      placeholder={t('client.createNewBtwPlaceholder')}
    />
  );
}

export const BtwInput = EnhanceInputWithLabel(EnhanceInputWithAddons(BtwInputComponent));





/**
 * Btw lookup result
 */
export type BtwResponse = {
  valid: boolean,
  countryCode: string,
  vatNumber: string,
  name: string,
  address: {
    street: string,
    number: string,
    zip_code: string,
    city: string,
    country: string,
    countryCode: string,
  },
  strAddress: string,
}

async function fetchBtwInfo(btw: string): Promise<BtwResponse> {
  return (await fetch(buildUrl(`/clients/btw/${btw}`)).then(result => result.json())) as BtwResponse;
}





/**
 * Convert input to an unformatted Btw number
 */
export function parseBtw(str: string): string {
  if (!str) {
    return '';
  }

  let btw = str.toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (!/^[A-Z]{2}/.test(btw)) {
    btw = DefaultBtwCountry + btw;
  }
  if (!/^[A-Z]{2}[A-Z0-9]{8,12}$/.test(btw)) {
    return str;
  }

  if (btw.startsWith('BE') && btw.length < 12) {
    btw = btw.slice(0, 2) + btw.slice(2).padStart(10, '0');
  }

  return btw;
}

/**
 * Formats to "BE 0123.456.789"
 * Expects input to be in "BE0123456789"
 */
export const formatBtw = (str: string): string => {
  return str.replace(/(\w{2})(\d{4})(\d{3})(\d{3})/, '$1 $2.$3.$4');
}
