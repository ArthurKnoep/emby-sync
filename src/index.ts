import * as SocketIO from 'socket.io'
import * as http from 'http';
import * as express from 'express';
import { Pool } from './pool';
import { Handler } from './server/handler';

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

const h = new Handler(io, new Pool(io));
h.handle();

server.listen(process.env.PORT || 3000, () => {
    console.log(`listening on *:${process.env.PORT || 3000}`);
});
