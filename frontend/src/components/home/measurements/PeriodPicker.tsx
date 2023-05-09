import React from "react";
import { MonthPicker } from "../../controls/form-controls/MonthPicker";
import { Moment } from "moment";
import { t } from "../../utils";

interface Props {
  from: Moment;
  to: Moment;
  fromChange: (value: any) => void;
  toChange: (value: any) => void;
}

const PeriodPicker = ({from, to, fromChange, toChange}: Props) => {
  return (
    <>
      <MonthPicker
        label={t("measurements.from")}
        value={from}
        onChange={fromChange}
      />

      <MonthPicker
        label={t("measurements.to")}
        value={to}
        onChange={toChange}
      />
    </>
  );
};

export default PeriodPicker;

