import { DataType, SinglePlugin } from "@/types";

const BasicNumberGenerator: SinglePlugin = {
  name: 'BasicNumberGenerator',
  dataType: DataType.number,
  specificType: 'basic',
  getterFn: (resolvers, getter, idx) => {
    // if(type === 'get') {
    //   if(condition === 'ascByIdx') {

    //   }
    // }

    // return idx
    if(resolvers['numberGetter']) {
      return resolvers['numberGetter'].resolveByGetterInput(getter)(idx);
    }
    return idx;
  }
};

export default BasicNumberGenerator;