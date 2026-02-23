import {Component} from 'react';
import {toast} from 'react-toastify';
import {SimpleSelect} from './SimpleSelect';
import {failure, buildRequest} from '../../../../actions';
import {t} from '../../../utils';


type TemplatePickerProps = {
  value: string;
  onChange: (value: string) => void;
}

type TemplatePickerState = {
  templates: string[];
}


export class TemplatePicker extends Component<TemplatePickerProps, TemplatePickerState> {
  constructor(props: TemplatePickerProps) {
    super(props);
    this.state = {templates: []};
  }

  componentDidMount() {
    fetch(buildRequest('/config/templates'))
      .then(res => res.json())
      .then(templates => {
        if (!templates.message) {
          this.setState({templates});
        } else {
          console.log('/config/templates', templates);
          failure(t('config.company.templateLoadError'), undefined, undefined, toast.POSITION.BOTTOM_RIGHT);
          return Promise.reject(templates);
        }
        return Promise.resolve(templates);
      });
  }

  render() {
    const {value, ...props} = this.props;

    let options = this.state.templates;
    if (value && options.every(x => x !== value)) {
      options = options.concat([value]);
    }

    return (
      <SimpleSelect
        value={value}
        options={options}
        isClearable={false}
        {...props}
      />
    );
  }
}
