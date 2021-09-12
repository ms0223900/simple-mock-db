import { SingleRoute } from "./server";
import asyncGetStaticData from "./utils/asyncGetStaticData";

const routes: SingleRoute[] = [
  {
    path: '/',
    pathName: 'Home',
    reqFn: (req) => req.params,
    resFn: (res) => res.send(
      'Hello Mock server'
    )
  },
  {
    path: '/article/:id?',
    pathName: 'Article',
    reqFn: (req) => 
      !Number.isNaN(Number(req.params.id)) ? Number(req.params.id) : undefined,
  } as SingleRoute<number>,
  {
    path: '/game/:id?',
    pathName: 'Game',
    reqFn: (req) => 
      !Number.isNaN(Number(req.params.id)) ? Number(req.params.id) : undefined,
  } as SingleRoute<number>,
  {
    path: '/calendar/:year?/:month?',
    pathName: 'Calendar',
  },
  {
    path: '/profile/:id?',
    pathName: 'Profile',
    schema: {
      userId: [
        'number:seq', 'get.eq:idx',
      ],
      someVal: [
        'string:lorem', 'get.limit:20-100'
      ]
    }
  },
  {
    path: '/user',
    pathName: 'User',
    schema: {
      id: ['number:seq', 'get.eq:idx'],
      name: ['string:lorem', 'get.limit:5-10'],
      intro: ['string', [
        'abc',
        'cde',
        'efg',
      ]],
      email: ['string:email', 'get.limit:6-10'],
      profile: [
        'object:Profile', // dataType:specificType
        'find.eq: id & userId',
      ],
      sharedArticleList: [
        'array:Article.id',
        'get.random:2-10'
      ]
    }
  }
];

export default routes;