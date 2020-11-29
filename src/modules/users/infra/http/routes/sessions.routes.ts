import { Router } from 'express';
import UserMap from '@modules/users/mappers/UserMap';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import AuthenticateSessionService from '@modules/users/services/AuthenticateSessionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const usersRepository = new UsersRepository();
  const authenticateUser = new AuthenticateSessionService(usersRepository);

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  const mappedUser = UserMap.toDTO(user);

  return response.json({
    user: mappedUser,
    token,
  });
});

export default sessionsRouter;
