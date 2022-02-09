import { Model } from 'sequelize-typescript';
import { InitOptions } from 'sequelize/types';
import {
  loadCreateTableTemplate,
  loadDropTableTemplate,
} from './loadTemplates';

export const genCreateTableCommand = (
  tableName: string,
  columns: {},
  options?: InitOptions<Model<any, any>>,
) => {
  console.log(tableName, columns, options);
  let modelText = '';
  for (const [k, v] of Object.entries(columns)) {
    let str = '';
    for (const [kk, vv] of Object.entries(v as {})) {
      str = `${str}${kk}:${
        typeof vv === 'object'
          ? JSON.stringify(vv)
          : kk !== 'onDelete' &&
            kk !== 'onUpdate' &&
            !(kk === 'unique' && typeof vv === 'string')
          ? vv
          : `'${vv}'`
      },`;
    }
    modelText = `${modelText}${k}:{${str}},`;
  }
  return loadCreateTableTemplate()
    .replace('{tableName}', `'${tableName}'`)
    .replace('{tableProperties}', `{${modelText}}`)
    .replace('{tableOptions}', options ? JSON.stringify(options) : 'undefined');
};

export const genDropTableCommand = (tableName: string) => {
  return loadDropTableTemplate().replace('{tableName}', `'${tableName}'`);
};
