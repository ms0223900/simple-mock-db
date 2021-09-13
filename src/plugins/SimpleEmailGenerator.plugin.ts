import { DataType, SinglePlugin } from "@/types";
import getRandomNumberByRange from "@/utils/getRandomNumberByRange";
import getRandomNumByParam from "@/utils/getRandomNumByParam";

const lorem = 'issimplydummytextoftheprintingandtypesettingindustry';

const SimpleEmailGenerator: SinglePlugin = {
  name: 'SimpleEmailGenerator',
  dataType: DataType.string,
  specificType: 'email',
  getterFn: ({
    param,
    type,
    condition,
  }) => {
    const randomStrLength = getRandomNumByParam(param);
    const startIdx = getRandomNumberByRange(0, lorem.length - randomStrLength);
    // if(type === '')
    return `${lorem.slice(startIdx, startIdx + randomStrLength)}@${'abc'}.com`;
  }
};

export default SimpleEmailGenerator;