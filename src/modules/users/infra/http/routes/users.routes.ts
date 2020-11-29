import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import UserMap from '@modules/users/mappers/UserMap';
import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const usersRepository = new UsersRepository();
  const createUser = new CreateUserService(usersRepository);

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  const mappedUser = UserMap.toDTO(user);

  return response.json(mappedUser);
});

usersRouter.patch(
  '/avatar',
  ensureAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    const usersRepository = new UsersRepository();
    const updateUserAvatar = new UpdateUserAvatarService(usersRepository);

    const user = await updateUserAvatar.execute({
      avatarFileName: request.file.filename,
      user_id: request.user.id,
    });

    const mappedUser = UserMap.toDTO(user);

    return response.json(mappedUser);
  },
);

export default usersRouter;
