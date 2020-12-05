import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste@teste.com',
      password: '123123',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'selfie.jpg',
    });

    expect(user.avatar).toBe('selfie.jpg');
  });

  it('should not be able to update invalid user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'invalidUserId',
        avatarFilename: 'selfie.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to remove old avatar when updating a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste@teste.com',
      password: '123123',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'oldSelfie.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'newSelfie.jpg',
    });

    expect(deleteFile).toBeCalledWith('oldSelfie.jpg');
    expect(user.avatar).toBe('newSelfie.jpg');
  });
});
