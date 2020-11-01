import { Router } from 'express';
import UserMap from '../mappers/UserMap';

import AuthenticateSessionService from '../services/AuthenticateSessionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const authenticateUser = new AuthenticateSessionService();

    const user = await authenticateUser.execute({
      email,
      password
    });

    const mappedUser = UserMap.toDTO(user);

    return response.json(mappedUser);
  } catch (err) {
    return response.status(400).json({ message: err.message });
  }
});

export default sessionsRouter;
