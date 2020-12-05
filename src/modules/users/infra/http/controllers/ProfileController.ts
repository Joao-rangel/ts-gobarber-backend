import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import UserMap from '@modules/users/mappers/UserMap';

export default class ProfileController {
  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, password, old_password } = request.body;

    const updateUser = container.resolve(UpdateProfileService);

    const user = await updateUser.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    const mappedUser = UserMap.toDTO(user);

    return response.json(mappedUser);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showUser = container.resolve(ShowProfileService);

    const user = await showUser.execute({ user_id });

    const mappedUser = UserMap.toDTO(user);

    return response.json(mappedUser);
  }
}
