import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list all providers', async () => {
    const userTeste = await fakeUsersRepository.create({
      name: 'Teste 123',
      email: 'teste123@teste.com',
      password: '123123',
    });

    const userTestinho = await fakeUsersRepository.create({
      name: 'Teste Filho',
      email: 'testinho@teste.com',
      password: '123123',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'João cabeludo',
      email: 'cabelo@cortar.com',
      password: '123123',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([userTeste, userTestinho]);
  });
});
