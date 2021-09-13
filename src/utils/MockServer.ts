import { defaultPlugins, defaultServerMethod, port } from "@/config";
import { server } from "@/server";
import { PluginsByDataType, SinglePlugin, SingleRoute } from "@/types";
import asyncGetStaticData from "./asyncGetStaticData";
import ExceptionChecker from "./ExceptionChecker";
import filterDataByParams from "./filterDataByParams";
import getQueryAmount from "./getQueryAmount";
import parsePath from "./parsePath";
import Resolver from "./Resolver";
import SchemaParser from "./SchemaParser";

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
  pluginsByDataType: PluginsByDataType

  constructor({
    routeList,
    plugins
  }: {
    routeList: SingleRoute[]
    plugins?: Partial<PluginsByDataType>
  }) {
    this.resolvers = {};
    this.routeList = routeList;
    this.pluginsByDataType = {
      ...defaultPlugins,
      ...plugins,
    };
    
    this.routeList.forEach(r => {
      this.addResolver(r);
    });
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
        SchemaParser.parseSchema(schema)
      );
    } 

    this.resolvers = {
      ...this.resolvers,
      [pathName]: resolver,
    };

    this.setPluginsToResolvers();
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

        const filteredData = filterDataByParams(data, params);
        res.send(filteredData);
        // return this;

      } catch (error: any) {
        console.log(error);
        exceptionChecker.sendErrMessage(error.status, error.message);
      }
    });

    return this;
  }

  private setPluginsToResolvers(): void {
    for (const key in this.resolvers) {
      const resolver = this.resolvers[key];
      resolver.setPlugins && resolver.setPlugins(this.pluginsByDataType);
    }
  }

  addPlugin(plugin: SinglePlugin) {
    const {
      dataType,
    } = plugin;

    this.pluginsByDataType = {
      ...this.pluginsByDataType,
      [dataType]: [
        ...this.pluginsByDataType[dataType],
        plugin,
      ]
    };
    this.setPluginsToResolvers();
    
    return this;
  }

  private serveHomePage() {
    const homepageStr = makeServerHomepage(this.routeList);
    const homepageRoute = this.routeList.find(r => (
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
    this.routeList.forEach(route => {
      this.registerRoute(route);
    });
  }

  serve(): void {
    this.init();
    this.server.listen(this.port, () => {
      console.log(`Listen at http://localhost:${port}`);
    });
  }
}

export default MockServer;