import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all providers', async () => {
    const userTeste = await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste123@teste.com',
      password: '123123',
      provider: true,
    });

    const userTestinho = await fakeUsersRepository.create({
      name: 'Teste Filho',
      email: 'testinho@teste.com',
      password: '123123',
      provider: true,
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'João cabeludo',
      email: 'cabelo@cortar.com',
      password: '123123',
      provider: true,
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([userTeste, userTestinho]);
  });
});
