import { FormConfig } from "../../../../models";
import { TextareaInput } from "../inputs/TextareaInput";
import { BasicMathInput } from "../inputs/BasicMathInput";
import { NumericInput } from "../inputs/NumericInput";
import { StringInput } from "../inputs/StringInput";
import { InvoiceLineTypeSelect } from "../../../invoice/controls/InvoiceLineTypeSelect";
import { InvoiceDateStrategySelect } from "../../../invoice/controls/InvoiceDateStrategySelect";
// import { PropertiesSelect } from "../select/PropertiesSelect";
import { MoneyInput } from "../inputs/MoneyInput";
import { Switch } from "../Switch";
import { ClientSelect } from "../../../client/controls/ClientSelect";
import { FloatInput } from "../inputs/FloatInput";
import { StringsSelect } from "../select/StringsSelect";

export type CustomComponents = 'InvoiceLineTypeSelect' | 'InvoiceDateStrategySelect' | 'PropertiesSelect';

export type StandardComponents = 'number' | 'text' | 'textarea' | 'basic-math' | CustomComponents;

const componentMap = {
  // Standard
  number: NumericInput,
  money: MoneyInput,
  text: StringInput,
  textarea: TextareaInput,
  'basic-math': BasicMathInput,
  switch: Switch,
  float: FloatInput,

  // Custom
  InvoiceLineTypeSelect: InvoiceLineTypeSelect,
  InvoiceDateStrategySelect: InvoiceDateStrategySelect,
  // PropertiesSelect: PropertiesSelect,
  ClientSelect: ClientSelect,
  StringsSelect: StringsSelect,
};

export function getComponent(col: FormConfig) {
  if (typeof col.component === 'string') {
    if (componentMap[col.component]) {
      return componentMap[col.component];
    }

  } else if (col.component) {
    return col.component
  }

  return StringInput;
}
