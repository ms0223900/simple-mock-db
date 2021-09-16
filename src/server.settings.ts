import YearMonthDataHandler from "./handlers/YearMonthDataHandler";
import { SingleRoute } from "./types";
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
    schema: {
      id: [
        'number:seq', 'get.eq:idx',
      ],
      title: [
        'string:lorem-zh',
      ],
      content: [
        'string',
      ]
    }
  } as SingleRoute<number>,
  {
    path: '/game/:id?',
    pathName: 'Game',
    reqFn: (req) => 
      !Number.isNaN(Number(req.params.id)) ? Number(req.params.id) : undefined,
    schema: {
      id: [
        'number:seq',
      ],
      title: [
        'string:lorem-zh', 'get.limit:5-10',
      ],
      content: [
        'string:lorem-zh', 'get.limit:30-100',
      ],
      createdAt: [
        'object:Calendar', 'get'
      ]
    }
  } as SingleRoute<number>,
  {
    path: '/calendar/:year?/:month?',
    pathName: 'Calendar',
    reqDataHandlers: [
      YearMonthDataHandler,
    ],
    schema: {
      year: [
        'number:basic', 'get.ascByIdx:2021 + idx/4'
      ],
      month: [
        'number:random', 'get.limit:1-12'
      ],
      date: [
        'number:random', 'get.limit:1-30'
      ]
    }
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
      ],
      isPublished: [
        'boolean', 'get.eq:true',
      ]
    }
  },
  {
    path: '/user/:id?',
    pathName: 'User',
    schema: {
      id: ['number:seq', 'get.eq:idx'],
      name: ['string:lorem-zh', 'get.limit:5-10'],
      coverImg: [
        'object:image', 'find.fakeImg:1_1',
      ],
      intro: ['string:list', [
        'abc',
        'cde',
        'efg',
      ]],
      email: ['string:email', 'get.limit:6-10'],
      profile: [
        'object:Profile', // dataType:specificType
        // id === userId
        'find.eq: id & userId', // getter(type, condition, param)
      ],
      sharedArticleList: [
        'array:Article',
        'get.random:2-5' // get randomily(choose 2 ~ 10, )
      ],
      createdAt: [
        'string:date',
        'get.ascByIdx:idx/4'
      ],
      sharedGameList: [
        'array:Game',
        'get.random:2-5'
      ]
    }
  }
];

export default routes;