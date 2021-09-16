import { defaultPlugins } from '@/config';
import { DataType, DataTypeInput, GetterInput, PluginsByDataType, SingleGetterResolver, SinglePlugin, SingleRoute } from '@/types';
import _ from 'lodash';
import genRandomDataFromArr from './genRandomDataFromArr';
import getRandomNumberByRange from './getRandomNumberByRange';
import MakeDataListHelpers from './MakeDataListHelpers';
import RandomDataListGetter from './RandomDataListGetter';
import SchemaParser from "./SchemaParser";

export interface TypeAndGetter {
  type: DataTypeInput
  getter: GetterInput
}

export interface KeyWithParsedTypeAndGetter extends TypeAndGetter {
  key: string
}

export interface ObjectArrayDataByGetterParams {
  idx: number
  amout?: number
  dataType: TypeAndGetter['type']
  getter: TypeAndGetter['getter']
  otherResolverList: Record<string, any>
  otherResolver: Resolver<any>
}

class Resolver<Data extends Record<string, any>> {
  keyWithParsedTypeAndGetterList: KeyWithParsedTypeAndGetter[]
  data: Data[]
  pluginsByDataType: PluginsByDataType
  getterResolvers: Record<string, SingleGetterResolver>

  constructor(
    keyWithParsedTypeAndGetterList: KeyWithParsedTypeAndGetter[], 
    plugins?: Partial<PluginsByDataType>,
    getterResolvers?: Record<string, SingleGetterResolver>
  ) {
    this.keyWithParsedTypeAndGetterList = keyWithParsedTypeAndGetterList;
    this.data = [];
    this.pluginsByDataType = {
      ...defaultPlugins,
      ...plugins,
    };
    this.getterResolvers = {
      ...getterResolvers,
    };
  }

  setPlugins(plugins: Partial<PluginsByDataType>): this {
    this.pluginsByDataType = {
      ...this.pluginsByDataType,
      ...plugins,
    };
    // console.log(this.pluginsByDataType);
    return this;
  }

  setGetterResolvers(getterResolvers: Record<string, SingleGetterResolver>): this {
    this.getterResolvers = {
      ...this.getterResolvers,
      ...getterResolvers,
    };
    // console.log(this.pluginsByDataType);
    return this;
  }

  async getObjectDataByGetter({
    idx,
    getter,
    otherResolver,
    otherResolverList,
  }: ObjectArrayDataByGetterParams): Promise<any | null> {
    const {
      key,
      otherResolverKey,
    } = SchemaParser.parseParam(getter.param);
    const dataFromOtherResolver = await otherResolver.get(otherResolverList);
    // console.log(dataFromOtherResolver);

    switch (getter.type) {
      case 'find':
        if(getter.condition === 'eq') {
          const val = this.data[idx] ? this.data[idx][key] : undefined;
          if(Array.isArray(dataFromOtherResolver)) {
            const found = dataFromOtherResolver.find(d => (
              d[otherResolverKey] === val
            ));
            if(found) return found;
          }
        }
        break;
      default:
        return dataFromOtherResolver.length > 0 ? dataFromOtherResolver[0] : null;
    }
  }

  async getArrayDataByGetter({
    amout,
    dataType,
    getter,
    otherResolver,
    otherResolverList,
  }: ObjectArrayDataByGetterParams): Promise<any[]> {
    switch (getter.type) {
      case 'get':
        if(getter.condition === 'random') {
          const {
            specificTypeProperty
          } = dataType;
          const {
            min,
            max,
          } = SchemaParser.parseRangeParam(getter.param);

          const amount = Number(max);
          const dataList = await otherResolver.get(otherResolverList, amount);
          let res = RandomDataListGetter.getByRange(dataList, { min, max });
          // check property exist
          if(specificTypeProperty && res[0] && res[0][specificTypeProperty]) {
            res = res.map(r => ({
              [specificTypeProperty]: r[specificTypeProperty]
            }));
          }
          return res;
        }
        return [];
      default:
        return [];
    }

    // return [];
  }

  private resolveByPlugins(
    dataTypeInput: DataTypeInput, 
    getterInput: GetterInput,
    idx: number,
  ) {
    return (plugins: SinglePlugin[]) => {
      // console.log(this.pluginsByDataType);
      for (const plugin of plugins) {
        const {
          dataType,
          specificType,
          getterFn,
        } = plugin;
    
        if(dataType === dataTypeInput.dataType && specificType === dataTypeInput.specificType) {
          return getterFn(
            this.getterResolvers,
            getterInput, 
            idx,
          );
        } 
      }
  
      return undefined;
    };
  }

  resolveSingleData(otherResolverList: Record<string, Resolver<any>>, idx: number) {
    return async ({
      type: dataType,
      getter
    }: TypeAndGetter): Promise<any | null> => {
      // console.log(dataType.dataType);
      const otherResolver = otherResolverList[dataType.specificType];
      const resolveByPluginsFn = this.resolveByPlugins(dataType, getter, idx);

      if(Array.isArray(getter.param)) {
        return genRandomDataFromArr(getter.param);
      }

      switch (dataType.dataType) {
        case DataType.boolean: {
          return resolveByPluginsFn(this.pluginsByDataType.boolean);
        }

        case DataType.object: {
          const resolved = resolveByPluginsFn(this.pluginsByDataType.object);
          if(resolved) return resolved;
          return await this.getObjectDataByGetter({ 
            idx, dataType, getter, otherResolverList, otherResolver 
          }); 
        }
        
        case DataType.number: {
          const resolved = resolveByPluginsFn(this.pluginsByDataType.number);
          if(typeof resolved === 'number') return resolved;
          return idx;
        }

        case DataType.string: {
          const resolved = resolveByPluginsFn(this.pluginsByDataType.string);
          if(typeof resolved === 'string') return resolved;
          return 'test str';
        }

        case DataType.array:
          return await this.getArrayDataByGetter({
            idx, dataType, getter, otherResolverList, otherResolver 
          });

        default:
          return null;
      }
    };
  }

  async getSingleData(otherResolverList: Record<string, Resolver<any>>, idx: number): Promise<Data> {
    let res = {} as Data;
    const resolveSingleDataFn = this.resolveSingleData(otherResolverList, idx);

    for await (const {
      key,
      type,
      getter
    } of this.keyWithParsedTypeAndGetterList) {
      const data = await resolveSingleDataFn({ type, getter });
      res = {
        ...res,
        [key]: data
      };
      this.data[idx] = res;
    }

    return res;
  }

  async get(otherResolverList: Record<string, Resolver<any>>, amount = 3, givenKeyVal?: Record<string, any>): Promise<Data[]> {
    let res: Data[] = [];
    let idx = 0;
    for await (const iterator of Array(amount).fill(0)) {
      let singleData = await this.getSingleData(otherResolverList, idx);

      if(givenKeyVal) {
        for (const key in givenKeyVal) {
          if(typeof singleData[key] !== 'undefined') {
            singleData = {
              ...singleData,
              [key]: givenKeyVal[key],
            };
          }
        }
      }

      res = [...res, singleData];
      idx += 1;
    }
    return res;
  }
}

export default Resolver;