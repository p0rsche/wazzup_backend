import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import apiRouter from './routes/api';
import sharedLinkRouter from './routes/shared';

import errorHanlder from './middleware/errorHandler';

class Server {
  private app: express.Application;
  private port: number;

  constructor(port = 4000) {
    this.app = express();
    this.port = port;
    this.setupLogging();
    this.configure();
    this.setupRouting();
    this.catchErrors();
  }

  private configure() {
    this.app.use(cookieParser());
    this.app.use(compression());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.json({ limit: '1mb' })); // default is 100kb so increase
    this.app.use(
      cors({
        origin: 'http://localhost:8080',
        credentials: true,
      })
    );
    this.app.disable('x-powered-by');
  }

  getPort(): number {
    return this.port;
  }

  get express(): express.Application {
    return this.app;
  }

  private setupRouting() {
    this.app.use('/api', apiRouter);
    this.app.use('/shared', sharedLinkRouter);
  }

  private setupLogging() {
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
  }

  private catchErrors() {
    this.app.use((err, req, res, next) => errorHanlder(err, res));
  }

  public start = (): Promise<Server> => {
    return new Promise((resolve, reject) => {
      this.app
        .listen(this.port, () => {
          resolve(this);
        })
        .on('error', (err: unknown) => reject(err));
    });
  };
}

export default Server;
