export interface SingleGame {
  id: number
  gameTag: string
}

const gameTagList = ['act', 'acg', 'fps'];

const getRandomGameTag = () => gameTagList[Math.floor(Math.random() * 3)];

const gameListData = (): SingleGame[] => [
  {
    id: 1,
    gameTag: getRandomGameTag(),
  },
  {
    id: 2,
    gameTag: getRandomGameTag(),
  },
  {
    id: 3,
    gameTag: getRandomGameTag(),
  },
];

export default gameListData;