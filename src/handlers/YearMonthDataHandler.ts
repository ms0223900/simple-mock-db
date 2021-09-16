import { ReqDataHandler } from "@/types";

const YearMonthDataHandler: ReqDataHandler<any> = (req, dataList) => {
  const {
    params,
  } = req;
  const {
    year, month
  } = params;

  if(year && dataList.length > 0) {
    if(month) {
      return [
        {
          ...dataList[0],
          year: Number(year),
          month: Number(month),
        }
      ];
    }
    return dataList.filter(d => String(d.year) === String(year));
  }
  
  return dataList;
};

export default YearMonthDataHandler;