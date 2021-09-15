import { DataType, SinglePlugin } from "@/types";

const ImageGenerator: SinglePlugin = {
  name: 'ImageGenerator',
  dataType: DataType.object,
  specificType: 'image',
  getterFn: (
    getters, getter
  ) => {
    if(getters['fakeImageGetter'] && getter.condition === 'fakeImg') {
      return getters['fakeImageGetter'].resolveByGetterInput(getter);
    }
    return null;
  }
};

export default ImageGenerator;