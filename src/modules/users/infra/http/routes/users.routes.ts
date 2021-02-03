import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';

import { celebrate, Joi, Segments } from 'celebrate';
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),
      password: Joi.string().required(),
      provider: Joi.boolean().required(),
    },
  }),
  usersController.create,
);
usersRouter.patch(
  '/avatar',
  ensureAuthentication,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
