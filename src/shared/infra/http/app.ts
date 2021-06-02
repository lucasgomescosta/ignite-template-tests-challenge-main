import 'reflect-metadata';
import 'express-async-errors';

import express, { NextFunction, Request, Response } from 'express';
//import cors from 'cors';

import '@shared/container';
import { AppError } from '@shared/errors/AppError';
import createCoonection from '@shared/infra/typeorm';

import { router } from './routes';

createCoonection();
const app = express();

//app.use(cors());
app.use(express.json());

app.use('/api/v1', router);

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message} - ${err.name} `,
    });
  }
);

export { app };
