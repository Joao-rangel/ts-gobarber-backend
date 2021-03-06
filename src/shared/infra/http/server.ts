import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { errors } from 'celebrate';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';
import rateLimiter from './middlewares/rateLimiter';

const app = express();

app.use(cors({ origin: process.env.APP_WEB_URL }));
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.error(err); // eslint-disable-line no-console

    return response.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  },
);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.info(`server started on port ${PORT}!`); // eslint-disable-line no-console
});
