import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

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

    @inject('userTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('This email is not registered.');

    await this.userTokensRepository.generate(user.id);

    this.mailProvider.sendMail(
      email,
      'Sua solicitação de recuperação de senha chegou!',
    );
  }
}

export default SendRecoveryEmailService;
