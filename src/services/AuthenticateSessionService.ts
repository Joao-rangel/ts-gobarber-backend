import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
};

class AuthenticateSessionService {
  public async execute({ email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email/senha combination.');
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      throw new Error('Invalid email/senha combination.');
    }

    return user;
  }
}

export default AuthenticateSessionService;
