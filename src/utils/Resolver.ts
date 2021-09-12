import SchmeaParser, { DataTypeInput, ParsedGetterInput } from "./SchemaParser";

export interface TypeAndGetter {
  type: DataTypeInput
  getter: ParsedGetterInput
}

export interface KeyWithParsedTypeAndGetter extends TypeAndGetter {
  key: string
}

class Resolver<Data extends Record<string, any>> {
  keyWithParsedTypeAndGetterList: KeyWithParsedTypeAndGetter[]
  data: Data[]

  constructor(keyWithParsedTypeAndGetterList: KeyWithParsedTypeAndGetter[]) {
    this.keyWithParsedTypeAndGetterList = keyWithParsedTypeAndGetterList;
    this.data = [];
  }

  async getObjectDataByGetter(
    idx: number,
    getter: ParsedGetterInput,
    otherResolverList: any, 
    resolver: Resolver<any>
  ): Promise<any | null> {
    const {
      key,
      otherResolverKey,
    } = SchmeaParser.parseParam(getter.param);
    switch (getter.type) {
      case 'find':
        if(getter.condition === 'eq') {
          // console.log(this.data[idx]);
          const val = this.data[idx] ? this.data[idx][key] : undefined;
          const dataFromOtherResolver = await resolver.get(otherResolverList);
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

  resolveSingleData(otherResolverList: any, idx: number) {
    return async ({
      type: dataType,
      getter
    }: TypeAndGetter): Promise<any | null> => {
      // console.log(dataType.dataType);
      switch (dataType.dataType) {
        case 'object': {
          const otherResolver = otherResolverList[dataType.specificType];
          if(otherResolver) {
            // get data from other otherResolver
            return await this.getObjectDataByGetter(idx, getter, otherResolverList, otherResolver); 
          }
          return null;
        }
        
        case 'number':
          return idx;

        case 'string':
          return 'test str';

        case 'array':
          return [];

        default:
          return null;
      }
    };
  }

  async getSingle(otherResolverList: any, idx: number, condition?: Record<string, any>, ): Promise<Data> {
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

    if(condition) {
      for (const conditionKey in condition) {
        if(res[conditionKey]) {
          res = {
            ...res,
            [conditionKey]: condition[conditionKey],
          };
        }
      }
    }
    // console.log(res);

    return res;
  }

  async get(otherResolverList: any, amount = 3): Promise<Data[]> {
    let res: Data[] = [];
    let idx = 0;
    for await (const iterator of Array(amount).fill(0)) {
      const singleData = await this.getSingle(otherResolverList, idx);
      res = [...res, singleData];
      idx += 1;
    }
    return res;
  }
}

export default Resolver;