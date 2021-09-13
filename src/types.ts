
import { Request, Response } from 'express';

export type ServerMethod = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'


type RouteResFn<ReqHandledRes> = (res: Response, reqHandledRes?: ReqHandledRes) => any

export interface SingleRoute<HandledReqResult extends any = any> {
  path: string
  pathName: string
  method?: ServerMethod

  reqFn?: (req: Request) => any
  resFn?: RouteResFn<HandledReqResult>

  schema?: Record<string, any>
}

export enum DataType {
  'string' = 'string',
  'number' = 'number',
  'object' = 'object',
  'array' = 'array',
  'date' = 'date',
}

export interface DataTypeInput {
  dataType: DataType // string
  specificType: string // lorem-zh
  specificTypeProperty?: string
}

// get.limit:5-10
export interface GetterInput {
  type: string // get
  condition: string // limit
  param: any // 5-10
}

export interface SinglePlugin extends DataTypeInput {
  name: string
  getterFn: (getter: GetterInput) => any
}


export type PluginsByDataType = Record<DataType, SinglePlugin[]>