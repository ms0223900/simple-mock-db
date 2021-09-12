export interface SingleProfile {
  userId: number
  intro: string
}

const profileList: SingleProfile[] = [
  {
    userId: 1,
    intro: 'hi'
  },
  {
    userId: 2,
    intro: 'profile 2 :)'
  }
];

export default profileList;