import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Col, FormControl, Clearfix} from 'react-bootstrap';
import {t} from '../util.js';
import {EnhanceInputWithLabel} from '../enhancers/EnhanceInputWithLabel.js';
import {EnhanceInputWithAddons} from '../enhancers/EnhanceInputWithAddons.js';


const BaseInput = EnhanceInputWithLabel(EnhanceInputWithAddons(class extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    style: PropTypes.object,
    'data-tst': PropTypes.string,
  }

  render() {
    const {type} = this.props;
    return (
      <FormControl
        type={type === 'textarea' ? 'text' : type}
        componentClass={type === 'textarea' ? 'textarea' : undefined}
        value={this.props.value}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
        style={this.props.style}
        data-tst={this.props['data-tst']}
      />
    );
  }
}));


function parseIntOrFloat(str, asFloat) {
  if (!str) {
    return 0;
  }
  if (asFloat) {
    return parseFloat(str, 10);
  }
  return parseInt(str, 10);
}


export const NumericInput = ({value, onChange, ...props, float = false}) => {
  return (
    <BaseInput
      type="number"
      value={value || ''}
      onChange={e => onChange(parseIntOrFloat(e.target.value, float))}
      {...props}
    />
  );
};


export const StringInput = ({value, onChange, ...props}) => {
  return (
    <BaseInput
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      {...props}
    />
  );
};

export const TextareaInput = ({value, onChange, ...props}) => {
  return (
    <BaseInput
      type="textarea"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      {...props}
    />
  );
};

export const StringInputArray = ({keys, model, onChange, tPrefix}) => {
  return (
    <div>
      {keys.map(key => (
        <Col sm={4} key={key}>
          <StringInput
            label={t(tPrefix + key)}
            value={model[key]}
            onChange={value => onChange({...model, [key]: value})}
            data-tst={tPrefix + key}
          />
        </Col>
      ))}
    </div>
  );
};

export const InputArray = ({config, model, onChange, tPrefix}) => {
  config = config.map(x => {
    if (typeof x === 'string') {
      return {key: x};
    }
    return x;
  });

  if (!model._id) {
    config = config.filter(c => !c.updateOnly);
  }

  return (
    <div>
      {config.map((col, index) => {
        if (col.forceRow) {
          return <Clearfix key={index} />;
        }

        const EditComponent = col.component || StringInput;
        return (
          <Col sm={4} key={col.key || index} smOffset={col.offset}>
            <EditComponent
              label={t(tPrefix + col.key)}
              value={model[col.key]}
              onChange={value => onChange({...model, [col.key]: value})}
              data-tst={tPrefix + col.key}
            />
          </Col>
        );
      })}
    </div>
  );
};

export const ExtraFieldsInput = ({properties, onChange, ...props}) => {
  const updater = (updateLabel, newText) => {
    onChange(properties.map(col => {
      if (col.label === updateLabel) {
        return {
          label: col.label,
          value: newText,
        };
      }
      return col;
    }));
  };

  return (
    <div>
      {properties.map(col => (
        <Col sm={4} key={col.label}>
          <StringInput
            label={col.label}
            value={col.value}
            onChange={updater.bind(this, col.label)}
            data-tst={props['data-tst'] + '_' + col.label}
          />
        </Col>
      ))}
    </div>
  );
};
