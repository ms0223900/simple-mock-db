import jsonServer from 'json-server';
import cors from 'cors';
import fs from 'fs';
import { Request, Response } from 'express';
import routes from './server.settings';
import parsePath from './utils/parsePath';
import asyncGetStaticData from './utils/asyncGetStaticData';
import getParamsLackParams from './utils/getParamsLackParams';
import compareParamValue from './utils/compareParamValue';

const port = process.env.PORT || 3000;
const server = jsonServer.create();
server.use(cors({
  origin: '*',
}));

type ServerMethod = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'

const defaultServerMethod: ServerMethod = 'get';

type RouteResFn<ReqHandledRes> = (res: Response, reqHandledRes?: ReqHandledRes) => any

export interface SingleRoute<HandledReqResult extends any = any> {
  path: string
  pathName?: string
  method?: ServerMethod

  reqFn?: (req: Request) => any
  resFn?: RouteResFn<HandledReqResult>
}

const makeServerHomepage = (routes: SingleRoute[]) => {
  const routeListContent = routes.map(route => {
    const pathName = route.pathName || route.path;
    const path = route.path;
    return (
      `<li>${pathName.toLocaleUpperCase()}: 
        <a href="${`http://localhost:${port}${path}`}">
          ${`http://localhost:${port}${path}`}
        </a>
      </li>`
    );
  }).join('\n');

  return (
    `
      <div style="margin:auto;">
        <h1>${'Hello Mock Server!'}</h1>
        <ol>
          ${routeListContent}
        </ol>
      </div>
    `
  );
};

const registerServerHandlers = () => {
  const homepageStr = makeServerHomepage(routes);
  const homepage = routes.find(r => r.path === '/');

  if(homepage) {
    server.get(homepage.path, (req, res) => {
      res.send(homepageStr);
    });
  }

  routes.forEach(route => {
    server[route.method || defaultServerMethod](route.path, async (req, res) => {
      const handledReqResult = route.reqFn && route.reqFn(req);
      if(route.resFn) {
        route.resFn(res, handledReqResult);
      } else {
        const {
          params,
        } = req;

        const parsedPath = parsePath(route.path);
        const lackParams = getParamsLackParams(params, parsedPath.params);
        if(lackParams.length > 0) {
          res.status(404).send(`Param: ${lackParams.join(', ')} is required`);
        }
        
        const data = await asyncGetStaticData(parsedPath.path, res);

        if(data) {
          const haveParams = Object.keys(params).length > 0;
          if(!haveParams) 
            return res.send(data);
          if(Array.isArray(data)) {

            const filtered = data.filter((d: Record<string, any>) => {
              let found = true;
              for (const paramKey in parsedPath.params) {
                const property = d[paramKey];
                const paramFromReq = params[paramKey] as string | undefined;
                // console.log(property, paramFromReq);
                if(!compareParamValue(paramFromReq, property)) {
                  found = false;
                }
              }
              return found;
            });

            res.send(filtered);
          }
        } else {
          res.status(404).send(`No ${parsedPath.path} data found :(`);
        }
      }
    });
  });

  server.listen(port, () => {
    console.log(`Listen at http://localhost:${port}`);
  });
};

registerServerHandlers();