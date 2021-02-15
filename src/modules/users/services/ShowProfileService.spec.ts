import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUserRepository;
let showProfile: ShowProfileService;

describe('showProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste@teste.com',
      password: '123123',
      provider: false,
    });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile.name).toBe('Teste 123');
    expect(profile.email).toBe('teste@teste.com');
  });

  it('should not be able to show non-existing user profile', async () => {
    await expect(
      showProfile.execute({ user_id: 'invented-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
