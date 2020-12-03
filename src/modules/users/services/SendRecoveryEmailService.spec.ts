import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import SendRecoveryEmailService from './SendRecoveryEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUserRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendRecoveryEmail: SendRecoveryEmailService;

describe('SendRecoveryEmailService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendRecoveryEmail = new SendRecoveryEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should de able to send a requested recovery email', async () => {
    const emailSender = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'Esquecido',
      email: 'teste@teste.com',
      password: '123123',
    });

    await sendRecoveryEmail.execute({ email: 'teste@teste.com' });

    expect(emailSender).toBeCalled();
  });

  it('should not de able to recover an unregistered email', async () => {
    await expect(
      sendRecoveryEmail.execute({ email: 'teste@teste.com' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a recovery password token', async () => {
    const recoveryToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'Esquecido',
      email: 'teste@teste.com',
      password: '123123',
    });

    await sendRecoveryEmail.execute({ email: 'teste@teste.com' });

    expect(recoveryToken).toBeCalledWith(user.id);
  });
});
