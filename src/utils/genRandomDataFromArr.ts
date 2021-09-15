const getIndexByRandom = (length: number) => {
  const interval = Math.floor((1 / (length)) * 100);
  return Math.floor(Math.floor(Math.random() * 100) / interval);
};

function genRandomDataFromArr<Data>(dataList: Data[]): Data {
  const res = dataList[getIndexByRandom(dataList.length)];
  return res;
}

// console.log(getIndexByRandom(10));
// console.log(
//     genRandomDataFromArr(['a', 'b', 'c']),
// );

export default genRandomDataFromArr;
