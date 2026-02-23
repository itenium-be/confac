import {Col} from 'react-bootstrap';
import {t} from '../../../utils';
import {FormConfig, AnyFormConfig, ColSizes, ColSize} from '../../../../models';
import {normalizeFormConfig} from '../lib/form-controls-util';
import {getIconOrText, InputIcons} from '../lib/IconFactory';
import {getComponent} from '../lib/EditComponentFactory';

type ArrayInputModel = Record<string, unknown> & { _id?: string };

type ArrayInputProps = {
  config: AnyFormConfig[];
  model: ArrayInputModel;
  onChange: (value: ArrayInputModel) => void;
  tPrefix: string;
}


export const ArrayInput = ({config, model, onChange, tPrefix}: ArrayInputProps) => {
  const result = normalizeFormConfig(config, model);

  return (
    <>
      {result.map((col: FormConfig, index: number) => {
        const {key, reactKey, label, cols, component: _component, suffix, prefix, title, props, ...restProps} = col;
        const colSizes = getColSizes(cols);

        if (!key) {
          if (title) {
            const sectionTitle = typeof title === 'string' ? title : title.title;
            if (typeof title === 'string' || title.level === 2) {
              return <Col key={sectionTitle} xs={12} style={{paddingTop: 25}}><h2>{t(sectionTitle)}</h2></Col>;
            }
            if (title.level === 3) {
              return <Col key={title.title} xs={12}><h3>{t(title.title)}</h3></Col>;
            }
            return <Col key={title.title} xs={12}><h4>{t(title.title)}</h4></Col>;
          }
          return <Col key={index} {...colSizes} />;
        }

        let value = model[key];
        if (key.includes('.')) {
          value = key.split('.').reduce((o, i) => {
            if (!o) {
              console.error(`${key}: No property ${i} on`, model);
              return `${key}: No property ${i} on ${JSON.stringify(model)}`;
            }
            return o[i];
          }, model);
        }

        const realOnChange = (val: unknown): void => {
          if (key.includes('.')) {
            const keys = key.split('.');
            if (keys.length === 2) {
              const [key1, key2] = keys;
              const nested = model[key1] as Record<string, unknown> | undefined;
              onChange({...model, [key1]: {...nested, [key2]: val}});
            } else {
              // Deep merge for nested paths like inbound.proforma.status
              const updated = {...model} as Record<string, unknown>;
              let current: Record<string, unknown> = updated;
              for (let i = 0; i < keys.length - 1; i++) {
                const k = keys[i];
                current[k] = {...(current[k] as Record<string, unknown>)};
                current = current[k] as Record<string, unknown>;
              }
              current[keys[keys.length - 1]] = val;
              onChange(updated as ArrayInputModel);
            }
          } else {
            onChange({...model, [key]: val});
          }
        };

        const getAddix = (addix?: string | React.ComponentType) => {
          if (!addix) {
            return undefined;
          }

          if (typeof addix === 'string') {
            return getIconOrText(addix as InputIcons);
          }
          return addix;
        };

        const EditComponent = getComponent(col);
        const finalComponent = (
          <EditComponent
            key={key}
            label={label === '' ? null : (label && t(label)) || t(tPrefix + key)}
            value={value}
            onChange={(val: unknown) => realOnChange(val)}
            prefix={getAddix(prefix)}
            suffix={getAddix(suffix)}
            data-testid={key}
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

  const colSize = cols as { span?: number; offset?: number };
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
