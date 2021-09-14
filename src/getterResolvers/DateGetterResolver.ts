import { SingleGetterResolver } from "@/types";

const oneDayMs = 24 * 60 * 60 * 1000;

const DateGetterResolver: SingleGetterResolver = {
  name: 'dateGetter',
  resolveByGetterInput: ({
    type, condition, param
  }) => {
    return (idx = 0) => {
      const now = new Date();
      if(type === 'get') {
        if(condition === 'ascByIdx') {
          const devided = param.split('/');
          // console.log(devided);
          const ascNum = devided[1];
          
          if(!Number.isNaN(Number(ascNum))) {
            const ascDate = Math.floor(idx / Number(ascNum));
            now.setTime(now.getTime() + ascDate * oneDayMs);
            // return now.toLocaleDateString();
          }
        }
      }

      return now.toLocaleDateString();
    };
  }
};

export default DateGetterResolver;