import jsonServer from 'json-server';
import cors from 'cors';
import routes from './server.settings';
import LoremZhPlugin from './plugins/LoremZh.plugin';
import MockServer from './utils/MockServer';
import SimpleEmailGenerator from './plugins/SimpleEmailGenerator.plugin';

export const server = jsonServer.create();
server.use(cors({
  origin: '*',
}));


const mockServer = new MockServer({
  routeList: routes,
});

mockServer  
  .addPlugin(LoremZhPlugin)
  .addPlugin(SimpleEmailGenerator)
  .serve();