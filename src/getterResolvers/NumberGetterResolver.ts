import { SingleGetterResolver } from "@/types";

const NumberGetterResolver: SingleGetterResolver = {
  name: 'numberGetter',
  resolveByGetterInput: (getter) => {
    const {
      type, condition, param,
    } = getter;
    return (idx: number) => {
      // console.log(getter);
      if(type === 'get') {
        if(condition === 'ascByIdx') {
          let initNum = idx;
          let calcParamStr = param;

          if(param.includes('+')) {
            const devidedByPlus = param.split(/\s*\+\s*/g);
            initNum = devidedByPlus[0];
            calcParamStr = devidedByPlus[1];
          }

          const devided = calcParamStr.split('/');
          const ascNumParam = devided[1];
          
          if(!Number.isNaN(Number(ascNumParam))) {
            const asc = Math.floor(idx / Number(ascNumParam));
            const res = Number(initNum) + asc;
            return res;
            // return now.toLocaleDateString();
          }

        }
      }

      return idx;
    };
  }
};

export default NumberGetterResolver;