import { DataType, SinglePlugin } from "@/types";
import getRandomNumberByRange from "@/utils/getRandomNumberByRange";
import SchemaParser from "@/utils/SchemaParser";

const RandomNumberGenerator: SinglePlugin = {
  name: 'RandomNumberGenerator',
  dataType: DataType.number,
  specificType: 'random',
  getterFn: (resolvers, {
    type, condition, param
  }) => {
    if(type === 'get' && condition === 'limit') {
      const {
        min, max
      } = SchemaParser.parseRangeParam(param);
      return getRandomNumberByRange(min, max);
    }
  }
};

export default RandomNumberGenerator;