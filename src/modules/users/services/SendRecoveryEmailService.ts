import { injectable, inject } from 'tsyringe';

// import AppError from '@shared/errors/AppError';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';

// import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  email: string;
}

@injectable()
class SendRecoveryEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('mailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    this.mailProvider.sendMail(
      email,
      'Seu pedido de recuperação de senha chegou!',
    );
  }
}

export default SendRecoveryEmailService;
