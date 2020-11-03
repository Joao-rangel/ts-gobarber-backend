import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

interface TokenPayLoad {
  // estrutura retornada pelo jsonwebtoken.verify();
  iat: number;
  exp: number;
  sub: string;
}

function ensureAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization; // coletar jwt da header 'bearer 1234qawerq.asdfzxcv.4312eqw';

  if (!authHeader) {
    throw new Error('JWT token is missing');
  }

  const [, token] = authHeader.split(' '); // desestruturação de array descantando a primeira variável;

  try {
    // o try/catch será feito aqui pois queremos um erro personalizado
    const validatedToken = verify(token, authConfig.jwt.secret);

    const { sub } = validatedToken as TokenPayLoad; // forçando uma varíavel com interface TS;

    request.user = {
      // todas as rotas que usam este middleaware terão acesso a request.user.id;
      id: sub,
    };

    return next();
  } catch {
    throw new Error('Invalid JWT Token');
  }
}

export default ensureAuthentication;
