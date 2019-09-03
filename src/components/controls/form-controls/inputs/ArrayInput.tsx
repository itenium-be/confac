import React from "react";
import { Col } from "react-bootstrap";
import { t } from "../../../util";
import { FormConfig, AnyFormConfig, ColSizes, ColSize } from "../../../../models";
import { normalizeFormConfig } from "../lib/form-controls-util";
import { getIconOrText, InputIcons } from "../lib/IconFactory";
import { getComponent } from "../lib/EditComponentFactory";
import { failure } from "../../../../actions";

type ArrayInputProps = {
  config: AnyFormConfig[],
  model: {_id?: string, [key: string]: any},
  onChange: (value: any) => void,
  tPrefix: string,
}


export const ArrayInput = ({config, model, onChange, tPrefix}: ArrayInputProps) => {
  const result = normalizeFormConfig(config, model);

  return (
    <>
      {result.map((col: FormConfig, index: number) => {
        const {key, reactKey, label, cols, component, suffix, prefix, title, ...props} = col;
        const colSizes = getColSizes(cols);

        if (!key) {
          if (title) {
            // TODO: Technical debt: padding-top
            return <Col key={index} xs={12} style={{paddingTop: 25}}><h2>{t(title)}</h2></Col>;
          }
          return <Col key={index} {...colSizes} />;
        }

        let value = model[key];
        if (key.includes('.')) {
          value = key.split('.').reduce((o, i) => o[i], model);
        }

        const realOnChange = (value: any): void => {
          if (key.includes('.')) {
            if (key.indexOf('.') !== key.lastIndexOf('.')) {
              console.error('Would need a deepMerge function for this to work!!');
              failure('Configuration? ' + key);
              return;
            }
            const [key1, key2] = key.split('.');
            onChange({...model, [key1]: {...model[key1], [key2]: value} });

          } else {
            onChange({...model, [key]: value});
          }
        };

        const EditComponent: any = getComponent(col);
        return (
          <Col {...colSizes} key={reactKey || key || index}>
            <EditComponent
              label={(label && t(label)) || t(tPrefix + key)}
              value={value}
              onChange={(value: any) => realOnChange(value)}
              data-tst={tPrefix + key}
              prefix={prefix ? (typeof prefix === 'string' ? getIconOrText(prefix as InputIcons) : prefix) : undefined}
              suffix={suffix ? (typeof suffix === 'string' ? getIconOrText(suffix as InputIcons) : suffix) : undefined}
              {...props}
            />
          </Col>
        );
      })}
    </>
  );
};



const getColSizes = (cols?: number | ColSize | ColSizes): ColSizes => {
  const defaultLg = 4;
  const defaultSm = 6;
  const defaultConfig = {
    lg: {span: defaultLg},
    sm: {span: defaultSm},
  };

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
    }
  }

  if (cols['span'] || cols['offset']) {
    return {
      lg: {span: cols['span'] || defaultLg, offset: cols['offset']},
      sm: {span: defaultSm, offset: cols['offset']},
    }
  }

  const sizes = cols as ColSizes;
  // return {...defaultConfig, ...sizes};
  return sizes;
}
