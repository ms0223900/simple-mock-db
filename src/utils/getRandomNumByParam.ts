import getRandomNumberByRange from "./getRandomNumberByRange";
import SchemaParser from "./SchemaParser";

const getRandomNumByParam = (param: string): number => {
  const {
    min, max
  } = SchemaParser.parseRangeParam(param);
  return getRandomNumberByRange(min, max);
};

export default getRandomNumByParam;