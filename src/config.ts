import { PluginsByDataType, ServerMethod } from "./types";

export const DEFAULT_DATA_LIST_AMOUNT = 10;
export const MAX_DATA_LIST_AMOUNT = 100;

export const defaultPlugins: PluginsByDataType = {
  string: [],
  number: [],
  object: [],
  array: [],
  date: [],
};


export const defaultServerMethod: ServerMethod = 'get';
export const port = process.env.PORT || 3000;