import React, {Component} from 'react';
import {Col, FormControl} from 'react-bootstrap';
import {t} from '../util';
import {EnhanceInputWithLabel} from '../enhancers/EnhanceInputWithLabel';
import {EnhanceInputWithAddons} from '../enhancers/EnhanceInputWithAddons';

type BaseInputProps = {
  type: string,
  value?: any,
  onChange: any,
  onBlur?: Function,
  style?: object,
  placeholder?: string,
}

const BaseInput = EnhanceInputWithLabel(EnhanceInputWithAddons(class extends Component<BaseInputProps> {
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


function parseIntOrFloat(str: string, asFloat: boolean): number {
  if (!str) {
    return 0;
  }
  if (asFloat) {
    return parseFloat(str);
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



function mathCleanup(str: string | number, asFloat: boolean): number {
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

function mathEval(str: string, asFloat: boolean, allowHours?: boolean): number {
  // ATTN: This is pretty basic!!
  //       !!! 5+5*2 === 10*2 !!!
  let result: number | string = str;
  if (str.includes('*')) {
    const parts = str.split('*');
    result = parts.reduce((acc, cur) => acc * mathEval(cur, asFloat), 1);

  } else if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length !== 2) {
      throw Error('Multiple "/" Not implemented');
    }
    result = mathEval(parts[0], asFloat) / mathEval(parts[1], asFloat);

  } else if (str.includes('+')) {
    const parts = str.split('+');
    result = parts.reduce((acc, cur) => acc + mathEval(cur, asFloat), 0);

  } else if (str.includes('-')) {
    const parts = str.split('-');
    if (parts.length > 2) {
      throw Error('Multiple "-" Not implemented');
    }
    if (parts.length === 2) {
      result = mathEval(parts[0], asFloat) - mathEval(parts[1], asFloat);
    }
  } else if (allowHours && str.includes(':')) {
    const parts = str.split(':').map(s => parseInt(s, 10));
    result = parts[0] + '.' + (parts[1] / 60 * 100);
  }
  return mathCleanup(result, asFloat);
}

export function basicMath(str: string, asFloat: boolean, allowHours: boolean): number {
  str = str.replace(/€/g, '');
  str = str.replace(/ /g, '');
  return mathEval(str, asFloat, allowHours);
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
          <Col sm={{span: col.cols || 4, offset: col.offset}} key={col.key || index}>
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
            onChange={updater.bind(null, col.label)}
            data-tst={props['data-tst'] + '_' + col.label}
          />
        </Col>
      ))}
    </>
  );
};
