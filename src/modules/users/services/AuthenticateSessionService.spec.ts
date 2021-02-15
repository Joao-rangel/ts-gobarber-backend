import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateSessionService from './AuthenticateSessionService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateSession: AuthenticateSessionService;

describe('AuthenticateSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateSession = new AuthenticateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should able to authenticate user with correct email/password combination', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123123',
      provider: false,
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
    await expect(
      authenticateSession.execute({
        email: 'invalid@teste.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate user with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
      provider: false,
    });

    await expect(
      authenticateSession.execute({
        email: 'teste123@teste.com',
        password: 'wrongPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
