import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail?.id !== user_id) {
      throw new AppError('Email is already being used');
    }

    if (password) {
      if (!old_password) throw new AppError('Missing old password.');

      const checkOldPassword = await this.hashProvider.compareHash(
        user.password,
        old_password,
      );

      if (!checkOldPassword) throw new AppError('Old password does not match.');

      user.password = await this.hashProvider.generateHash(password);
    }

    Object.assign(user, { name, email });

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
