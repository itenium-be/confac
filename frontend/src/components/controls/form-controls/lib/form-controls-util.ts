import {FullFormConfig, AnyFormConfig, FormConfig, NewRowFormConfig} from '../../../../models';


export function normalizeFormConfig(config: FullFormConfig, model: any): FormConfig[] {
  // Add all missing model properties to config
  const configKeys: string[] = config.map(x => (typeof x === 'string' ? x : (x as FormConfig).key)).filter((k): k is string => k !== undefined);
  let fullConfig: AnyFormConfig[] = config;

  if (config.addMissingProps) {
    const missingProps = Object.keys(model).filter(k => !configKeys.includes(k));
    if (missingProps.length) {
      console.error(`Missing prop(s) "${missingProps.join(', ')}" for`, model);
      fullConfig = config.concat(missingProps);
    }
  }

  const result: FullFormConfig = fullConfig.map(x => {
    if (typeof x === 'string') {
      return {key: x};
    }

    const newRow = x as NewRowFormConfig;
    if (newRow.forceRow) {
      return {cols: 12};
    }
    return x as FormConfig;

  }).filter(x => {
    if (x.updateOnly && !model._id) {
      return false;
    }
    return true;
  });

  return result as FormConfig[];
}
