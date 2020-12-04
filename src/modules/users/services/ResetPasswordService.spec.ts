import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import ResetPasswordService from './ResetPasswordService';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to change user password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Esquecido',
      email: 'teste@teste.com',
      password: await fakeHashProvider.generateHash('123123'),
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      token,
      password: '654321',
    });

    const updatedUser = await fakeUserRepository.findById(user.id);

    expect(generateHash).toBeCalledWith('654321');
    expect(updatedUser?.password).toBe('654321');
  });

  it('should not be able to reset user password without valid token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'invalid-token',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset non-existing user password', async () => {
    const { token } = await fakeUserTokensRepository.generate('invalid-user');

    await expect(
      resetPasswordService.execute({
        token,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not de able reset password with expired 2 hours token', async () => {
    const user = await fakeUserRepository.create({
      name: 'Esquecido',
      email: 'teste@teste.com',
      password: await fakeHashProvider.generateHash('123123'),
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
