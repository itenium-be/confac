import React from 'react';
import {Col} from 'react-bootstrap';
import {t} from '../../../utils';
import {FormConfig, AnyFormConfig, ColSizes, ColSize} from '../../../../models';
import {normalizeFormConfig} from '../lib/form-controls-util';
import {getIconOrText, InputIcons} from '../lib/IconFactory';
import {getComponent} from '../lib/EditComponentFactory';
import {failure} from '../../../../actions';

type ArrayInputProps = {
  config: AnyFormConfig[],
  model: { _id?: string, [key: string]: any },
  onChange: (value: any) => void,
  tPrefix: string,
}


export const ArrayInput = ({config, model, onChange, tPrefix}: ArrayInputProps) => {
  const result = normalizeFormConfig(config, model);

  return (
    <>
      {result.map((col: FormConfig, index: number) => {
        const {key, reactKey, label, cols, component, suffix, prefix, title, props, ...restProps} = col;
        const colSizes = getColSizes(cols);

        if (!key) {
          if (title) {
            const sectionTitle = typeof title === 'string' ? title : title.title;
            if (typeof title === 'string' || title.level === 2) {
              return <Col key={sectionTitle} xs={12} style={{paddingTop: 25}}><h2>{t(sectionTitle)}</h2></Col>;
            }
            return <Col key={title.title} xs={12}><h4>{t(title.title)}</h4></Col>;
          }
          return <Col key={index} {...colSizes} />;
        }

        let value = model[key];
        if (key.includes('.')) {
          value = key.split('.').reduce((o, i) => {
            if (!o) {
              console.error(`${key}: No property ${i} on`, model); // eslint-disable-line
              return `${key}: No property ${i} on ${JSON.stringify(model)}`;
            }
            return o[i];
          }, model);
        }

        const realOnChange = (val: any): void => {
          if (key.includes('.')) {
            if (key.indexOf('.') !== key.lastIndexOf('.')) {
              console.error('Would need a deepMerge function for this to work!!'); // eslint-disable-line
              failure(`Configuration? ${key}`);
              return;
            }
            const [key1, key2] = key.split('.');
            onChange({...model, [key1]: {...model[key1], [key2]: val}});

          } else {
            onChange({...model, [key]: val});
          }
        };

        const getAddix = (addix: string | React.ReactNode) => {
          if (!addix) {
            return undefined;
          }

          if (typeof addix === 'string') {
            return getIconOrText(addix as InputIcons);
          }
          return addix;
        };

        const EditComponent: any = getComponent(col);
        const finalComponent = (
          <EditComponent
            key={key}
            label={label === '' ? null : (label && t(label)) || t(tPrefix + key)}
            value={value}
            onChange={(val: any) => realOnChange(val)}
            prefix={getAddix(prefix)}
            suffix={getAddix(suffix)}
            {...props}
            {...restProps}
          />
        );

        if (colSizes === null) {
          return finalComponent;
        }

        return (
          <Col {...colSizes} key={reactKey || key || index}>
            {finalComponent}
          </Col>
        );
      })}
    </>
  );
};



const getColSizes = (cols?: number | ColSize | ColSizes | false): ColSizes | null => {
  const defaultLg = 4;
  const defaultSm = 6;
  const defaultConfig = {
    lg: {span: defaultLg},
    sm: {span: defaultSm},
  };

  if (cols === false) {
    return null;
  }

  if (!cols) {
    return defaultConfig;
  }

  if (typeof cols === 'number') {
    if (cols === 12) {
      return {xs: 12};
    }

    return {
      lg: {span: cols || defaultLg},
      sm: {span: defaultSm},
      // sm: {span: Math.max(defaultSm, cols)},
    };
  }

  const colSize = cols as { span?: number, offset?: number };
  if (colSize && (colSize.span || colSize.offset)) {
    return {
      lg: {span: colSize.span || defaultLg, offset: colSize.offset},
      sm: {span: defaultSm, offset: colSize.offset},
    };
  }

  const sizes = cols as ColSizes;
  // return {...defaultConfig, ...sizes};
  return sizes;
};
