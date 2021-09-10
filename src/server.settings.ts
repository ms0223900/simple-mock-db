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
    // resFn(res, reqHandled) {
    //   const gameId = reqHandled;
    //   res.send(
    //     `Game: ${gameId}`
    //   );
    // }
  } as SingleRoute<number>,
];

export default routes;