import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
};

interface Response {
  user: User,
  token: string,
};

class AuthenticateSessionService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email/senha combination.');
    };

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      throw new Error('Invalid email/senha combination.');
    };

    const token = sign({}, 'a75043087c75942bb93d77be5e08bfd7', {
      subject: user.id,
      expiresIn: "3d",
    });

    return {
      user,
      token,
    };
  }
};

export default AuthenticateSessionService;
