import { Response } from "express";

const getErrMessage = (path: string) => (
  `${path} not found:(`
);

const checkStaticDataNotExist = (data: any) => {
  return typeof data === 'undefined' || 
    (typeof data === 'object' && Object.keys(data).length === 0);
};

const asyncGetStaticData = async (path: string, res?: Response) => {
  try {
    const staticData = (await import(`../static/${path}.static.ts`)).default;
    let data = staticData;
    if(typeof staticData === 'function') {
      data = staticData();
    }
    if(checkStaticDataNotExist(data)) throw new Error(getErrMessage(path));
    
    // res && data && res.status(200).send({
    //   [path]: data,
    // });
    return data;
  } catch (error) {
    res && res.status(404).send(getErrMessage(path));
  }
};

export default asyncGetStaticData;