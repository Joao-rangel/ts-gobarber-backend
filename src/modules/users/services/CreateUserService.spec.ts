import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUserRepository();

    const createUser = new CreateUserService(fakeUsersRepository);

    const user = await createUser.execute({
      name: 'teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('teste@teste.com');
  });

  it('should not be able to create user with an email already registered', async () => {
    const fakeUsersRepository = new FakeUserRepository();

    const createUser = new CreateUserService(fakeUsersRepository);

    await createUser.execute({
      name: 'teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    expect(
      createUser.execute({
        name: 'outro teste',
        email: 'teste@teste.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});