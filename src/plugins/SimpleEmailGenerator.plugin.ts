import BasicGetterResolvers from "@/getterResolvers/BasicGetterResolvers";
import { RandomValGetterResolverOutput } from "@/getterResolvers/RandomValGetterResolver";
import { DataType, SinglePlugin } from "@/types";
import getRandomNumberByRange from "@/utils/getRandomNumberByRange";
import getRandomNumByParam from "@/utils/getRandomNumByParam";

const lorem = 'issimplydummytextoftheprintingandtypesettingindustry';

const SimpleEmailGenerator: SinglePlugin = {
  name: 'SimpleEmailGenerator',
  dataType: DataType.string,
  specificType: 'email',
  getterFn: (getterResolver, getter) => {
    if(getterResolver['randomGetter']) {
      const resolved = getterResolver['randomGetter'].resolveByGetterInput(getter)(lorem.length - 1) as RandomValGetterResolverOutput;
      if(resolved) {
        return `${lorem.slice(resolved.startIdx, resolved.endIdx)}@${'abc'}.com`;
      }
    }
    return `${lorem.slice(0, 10)}@${'abc'}.com`;
  }
};

export default SimpleEmailGenerator;