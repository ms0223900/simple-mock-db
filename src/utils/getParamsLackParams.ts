const getParamsLackParams = (
  paramsFromReq: Record<string, string | undefined>, paramsRequireObj: Record<string, {
    isRequired: boolean
  }>) => {
  const lackParams = [];
  for (const paramKey in paramsRequireObj) {
    const property = paramsFromReq[paramKey];
    const {
      isRequired,
    } = paramsRequireObj[paramKey];
    if(isRequired && typeof property === 'undefined') {
      lackParams.push(paramKey);
    } 
  }
  return lackParams;
};

export default getParamsLackParams;