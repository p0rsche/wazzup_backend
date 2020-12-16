import 'reflect-metadata';
import 'source-map-support/register';
import 'module-alias/register';
import supertest from 'supertest';

import Server from '../server';

process.env.NODE_ENV = 'test';

import db from '../db';

export class TestFactory {
  private _app: Express.Application;
  private db: any;

  public async init(): Promise<void> {
    this.db = db;
    const server = await new Server().start();
    this._app = server.express;
  }

  public get app(): supertest.SuperTest<supertest.Test> {
    return supertest(this._app);
  }

  public close(): void {
    this.db.destroy(true);
  }
}
