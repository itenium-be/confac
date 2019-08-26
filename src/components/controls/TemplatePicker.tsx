import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SimpleSelect} from './Select';
import {httpGet} from '../../actions/fetch';


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
    httpGet('/config/templates').then(templates => {
      this.setState({templates});
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
