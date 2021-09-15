import { SingleGetterResolver } from "@/types";
import genRandomDataFromArr from "@/utils/genRandomDataFromArr";

const booleanStr = [
  'true', 'false',
];

const booleans = [
  true, false,
];

const BooleanGetterResolver: SingleGetterResolver = {
  name: 'booleanGetter',
  resolveByGetterInput: ({
    type, condition, param
  }) => {
    // console.log(param);
    if(booleanStr.includes(param)) {
      if(param === 'false') return false;
      return true;
    }

    return genRandomDataFromArr(booleans);
  }
};

export default BooleanGetterResolver;