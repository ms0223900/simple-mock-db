import _ from 'lodash';
import getRandomNumberByRange from './getRandomNumberByRange';
import MakeDataListHelpers from './MakeDataListHelpers';
import RandomDataListGetter from './RandomDataListGetter';
import SchemaParser, { DataTypeInput, ParsedGetterInput } from "./SchemaParser";

export interface TypeAndGetter {
  type: DataTypeInput
  getter: ParsedGetterInput
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

  constructor(keyWithParsedTypeAndGetterList: KeyWithParsedTypeAndGetter[]) {
    this.keyWithParsedTypeAndGetterList = keyWithParsedTypeAndGetterList;
    this.data = [];
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
    switch (getter.type) {
      case 'find':
        if(getter.condition === 'eq') {
          // console.log(this.data[idx]);
          const val = this.data[idx] ? this.data[idx][key] : undefined;
          const dataFromOtherResolver = await otherResolver.get(otherResolverList);
          // console.log(dataFromOtherResolver, val);
          if(Array.isArray(dataFromOtherResolver)) {
            const found = dataFromOtherResolver.find(d => (
              d[otherResolverKey] === val
            ));
            if(found) return found;
          }
          return null;
        }
        return null;
      default:
        return null;
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

  resolveSingleData(otherResolverList: any, idx: number) {
    return async ({
      type: dataType,
      getter
    }: TypeAndGetter): Promise<any | null> => {
      // console.log(dataType.dataType);
      const otherResolver = otherResolverList[dataType.specificType];
      switch (dataType.dataType) {
        case 'object': {
          return await this.getObjectDataByGetter({ 
            idx, dataType, getter, otherResolverList, otherResolver 
          }); 
        }
        
        case 'number':
          return idx;

        case 'string':
          return 'test str';

        case 'array':
          return await this.getArrayDataByGetter({
            idx, dataType, getter, otherResolverList, otherResolver 
          });

        default:
          return null;
      }
    };
  }

  async getSingleData(otherResolverList: any, idx: number, givenKeyVal?: Record<string, any>, ): Promise<Data> {
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

  async get(otherResolverList: any, amount = 3, givenKeyVal?: Record<string, any>): Promise<Data[]> {
    let res: Data[] = [];
    let idx = 0;
    for await (const iterator of Array(amount).fill(0)) {
      let singleData = await this.getSingleData(otherResolverList, idx, givenKeyVal);

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