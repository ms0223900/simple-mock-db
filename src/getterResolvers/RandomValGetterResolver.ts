import { SingleGetterResolver } from "@/types";
import getRandomNumberByRange from "@/utils/getRandomNumberByRange";
import SchemaParser from "@/utils/SchemaParser";

export type RandomValGetterResolverOutput = 
  { startIdx: number, endIdx: number } | 
  undefined

const RandomValGetterResolver: SingleGetterResolver = {
  name: 'randomGetter',
  resolveByGetterInput: ({
    type,
    condition,
    param,
  }) => {
    return (valAmount = 0): RandomValGetterResolverOutput => { 
      if(type === 'get' && condition === 'limit') {
        const {
          min, max,
        } = SchemaParser.parseRangeParam(param);

        const randomRange = getRandomNumberByRange(min, max);
        const rangeEndIdx = valAmount - randomRange < 0 ? 0 : valAmount - randomRange;
        const startIdx = getRandomNumberByRange(0, rangeEndIdx);

        return ({
          startIdx,
          endIdx: startIdx + randomRange,
        });
      }
      return undefined;
    };
  },
};

export default RandomValGetterResolver;