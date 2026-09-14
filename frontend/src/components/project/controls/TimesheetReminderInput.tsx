import {OverlayTrigger, Popover, InputGroup} from 'react-bootstrap';
import {BaseInput, BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {Icon} from '../../controls/Icon';
import {t} from '../../utils';
import {timesheetReminderReplacementsConfig} from '../project-month-list/timesheet-reminder';


const TimesheetReminderPopover = (
  <Popover id="timesheet-reminder-replacements">
    <Popover.Header as="h3">{t('config.invoiceReplacements.title')}</Popover.Header>
    <Popover.Body>
      {timesheetReminderReplacementsConfig.map(replacement => (
        <div key={replacement.code}>
          <strong>{replacement.code}</strong>
          <p>{t(replacement.desc)}</p>
        </div>
      ))}
    </Popover.Body>
  </Popover>
);


export const TimesheetReminderInput = ({value, onChange, ...props}: BaseInputProps<string>) => (
  <BaseInput
    type="text"
    value={value || ''}
    onChange={e => onChange(e.target.value as string)}
    {...props}
    suffix={(
      <OverlayTrigger trigger="click" placement="auto" overlay={TimesheetReminderPopover}>
        <InputGroup.Text style={{cursor: 'pointer'}}>
          <Icon fa="fa fa-file-invoice" size={1} />
        </InputGroup.Text>
      </OverlayTrigger>
    )}
    suffixOptions={{type: 'button'}}
  />
);
