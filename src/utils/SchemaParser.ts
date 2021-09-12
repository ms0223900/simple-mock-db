export const SchemaParserRegExps = {
  paramSplitter: ':',
  conditionSplitter: '.',
  // selectByKeyValue: /\s*=>\s*/g,
  paramConnector: /\s*&\s*/g,
  rangeParamConnector: /\s*-\s*/g,
};

export interface DataTypeInput {
  dataType: string
  specificType: string
  specificTypeProperty?: string
}

export interface ParsedGetterInput {
  type: string
  condition: string
  param: any
}

export interface TypeAndGetter {
  type: DataTypeInput
  getter: ParsedGetterInput
}

export interface KeyWithParsedTypeAndGetter extends TypeAndGetter {
  key: string
}

const SchmeaParser = {
  parseDataType(dataTypeStr: string): DataTypeInput {
    let res: DataTypeInput = {
      dataType: '',
      specificType: '',
      specificTypeProperty: undefined,
    };

    const devided = dataTypeStr.split(SchemaParserRegExps.paramSplitter);
    const [
      dataType,
      rawSpecificType,
    ] = devided;
    res.dataType = dataType;

    if(rawSpecificType) {
      const [
        specificType,
        specificTypeProperty,
      ] = rawSpecificType.split(SchemaParserRegExps.conditionSplitter);

      res = {
        ...res,
        specificType,
        specificTypeProperty,
      };
    }
    
    return res;
  },

  parseGetter(getterInput: string | any[] | undefined): ParsedGetterInput {
    if(!getterInput) {
      return ({
        type: 'get',
        condition: 'default',
        param: '',
      });
    }

    if(Array.isArray(getterInput)) {
      return ({
        type: 'get',
        condition: 'random',
        param: getterInput,
      });
    }

    const devided = getterInput.split(SchemaParserRegExps.paramSplitter);
    const type = devided[0];
    const [
      getterType,
      getterCondition,
    ] = type.split(SchemaParserRegExps.conditionSplitter);
    const getterParam = devided[1];

    return ({
      type: getterType,
      condition: getterCondition,
      param: getterParam,
    });
  },

  parseParam(paramStr: string) {
    const [
      key,
      otherResolverKey,
    ] = paramStr.split(
      SchemaParserRegExps.paramConnector
    ).map(str => str.replace(/\s/, ''));
    return ({
      key,
      otherResolverKey,
    });
  },

  parseRangeParam(paramStr = '1-100'): {
    min: number, max: number
  } {
    const [
      min,
      max,
    ] = paramStr.split(
      SchemaParserRegExps.rangeParamConnector
    ).map(str => str.trim());

    return ({
      min: Number(min),
      max: Number(max),
    });
  },

  parseSchema(schema: Record<string, any>): KeyWithParsedTypeAndGetter[] {
    let res: KeyWithParsedTypeAndGetter[] = [];

    for (const key in schema) {
      const property = schema[key];
      const type = this.parseDataType(property[0]);
      const getter = this.parseGetter(property[1]);
      res = [...res, {
        key,
        type,
        getter,
      }];
    }
    
    return res;
  }
};

export default SchmeaParser;