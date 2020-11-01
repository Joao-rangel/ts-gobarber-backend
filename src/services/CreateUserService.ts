import { getRepository } from 'typeorm';

import User from '../models/User'

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const emailWasUsed = await usersRepository.findOne({
      where: { email },
    });

    if (emailWasUsed) {
      throw Error('This email is already registered');
    }

    const user = usersRepository.create({
      name,
      email,
      password,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
