import User from '@modules/users/infra/typeorm/entities/User';

class UserMap {
  public static toDTO(user: User): Omit<User, 'password'> {
    const { password, ...userDTO } = user;

    return userDTO;
  }
}

export default UserMap;
