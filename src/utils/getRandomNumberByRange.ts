const getRandomNumberByRange = (start: number, end: number): number => {
  const during = end - start + 1;
  const random = Math.random();
  return Math.floor(random * during) + start;
};

export default getRandomNumberByRange;