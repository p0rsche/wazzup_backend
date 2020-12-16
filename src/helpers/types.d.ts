import { NextFunction, Request, Response } from 'express';

export interface IRequestWithUserInfo extends Request {
  user?: UserModelJWT;
}

export interface IExpressMiddlewareAsync {
  (req: IRequestWithUserInfo, res: Response, next: NextFunction): Promise<unknown> | void;
}

type Status = 'success' | 'fail' | 'error';

export interface JSONResponse {
  statusCode: number;
  status: Status;
  message?: string;
  data?: unknown;
}

export interface NoteModel {
  id: number;
  user_id: number;
  text: string;
  created: Date;
  updated: Date;
}

export interface UserModel {
  id: number;
  login: string;
  digest: string;
  fullname: string;
  email: string;
  avatar: string;
}

export type UserModelJWT = Omit<UserModel, 'digest'>;

interface Paginator {
  perPage: number;
  currentPage: number;
}
