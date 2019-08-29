import { AnyFormConfig, FormConfig } from "../../../../models";

export function normalizeFormConfig(config: AnyFormConfig[], model: any): FormConfig[] {
  // Add all missing model properties to config
  const configKeys: string[] = config.map(x => typeof x === 'string' ? x : x['key']);
  const missingProps = Object.keys(model).filter(k => !configKeys.includes(k));
  let fullConfig: AnyFormConfig[] = config;
  if (missingProps.length) {
    console.error(`Missing prop(s) "${missingProps.join(', ')}" for`, model);
    fullConfig = config.concat(missingProps);
  }


  const result: FormConfig[] = fullConfig.map(x => {
    if (typeof x === 'string') {
      return {key: x};
    }
    if (x['forceRow']) {
      return {cols: 12};
    }
    return x as FormConfig;

  }).filter(x => {
    if (x['updateOnly'] && !model._id) {
      return false;
    }
    return true;
  });

  return result;
}
