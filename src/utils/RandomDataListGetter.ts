import _ from "lodash";
import getRandomNumberByRange from "./getRandomNumberByRange";

const RandomDataListGetter = {
  getByRange<Data>(dataList: Data[], {
    min, max
  }: { min: number, max: number }): Data[] {
    const randomAmount = getRandomNumberByRange(min, max);
    const dataListWithIdx = dataList.map((data, idx) => ({
      data,
      idx,
    }));
    const shuffledDataList = _.shuffle(dataListWithIdx);
    const slicedDataListWithIdx = shuffledDataList.slice(0, randomAmount);
    const sorted = slicedDataListWithIdx.sort((prev, next) => (
      prev.idx - next.idx
    ));
    const res = sorted.map(r => r.data);
    return res;
  },
};

export default RandomDataListGetter;