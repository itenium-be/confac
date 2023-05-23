import { MonthPicker } from "../../controls/form-controls/MonthPicker";
import { t } from "../../utils";
import { DateRange } from "./client/ClientsAndProjectsEvolution";

interface PeriodPickerProps {
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
}

export const PeriodPicker = ({ dateRange, setDateRange }: PeriodPickerProps) => {
  return (
    <>
      <MonthPicker
        label={t("measurements.from")}
        value={dateRange.from}
        onChange={(value) => {
          if (value && value < dateRange.to) {
            setDateRange({...dateRange, from: value});
          }
        }}
      />

      <MonthPicker
        label={t("measurements.to")}
        value={dateRange.to}
        onChange={(value) => {
          if (value && value > dateRange.from) {
            setDateRange({...dateRange, to: value});
          }
        }}
      />
    </>
  );
};
