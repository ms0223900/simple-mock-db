import jsonServer from 'json-server';
import cors from 'cors';
import routes from './server.settings';
import LoremZhPlugin from './plugins/LoremZh.plugin';
import MockServer from './utils/MockServer';
import SimpleEmailGenerator from './plugins/SimpleEmailGenerator.plugin';
import BasicGetterResolvers from './getterResolvers/BasicGetterResolvers';
import DateGenerator from './plugins/DateGenerator.plugin';

export const server = jsonServer.create();
server.use(cors({
  origin: '*',
}));


const mockServer = new MockServer({
  routeList: routes,
  getterResolvers: BasicGetterResolvers
});

mockServer  
  .addPlugin(LoremZhPlugin)
  .addPlugin(SimpleEmailGenerator)
  .addPlugin(DateGenerator)
  .serve();