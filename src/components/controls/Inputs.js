import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Col, FormControl} from 'react-bootstrap';
import {t} from '../util.js';
import {EnhanceInputWithLabel} from '../enhancers/EnhanceInputWithLabel.js';
import {EnhanceInputWithAddons} from '../enhancers/EnhanceInputWithAddons.js';


const BaseInput = EnhanceInputWithLabel(EnhanceInputWithAddons(class extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string,
    style: PropTypes.object,
    'data-tst': PropTypes.string,
  }

  render() {
    const {type} = this.props;
    return (
      <FormControl
        type={type === 'textarea' ? 'text' : type}
        as={type === 'textarea' ? 'textarea' : undefined}
        className={type === 'textarea' ? 'textarea' : undefined}
        value={this.props.value}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
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


export const NumericInput = ({ value, onChange, float = false, ...props}) => {
  return (
    <BaseInput
      type="number"
      value={value || ''}
      onChange={e => onChange(parseIntOrFloat(e.target.value, float))}
      {...props}
    />
  );
};



function mathCleanup(str, asFloat) {
  if (typeof str === 'number') {
    return str;
  }

  if (str.includes(',') && str.includes('.')) {
    if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
      str = str.replace(/\./g, '');
    } else {
      str = str.replace(/,/g, '');
    }
  }
  str = str.replace(',', '.');
  return parseIntOrFloat(str, asFloat);
}

function mathEval(str, asFloat, allowHours) {
  // ATTN: This is pretty basic!!
  //       !!! 5+5*2 === 10*2 !!!
  if (str.includes('*')) {
    const parts = str.split('*');
    str = parts.reduce((acc, cur) => acc * mathEval(cur, asFloat), 1);

  } else if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length !== 2) {
      throw Error('Multiple "/" Not implemented');
    }
    str = mathEval(parts[0], asFloat) / mathEval(parts[1], asFloat);

  } else if (str.includes('+')) {
    const parts = str.split('+');
    str = parts.reduce((acc, cur) => acc + mathEval(cur, asFloat), 0);

  } else if (str.includes('-')) {
    const parts = str.split('-');
    if (parts.length > 2) {
      throw Error('Multiple "-" Not implemented');
    }
    if (parts.length === 2) {
      str = mathEval(parts[0], asFloat) - mathEval(parts[1], asFloat);
    }
  } else if (allowHours && str.includes(':')) {
    const parts = str.split(':').map(s => parseInt(s, 10));
    str = parts[0] + '.' + (parts[1] / 60 * 100);
  }
  return mathCleanup(str, asFloat);
}

export function basicMath(str, asFloat, allowHours) {
  str = str.replace(/€/g, '');
  str = str.replace(/ /g, '');

  str = mathEval(str, asFloat, allowHours);

  return str;
}


export const BasicMathInput = ({ value, onChange, float = false, allowHours = false, ...props }) => {
  return (
    <BaseInput
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onBlur={e => onChange(basicMath(e.target.value, float, allowHours))}
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
    <>
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
    </>
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
    <>
      {config.map((col, index) => {
        if (col.forceRow) {
          return <div key={index} style={{clear: 'both'}} />;
        }

        const EditComponent = col.component || StringInput;
        return (
          <Col sm={col.cols || 4} key={col.key || index} offset={col.offset}>
            <EditComponent
              label={t(tPrefix + col.key)}
              value={model[col.key]}
              onChange={value => onChange({...model, [col.key]: value})}
              data-tst={tPrefix + col.key}
            />
          </Col>
        );
      })}
    </>
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
    <>
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
    </>
  );
};
