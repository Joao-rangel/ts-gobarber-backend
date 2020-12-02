import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
// import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import SendRecoveryEmailService from './SendRecoveryEmailService';

describe('SendRecoveryEmailService', () => {
  it('should de able to send a requested recovery email', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeMailProvider = new FakeMailProvider();

    const emailSender = jest.spyOn(fakeMailProvider, 'sendMail');

    const sendRecoveryEmail = new SendRecoveryEmailService(
      fakeUserRepository,
      fakeMailProvider,
    );

    await fakeUserRepository.create({
      name: 'Esquecido',
      email: 'teste@teste.com',
      password: '123123',
    });

    await sendRecoveryEmail.execute({ email: 'teste@teste.com' });

    expect(emailSender).toBeCalled();
    // expect(emailSender).toBeCalledWith('teste@teste.com');
  });
});
