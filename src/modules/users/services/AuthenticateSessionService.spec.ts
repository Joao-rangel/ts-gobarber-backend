// import AppError from '@shared/errors/AppError';

import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateSessionService from './AuthenticateSessionService';
import CreateUserService from './CreateUserService';

describe('AuthenticateSession', () => {
  it('should able to authenticate user with correct email/password combination', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateSession = new AuthenticateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123123',
    });

    const response = await authenticateSession.execute({
      email: 'teste@teste.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
    expect(response.user.password).toEqual('123123');
  });

  it('should not be able to authenticate user with invalid email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateSession = new AuthenticateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      authenticateSession.execute({
        email: 'teste123@teste.com',
        password: '123456',
      }),
    ).rejects.toThrow(AppError);
  });

  it('should not be able to authenticate user with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateSession = new AuthenticateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    await expect(
      authenticateSession.execute({
        email: 'teste123@teste.com',
        password: 'wrongPassword',
      }),
    ).rejects.toThrow(AppError);
  });
});
