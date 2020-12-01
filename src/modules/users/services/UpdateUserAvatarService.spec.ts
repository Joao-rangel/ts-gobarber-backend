import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste@teste,com',
      password: '123123',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'selfie.jpg',
    });

    expect(user.avatar).toBe('selfie.jpg');
  });

  it('should not be able to update invalid user', async () => {
    const fakeUsersRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatar.execute({
        user_id: 'invalidUserId',
        avatarFilename: 'selfie.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to remove old avatar when updating a new one', async () => {
    const fakeUsersRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste@teste,com',
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
