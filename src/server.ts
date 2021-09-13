import jsonServer from 'json-server';
import cors from 'cors';
import fs from 'fs';
import { Request, Response } from 'express';
import routes from './server.settings';
import parsePath from './utils/parsePath';
import asyncGetStaticData from './utils/asyncGetStaticData';
import getParamsLackParams from './utils/getParamsLackParams';
import compareParamValue from './utils/compareParamValue';
import Resolver from './utils/Resolver';
import SchmeaParser from './utils/SchemaParser';
import { MAX_DATA_LIST_AMOUNT } from './config';
import { SinglePlugin } from './types';
import ExceptionChecker from './utils/ExceptionChecker';
import getQueryAmount from './utils/getQueryAmount';
import filterDataByParams from './utils/filterDataByParams';

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
  pathName: string
  method?: ServerMethod

  reqFn?: (req: Request) => any
  resFn?: RouteResFn<HandledReqResult>

  schema?: Record<string, any>
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

class MockServer {
  server = server
  port = port
  routeList: SingleRoute[]
  resolvers: Record<string, Resolver<any>>
  pluginList: SinglePlugin[]

  constructor({
    routeList,
    pluginList
  }: {
    routeList: SingleRoute[]
    pluginList?: SinglePlugin[]
  }) {
    this.resolvers = {};
    this.routeList = routeList;
    this.pluginList = pluginList || [];
  }

  addRoute(route: SingleRoute) {
    this.routeList.push(route);
    this.registerRoute(route);
    return this;
  }

  addResolver({ schema, path, pathName }: Pick<SingleRoute, 'schema' | 'path' | 'pathName'>) {
    let resolver = {
      async get() {
        const parsedPath = parsePath(path);
        return await asyncGetStaticData(parsedPath.path);
      } 
    } as unknown as Resolver<any>;

    if(schema) {
      resolver = new Resolver(
        SchmeaParser.parseSchema(schema)
      );
    } 

    this.resolvers = {
      ...this.resolvers,
      [pathName]: resolver,
    };
  }

  private registerRoute({
    method,
    path,
    pathName,
    reqFn,
    resFn
  }: SingleRoute) {
    this.server[method || defaultServerMethod](path, async(req, res) => {
      const parsedPath = parsePath(path);
      const exceptionChecker = new ExceptionChecker(res);

      try {
        const handledReqResult = reqFn && reqFn(req);
        if(resFn) {
          resFn(res, handledReqResult);
          return this;
        }
        
        const {
          params,
          query,
        } = req;
        exceptionChecker.checkParamsLack(path, params);
        
        const queryAmount = getQueryAmount(query.limit as string, params.id);
        const givenKeyValues = params.id ? {
          id: Number(params.id)
        } : {};

        const resolver = this.resolvers[pathName];
        const data = await resolver.get(this.resolvers, queryAmount, givenKeyValues);
        exceptionChecker.checkDataExist(data, parsedPath.path);

        if(
          Object.keys(givenKeyValues).length > 0 || 
          Object.keys(params).length === 0
        ) {
          res.send(data);
          return this;
        }

        const filteredData = filterDataByParams(data, parsedPath.params);
        res.send(filteredData);
        // return this;

      } catch (error: any) {
        console.log(error);
        exceptionChecker.sendErrMessage(error.status, error.message);
      }
    });

    return this;
  }

  addPlugin(plugin: SinglePlugin) {
    this.pluginList.push(plugin);

    return this;
  }

  private serveHomePage() {
    const homepageStr = makeServerHomepage(this.routeList);
    const homepageRoute = routes.find(r => (
      r.path === '/' || r.pathName.toLowerCase() === 'HomePage'.toLowerCase()
    ));
    if(homepageRoute) {
      server.get(homepageRoute.path, (req, res) => {
        res.send(homepageStr);
      });
    }
  }

  private init() {
    this.serveHomePage();
    this.routeList.forEach(r => {
      this.addResolver(r);
    });
    this.routeList.forEach(route => {
      this.registerRoute(route);
    });
  }

  serve() {
    this.init();
    this.server.listen(this.port, () => {
      console.log(`Listen at http://localhost:${port}`);
    });
  }
}

const mockServer = new MockServer({
  routeList: routes,
});

mockServer  
  .serve();

// registerServerHandlers();