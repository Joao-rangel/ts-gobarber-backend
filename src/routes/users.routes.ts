import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import UserMap from '../mappers/UserMap';
import ensureAuthentication from '../middlewares/ensureAuthentication';

import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    const mappedUser = UserMap.toDTO(user);

    return response.json(mappedUser);
  } catch (err) {
    return response.status(400).json({ message: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    return response.json(request.file);
  },
);

export default usersRouter;
