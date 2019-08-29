import React from "react";
import { StringInput } from "./StringInput";
import { Col } from "react-bootstrap";
import { t } from "../../../util";
import { FormConfig, AnyFormConfig } from "../../../../models";
import { normalizeFormConfig } from "../lib/form-controls-util";
import { getIcon, InputIcons } from "../lib/IconFactory";

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

        const EditComponent: any = component || StringInput;
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
              prefix={prefix ? (typeof prefix === 'string' ? getIcon(prefix as InputIcons) : prefix) : undefined}
              suffix={suffix ? (typeof suffix === 'string' ? getIcon(suffix as InputIcons) : suffix) : undefined}
              {...props}
            />
          </Col>
        );
      })}
    </>
  );
};
