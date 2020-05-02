import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import {SimpleSelect} from './SimpleSelect';
import {failure, buildRequest} from '../../../../actions';
import {t} from '../../../utils';


type TemplatePickerProps = {
  value: any,
  onChange: Function,
}

type TemplatePickerState = {
  templates: any[],
}


class TemplatePickerComponent extends Component<TemplatePickerProps, TemplatePickerState> {
  constructor(props: any) {
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
          console.log('/config/templates', templates); // eslint-disable-line
          failure(t('config.company.templateLoadError'), undefined, undefined, toast.POSITION.BOTTOM_RIGHT as any);
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

export const TemplatePicker = connect(() => ({}))(TemplatePickerComponent);
