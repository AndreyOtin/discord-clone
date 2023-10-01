import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIo } from '@/types/app';

export const config = {
  api: {
    bodyParser: false
  }
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server;

    res.socket.server.io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false
    });
  }

  console.log('soketio');

  res.end();
};

export default ioHandler;
