import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user full profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste@teste.com',
      password: '123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Teste UmDoisTrês',
      email: 'teste123@teste.com',
    });

    expect(updatedUser.name).toBe('Teste UmDoisTrês');
    expect(updatedUser.email).toBe('teste123@teste.com');
    expect(updatedUser.password).toBe(user.password);
  });

  it('should be able to update only the user name', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste@teste.com',
      password: '123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Teste UmDoisTrês',
      email: 'teste@teste.com',
    });

    expect(updatedUser.name).toBe('Teste UmDoisTrês');
    expect(updatedUser.email).toBe('teste@teste.com');
    expect(updatedUser.password).toBe(user.password);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste123@teste.com',
      password: '123123',
    });

    const user = await fakeUsersRepository.create({
      name: 'Teste Filho',
      email: 'testinho@teste.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Teste Filho',
        email: 'teste123@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste123@teste.com',
      password: '123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Teste 123',
      email: 'teste123@teste.com',
      old_password: '123123',
      password: '654321',
    });

    expect(updatedUser.password).toBe('654321');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste123@teste.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Teste 123',
        email: 'teste123@teste.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without confirm old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste123@teste.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Teste 123',
        email: 'teste123@teste.com',
        old_password: 'wrong-old-password',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
