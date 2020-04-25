import {FormConfig} from '../../../../models';
import {TextareaInput} from '../inputs/TextareaInput';
import {BasicMathInput} from '../inputs/BasicMathInput';
import {NumericInput} from '../inputs/NumericInput';
import {StringInput} from '../inputs/StringInput';
import {InvoiceLineTypeSelect, ProjectLineTypeSelect} from '../../../invoice/controls/InvoiceLineTypeSelect';
import {ConsultantTypeSelect} from '../../../consultant/controls/ConsultantTypeSelect';
import {InvoiceDateStrategySelect} from '../../../invoice/controls/InvoiceDateStrategySelect';
import {InvoiceReplacementsInput} from '../../../invoice/controls/InvoiceReplacementsInput';
import {PropertiesSelect} from '../select/PropertiesSelect';
import {MoneyInput} from '../inputs/MoneyInput';
import {Switch} from '../Switch';
import {ClientSelect} from '../../../client/controls/ClientSelect';
import {FloatInput} from '../inputs/FloatInput';
import {StringsSelect} from '../select/StringsSelect';
import {BtwInput} from '../inputs/BtwInput';
import {EmailInput} from '../inputs/EmailInput';
import {PhoneInput} from '../inputs/PhoneInput';
import {WebsiteInput} from '../inputs/WebsiteInput';
import {CheckboxInput} from '../inputs/CheckboxInput';
import {IbanInput} from '../inputs/IbanInput';
import {ExtraFieldsInput} from '../inputs/ExtraFieldsInput';
import {TextEditor} from '../inputs/TextEditor';
import {AttachmentsTypeSelect} from '../../attachments/AttachmentsTypeSelect';
import {DatePicker} from '../DatePicker';
import {EditProjectClient, EditProjectPartner} from '../../../project/controls/EditProjectClient';
import {ConsultantSelectWithCreateModal} from '../../../consultant/controls/ConsultantSelectWithCreateModal';

export type CustomComponents = 'InvoiceLineTypeSelect' | 'ProjectLineTypeSelect' | 'InvoiceDateStrategySelect' | 'PropertiesSelect'
  | 'ExtraFields' | 'StringsSelect' | 'ClientSelect' | 'ConsultantTypeSelect' | 'EditProjectClient'
  | 'ConsultantSelectWithCreateModal' | 'InvoiceReplacementsInput';

export type StandardComponents = 'number' | 'text' | 'textarea' | 'basic-math' | 'switch'
  | CustomComponents | 'float' | 'money' | 'email' | 'phone' | 'website' | 'btw' | 'iban' | 'textEditor' | 'bool' | 'date';

const componentMap = {
  // Standard
  number: NumericInput,
  money: MoneyInput,
  text: StringInput,
  textarea: TextareaInput,
  switch: Switch,
  float: FloatInput,
  bool: CheckboxInput,
  date: DatePicker,

  // Specialized
  'basic-math': BasicMathInput,
  email: EmailInput,
  phone: PhoneInput,
  website: WebsiteInput,
  btw: BtwInput,
  iban: IbanInput,
  TextEditor,

  // Custom
  InvoiceLineTypeSelect,
  ProjectLineTypeSelect,
  InvoiceDateStrategySelect,
  PropertiesSelect,
  ExtraFields: ExtraFieldsInput,
  ClientSelect,
  StringsSelect,
  AttachmentsTypeSelect,
  ConsultantTypeSelect,
  EditProjectClient,
  EditProjectPartner,
  ConsultantSelectWithCreateModal,
  InvoiceReplacementsInput,
};

export function getComponent(col: FormConfig) {
  if (typeof col.component === 'string') {
    if (componentMap[col.component]) {
      return componentMap[col.component];
    }
    console.error(`EditComponentFactory: Tried to render component ${col.component} but it's not configured`, col); // eslint-disable-line
    console.log('componentMap', componentMap); // eslint-disable-line

  } else if (col.component) {
    return col.component;
  }

  return StringInput;
}
