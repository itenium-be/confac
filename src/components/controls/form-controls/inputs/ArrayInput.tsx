import React from "react";
import { Col } from "react-bootstrap";
import { t } from "../../../util";
import { FormConfig, AnyFormConfig } from "../../../../models";
import { normalizeFormConfig } from "../lib/form-controls-util";
import { getIconOrText, InputIcons } from "../lib/IconFactory";
import { getComponent } from "../lib/EditComponentFactory";

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
        const {key, cols, offset, component, suffix, prefix, ...props} = col;
        if (!key) {
          return <Col key={index} xs={cols} />;
        }

        const EditComponent: any = getComponent(col);
        return (
          <Col
            md={{span: cols || 4, offset: offset}}
            sm={{span: cols || 6, offset: offset}}
            key={key || index}
          >
            <EditComponent
              label={t(tPrefix + key)}
              value={model[key]}
              onChange={(value: any) => onChange({...model, [key as string]: value})}
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
