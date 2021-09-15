import { DataType, SinglePlugin } from "@/types";

const BasicBooleanGenerator: SinglePlugin = {
  name: 'BasicBooleanGenerator',
  dataType: DataType.boolean,
  specificType: '',
  getterFn: (
    getters, getter
  ) => {
    if(getters['booleanGetter']) {
      return getters['booleanGetter'].resolveByGetterInput(getter);
    }
    return false;
  }
};

export default BasicBooleanGenerator;