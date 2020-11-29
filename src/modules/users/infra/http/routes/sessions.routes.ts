import { Router } from 'express';
import { container } from 'tsyringe';

import UserMap from '@modules/users/mappers/UserMap';
import AuthenticateSessionService from '@modules/users/services/AuthenticateSessionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUser = container.resolve(AuthenticateSessionService);

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
