const MakeDataListHelpers = {
  makeArrData<Data>(makeSingleDataFn: ((idx: number, ...params: any) => Data), amount: number): Data[] {
    return Array(amount).fill(0).map((a, idx) => (
      makeSingleDataFn(idx)
    ));
  },
};

export default MakeDataListHelpers;
