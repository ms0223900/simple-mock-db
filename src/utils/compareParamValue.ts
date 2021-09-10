const compareParamValue = (paramFromReq: any, valueInData: any): boolean => {
  if(!paramFromReq) return true;
  if(typeof paramFromReq === 'object') {
    return JSON.stringify(paramFromReq) === JSON.stringify(valueInData);
  }
  return String(paramFromReq) === String(valueInData);

};

export default compareParamValue;