export interface SingleCalendar {
  id: number
  year: number
  month: number
}

const getCalendarList = (): SingleCalendar[] => [
  {
    id: 1,
    year: 2021,
    month: 7,
  },
  {
    id: 2,
    year: 2021,
    month: 8,
  },
  {
    id: 3,
    year: 2022,
    month: 10,
  }
];

export default getCalendarList;