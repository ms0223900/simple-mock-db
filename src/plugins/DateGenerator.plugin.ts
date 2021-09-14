import { DataType, SingleGetterResolver, SinglePlugin } from "@/types";

const DateGenerator: SinglePlugin = {
  name: 'DateGenerator',
  dataType: DataType.string,
  specificType: 'date',
  getterFn: (
    getterResolvers,
    getter,
    idx
  ) => {
    if(getterResolvers['dateGetter']) {
      const res = (getterResolvers['dateGetter'] as SingleGetterResolver).resolveByGetterInput(getter)(idx);
      return res;
    }
    return new Date().toLocaleDateString();
  }
};

export default DateGenerator;