import compareParamValue from "./compareParamValue";

const filterDataByParams = <Data extends Record<string, any>>(
  data: Data[], 
  params: Record<string, any>,
): Data[] => {
  const filtered = data.filter(d => {
    for (const paramKey in params) {
      const property = d[paramKey];
      const paramFromReq = params[paramKey] as string | undefined;
      // console.log(property, paramFromReq);
      if(!compareParamValue(paramFromReq, property)) {
        return false;
      }
    }
    return true;
  });
  // console.log(params);
  
  return filtered;
};

export default filterDataByParams;