import getParamsLackParams from "./getParamsLackParams";
import parsePath from "./parsePath";

class ExceptionError extends Error {
  status: string | number

  constructor(message: string, status: string | number) {
    super(message);
    this.status = status;
  }
}

class ExceptionChecker {
  response: any

  constructor(res: any) {
    this.response = res;
  }
  
  checkParamsLack(path: string, params: Record<string, any>) {
    const parsedPath = parsePath(path);
    const lackParams = getParamsLackParams(params, parsedPath.params);
    if(lackParams.length > 0) {
      throw new ExceptionError(
        `Param: ${lackParams.join(', ')} is required`,
        404
      );
    }
  }

  checkDataExist(data: any[], dataPath: string) {
    if(data.length === 0) 
      throw new ExceptionError(
        `No ${dataPath} data found :(`,
        404
      );
  }

  sendErrMessage(status: number, message: string) {
    this.response.status(status).send(
      message
    );
    return this;
  }
}

export default ExceptionChecker;