import { FormConfig } from "../../../../models";
import { TextareaInput } from "../inputs/TextareaInput";
import { BasicMathInput } from "../inputs/BasicMathInput";
import { NumericInput } from "../inputs/NumericInput";
import { StringInput } from "../inputs/StringInput";
import { InvoiceLineTypeSelect } from "../../../invoice/controls/InvoiceLineTypeSelect";
import { ConsultantTypeSelect } from "../../../consultant/controls/ConsultantTypeSelect";
import { InvoiceDateStrategySelect } from "../../../invoice/controls/InvoiceDateStrategySelect";
import { PropertiesSelect } from "../select/PropertiesSelect";
import { MoneyInput } from "../inputs/MoneyInput";
import { Switch } from "../Switch";
import { ClientSelect } from "../../../client/controls/ClientSelect";
import { FloatInput } from "../inputs/FloatInput";
import { StringsSelect } from "../select/StringsSelect";
import { BtwInput } from "../inputs/BtwInput";
import { EmailInput } from "../inputs/EmailInput";
import { PhoneInput } from "../inputs/PhoneInput";
import { WebsiteInput } from "../inputs/WebsiteInput";
import { IbanInput } from "../inputs/IbanInput";
import { ExtraFieldsInput } from "../inputs/ExtraFieldsInput";
import { TextEditor } from "../inputs/TextEditor";
import { AttachmentsTypeSelect } from "../../attachments/AttachmentsTypeSelect";

export type CustomComponents = 'InvoiceLineTypeSelect' | 'InvoiceDateStrategySelect' | 'PropertiesSelect'
  | 'ExtraFields' | 'StringsSelect' | 'ClientSelect' | 'ConsultantTypeSelect';

export type StandardComponents = 'number' | 'text' | 'textarea' | 'basic-math' | 'switch'
  | CustomComponents | 'float' | 'money' | 'email' | 'phone' | 'website' | 'btw' | 'iban'
  | 'textEditor';

const componentMap = {
  // Standard
  number: NumericInput,
  money: MoneyInput,
  text: StringInput,
  textarea: TextareaInput,
  switch: Switch,
  float: FloatInput,

  // Specialized
  'basic-math': BasicMathInput,
  email: EmailInput,
  phone: PhoneInput,
  website: WebsiteInput,
  btw: BtwInput,
  iban: IbanInput,
  TextEditor: TextEditor,

  // Custom
  InvoiceLineTypeSelect: InvoiceLineTypeSelect,
  InvoiceDateStrategySelect: InvoiceDateStrategySelect,
  PropertiesSelect: PropertiesSelect,
  ExtraFields: ExtraFieldsInput,
  ClientSelect: ClientSelect,
  StringsSelect: StringsSelect,
  AttachmentsTypeSelect: AttachmentsTypeSelect,
  ConsultantTypeSelect: ConsultantTypeSelect
};

export function getComponent(col: FormConfig) {
  if (typeof col.component === 'string') {
    if (componentMap[col.component]) {
      return componentMap[col.component];
    }
    console.error(`EditComponentFactory: Tried to render component ${col.component} but it's not configured`, col);
    console.log('componentMap', componentMap);

  } else if (col.component) {
    return col.component
  }

  return StringInput;
}
