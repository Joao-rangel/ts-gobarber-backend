import { Router } from 'express';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ message: err.message });
  }
});

export default usersRouter;
